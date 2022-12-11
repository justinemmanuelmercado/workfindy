import { CommentStream, SubmissionStream } from "snoostorm";
import { Comment, Submission } from "snoowrap";
import { Channel } from "./abstract/Channel";
import { Watcher } from "./abstract/Watcher";
import { RedditPlatform } from "./RedditPlatform";

export class RedditBotTestingGroundWatcher implements Watcher {
  id = "RedditBotTestingGround";
  config: any = {};
  platform;
  channels: Channel[] = [];

  constructor(platform: RedditPlatform) {
    this.platform = platform;
    this.config.subreddit = "testingground4bots";
    this.connect();
  }

  async connect() {
    const postStream = new SubmissionStream(this.platform.snoowrap, {
      subreddit: this.config.subreddit,
      limit: 10,
      pollTime: 3000,
    });

    const commentStream = new CommentStream(this.platform.snoowrap, {
      subreddit: this.config.subreddit,
      limit: 10,
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
    for (const channel of this.channels) {
      channel.sendMessage({
        title: `NEW COMMENT`,
        body: `${item.permalink} - ${item.body}`,
      });
    }
  }
  async handleSubmission(item: Submission) {
    for (const channel of this.channels) {
      channel.sendMessage({
        title: `NEW POST - ${item.title}`,
        body: `${item.url}`,
      });
    }
  }
}

function isComment(item: Comment | Submission): item is Comment {
  return item.hasOwnProperty("parent_id");
}
