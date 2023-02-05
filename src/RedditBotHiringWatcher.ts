import { CommentStream, SubmissionStream } from "snoostorm";
import { Comment, Submission } from "snoowrap";
import { Channel } from "./abstract/Channel";
import { Notice } from './abstract/Notice';
import { Watcher } from "./abstract/Watcher";
import { matchingWords } from "./filters";
import { commentToNotice } from './helper/comment-to-notice';
import { submissionToNotice } from './helper/post-to-notice';
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
    if (matchesBody.length > 0) {
      this.sendToChannels(await commentToNotice(item));
    }
  }

  sendToChannels = async (notice: Notice) => {
    for (const channel of this.channels) {
      await channel.sendMessage(notice);
    }
  };

  async handleSubmission(item: Submission) {
    const matchesTitle = matchingWords(this.keywordsPostTitle ?? [], item.title);
    const matchesBody = matchingWords(this.keywordsPostBody ?? [], item.selftext);
    if (matchesTitle.length > 0 || matchesBody.length > 0) {
      this.sendToChannels(submissionToNotice(item));
    }
  }

  setChannels(channels: Channel[]) {
    this.channels = channels;
  }
}

function isComment(item: Comment | Submission): item is Comment {
  return item.hasOwnProperty("parent_id");
}
