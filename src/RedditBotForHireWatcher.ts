import { CommentStream, SubmissionStream } from "snoostorm";
import { Comment, Submission } from "snoowrap";
import { Channel } from "./abstract/Channel";
import { Watcher } from "./abstract/Watcher";
import { getSimilarStrings } from "./filters";
import { RedditPlatform } from "./RedditPlatform";

export class RedditBotForHireWatcher implements Watcher {
  id = "RedditBotTestingGround";
  config: any = {};
  platform;
  channels: Channel[] = [];
  keywords: string[] = [];

  constructor(platform: RedditPlatform, keywords: string[]) {
    this.platform = platform;
    this.config.subreddit = "forhire";
    this.keywords = keywords;
    this.connect();
  }

  async connect() {
    const postStream = new SubmissionStream(this.platform.snoowrap, {
      subreddit: this.config.subreddit,
      limit: 5,
      pollTime: 3000,
    });

    const commentStream = new CommentStream(this.platform.snoowrap, {
      subreddit: this.config.subreddit,
      limit: 5,
      pollTime: 3000,
    });

    this.config.streams = [postStream, commentStream];
  }

  async listen() {
    this.config.streams.forEach((stream: CommentStream | SubmissionStream) => {
      stream.on("item", async (item: Comment | Submission) => {
        if (isComment(item)) {
          await this.handleComment(item);
        } else {
          await this.handleSubmission(item);
        }
      });
    });
  }

  async handleComment(item: Comment) {
    const matchesBody = getSimilarStrings(this.keywords, item.body);
    let message = "\n\n";
    message += "\n---------------------------------------------------------";
    message += "\n**Found a match in a comment:**";
    const title = "NEW MATCHED COMMENT IN /r/forhire";
    if (matchesBody.length > 0) {
      message += `\n[LINK HERE](https://www.reddit.com/${item.permalink})`;
      message += "\n---------------------------------------------------------";
      message += `\nMatches the following keywords:`;
      matchesBody.forEach((match) => {
        message += `\n**${match.string} - ${match.snippet}**`;
      });
      message += "\n\n**Body:**\n```" + item.body + "```";
      for (const channel of this.channels) {
        channel.sendMessage({
          title: title,
          body: message,
        });
      }
    }
  }

  async handleSubmission(item: Submission) {
    const matchesTitle = getSimilarStrings(this.keywords, item.title);
    let message = "\n\n";
    message += "\n---------------------------------------------------------";
    message += `\n**NEW POST: ${item.title}**`;
    const title = "NEW MATCHED POST IN /r/forhire";
    if (matchesTitle.length > 0) {
      message += `\n[LINK HERE](https://www.reddit.com/${item.permalink})`;
      message += "\n---------------------------------------------------------";
      message += `\nMatches the following keywords:`;
      matchesTitle.forEach((match) => {
        message += `\n${match.string} - ${match.snippet}`;
      });
      message += "\n\n**Body:**\n```" + item.selftext + "```";
      for (const channel of this.channels) {
        channel.sendMessage({
          title,
          body: message,
        });
      }
    }
  }

  setChannels(channels: Channel[]) {
    this.channels = channels;
  }
}

function isComment(item: Comment | Submission): item is Comment {
  return item.hasOwnProperty("parent_id");
}
