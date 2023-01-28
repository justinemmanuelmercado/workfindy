import { CommentStream, SubmissionStream } from "snoostorm";
import { Comment, Submission } from "snoowrap";
import { Channel } from "./abstract/Channel";
import { Watcher } from "./abstract/Watcher";
import { matchingWords } from "./filters";
import { RedditPlatform } from "./RedditPlatform";

export class RedditBotHiringWatcher implements Watcher {
  id: string = "RedditBotHiringWatcher";
  config: any = {};
  platform;
  channels: Channel[] = [];
  keywordsPostTitle?: string[];
  keywordsPostBody?: string[];
  keywordsCommentBody?: string[];
  subreddit: string;

  constructor(
    platform: RedditPlatform,
    options: {
      keywordsPostTitle?: string[];
      keywordsPostBody?: string[];
      keywordsCommentBody?: string[];
      channels: Channel[];
      subreddit: string;
    }
  ) {
    this.platform = platform;

    this.keywordsPostTitle = options.keywordsPostTitle;
    this.keywordsPostBody = options.keywordsPostBody;
    this.keywordsCommentBody = options.keywordsCommentBody;
    this.channels = options.channels;
    this.subreddit = options.subreddit;

    this.connect();
  }

  async connect() {
    const postStream = new SubmissionStream(this.platform.snoowrap, {
      subreddit: this.subreddit,
      limit: 10,
      pollTime: 30000,
    });

    const commentStream = new CommentStream(this.platform.snoowrap, {
      subreddit: this.subreddit,
      limit: 10,
      pollTime: 30000,
    });

    this.config.streams = [postStream, commentStream];
  }

  async listen() {
    this.config.streams.forEach((stream: CommentStream | SubmissionStream) => {
      stream.on("item", async (item: Comment | Submission) => {
        if (isComment(item)) {
          if(!this.keywordsCommentBody) {
            return;
          }
          await this.handleComment(item);
        } else {
          if(!this.keywordsPostTitle && !this.keywordsPostBody) {
            return;
          }
          await this.handleSubmission(item);
        }
      });
    });
  }

  async handleComment(item: Comment) {
    if(!this.keywordsCommentBody) {
      return;
    }

    const matchesBody = matchingWords(this.keywordsCommentBody, item.body);
    let message = "\n\n";
    message += "\n---------------------------------------------------------";
    message += "\n**Found a match in a comment:**";
    const title = "NEW MATCHED COMMENT IN /r/" + this.subreddit;
    if (matchesBody.length > 0) {
      message += `\n[LINK HERE](https://www.reddit.com/${item.permalink})`;
      message += "\n---------------------------------------------------------";
      message += `\nMatches the following keywords:`;
      matchesBody.forEach((match) => {
        message += `\n**${match}**`;
      });
      message += "\n\n**Body:**\n```" + item.body + "```";
      this.sendToChannels({
        title,
        body: message,
      });
    }
  }

  sendToChannels = async (message: { title: string; body: string }) => {
    for (const channel of this.channels) {
      await channel.sendMessage({
        title: message.title,
        body: message.body,
      });
    }
  };

  async handleSubmission(item: Submission) {
    const matchesTitle = matchingWords(this.keywordsPostTitle ?? [], item.title);
    const matchesBody = matchingWords(this.keywordsPostBody ?? [], item.selftext);
    console.log("L ", matchesTitle, item.title);
    let message = "\n\n";
    message += "\n---------------------------------------------------------";
    const title = "NEW MATCHED POST IN /r/" + this.subreddit;
    if (matchesTitle.length > 0 || matchesBody.length > 0) {
      message += `\n[LINK HERE](https://www.reddit.com/${item.permalink})`;
      message += "\n---------------------------------------------------------";
      message += `\nMatches the following keywords:`;
      matchesTitle.forEach((match) => {
        message += `\n${match}`;
      });
      matchesBody.forEach((match) => {
        message += `\n${match}`;
      });
      message += "\n\n**Title:**\n```" + item.title + "```";

      this.sendToChannels({
        title,
        body: message,
      });
    }
  }

  setChannels(channels: Channel[]) {
    this.channels = channels;
  }
}

function isComment(item: Comment | Submission): item is Comment {
  return item.hasOwnProperty("parent_id");
}
