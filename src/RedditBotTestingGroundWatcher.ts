import { CommentStream, SubmissionStream } from "snoostorm";
import { Comment, Submission } from "snoowrap";
import { Channel } from "./abstract/Channel";
import { Watcher } from "./abstract/Watcher";
import { commentToNotice } from './helper/comment-to-notice';
import { submissionToNotice } from './helper/post-to-notice';
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
      pollTime: 30000,
    });

    const commentStream = new CommentStream(this.platform.snoowrap, {
      subreddit: this.config.subreddit,
      limit: 10,
      pollTime: 30000,
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
      channel.sendMessage(await commentToNotice(item));
    }
  }
  async handleSubmission(item: Submission) {
    for (const channel of this.channels) {
      channel.sendMessage(submissionToNotice(item));
    }
  }
}

function isComment(item: Comment | Submission): item is Comment {
  return item.hasOwnProperty("parent_id");
}
