import { CommentStream, SubmissionStream } from "snoostorm";
import { Comment, Submission } from "snoowrap";
import { Channel } from "./abstract/Channel";
import { Watcher } from "./abstract/Watcher";
import { matchingWords } from "./filters";
import { commentToNotice } from "./helper/comment-to-notice";
import { submissionToNotice } from "./helper/post-to-notice";
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
      limit: 10,
      pollTime: 10000,
    });

    const commentStream = new CommentStream(this.platform.snoowrap, {
      subreddit: this.config.subreddit,
      limit: 10,
      pollTime: 10000,
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
    if (matchesBody.length > 0) {
      for (const channel of this.channels) {
        channel.sendMessage(await commentToNotice(item, matchesBody));
      }
    }
  }

  async handleSubmission(item: Submission) {
    const matchesHiring = matchingWords(["[hiring]"], item.title);
    // Post is not hiring, so we don't care about it.
    if (matchesHiring.length === 0) {
      return;
    }

    const matchesTitle = matchingWords(this.keywords, item.title);
    const matchesBody = matchingWords(this.keywords, item.selftext);
    if (matchesTitle.length > 0 || matchesBody.length > 0) {
      for (const channel of this.channels) {
        channel.sendMessage(
          submissionToNotice(item, [...matchesBody, ...matchesTitle])
        );
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
