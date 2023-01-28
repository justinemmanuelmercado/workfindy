import { CommentStream, SubmissionStream } from "snoostorm";
import { Comment, Submission } from "snoowrap";
import { Channel } from "./abstract/Channel";
import { Watcher } from "./abstract/Watcher";
import { getSimilarStrings, matchingWords } from "./filters";
import { RedditPlatform } from "./RedditPlatform";

export class RedditBotForHireDeveloperWatcher implements Watcher {
  id = "RedditBotTestingGround";
  config: any = {};
  platform;
  channels: Channel[] = [];
  keywords: string[] = [
    "developer",
    "web",
    "angular",
    "react",
    "reactjs",
    "node",
    "nodejs",
    "javascript",
    "python",
    "java",
    "ruby",
    "c#",
    "c++",
    "html",
    "css",
    "typescript",
    "php",
    "ruby",
    "rust",
    "golang",
    "flutter",
    "vue",
    "swift",
    "kotlin",
    "react native",
    "full stack",
  ];

  constructor(platform: RedditPlatform) {
    this.platform = platform;
    this.config.subreddit = "forhire";
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
    const matchesBody = matchingWords(this.keywords, item.body);
    let message = "\n\n";
    message += "\n---------------------------------------------------------";
    message += "\n**Found a match in a comment:**";
    const title = "NEW MATCHED COMMENT IN /r/forhire";
    if (matchesBody.length > 0) {
      message += `\n[LINK HERE](https://www.reddit.com/${item.permalink})`;
      message += "\n---------------------------------------------------------";
      message += `\nMatches the following keywords:`;
      matchesBody.forEach((match) => {
        message += `\n**${match}**`;
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
    const matchesHiring = matchingWords(["HIRING"], item.title);
    // Post is not hiring, so we don't care about it.
    if (matchesHiring.length === 0) {
      return;
    }

    const matchesTitle = matchingWords(this.keywords, item.title);
    const matchesBody = matchingWords(this.keywords, item.selftext);
    let message = "\n\n";
    message += "\n---------------------------------------------------------";
    const title = "NEW MATCHED POST IN /r/forhire";
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
