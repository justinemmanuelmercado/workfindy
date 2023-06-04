import { CommentStream, SubmissionStream } from 'snoostorm';
import type Snoowrap from 'snoowrap';
import type { Comment, Submission } from 'snoowrap';
import type { Channel } from '../abstract/Channel';
import type { Notice } from '../abstract/Notice';
import { commentToNotice } from '../helper/comment-to-notice';
import { submissionToNotice } from '../helper/post-to-notice';
import { snoowrapClient } from './snoowrap';

class RedditWatcher {
  snoowrap: Snoowrap = snoowrapClient;
  streams: (CommentStream | SubmissionStream)[] = [];
  channels: Channel[] = [];
  subreddit: string;
  commentFilter: (notice: Notice) => boolean = () => true;
  postFilter: (notice: Notice) => boolean = () => true;
  name = 'Reddit';

  constructor(channels: Channel[], subreddit: string) {
    this.channels = channels;
    this.subreddit = subreddit;

    this.connect();
  }

  async connect() {
    const postStream = new SubmissionStream(this.snoowrap, {
      subreddit: this.subreddit,
      limit: 10,
      pollTime: 30000,
    });

    const commentStream = new CommentStream(this.snoowrap, {
      subreddit: this.subreddit,
      limit: 10,
      pollTime: 30000,
    });

    this.streams = [postStream, commentStream];
  }

  async listen() {
    this.streams.forEach((stream: CommentStream | SubmissionStream) => {
      stream.on('item', async (item: Comment | Submission) => {
        if (isComment(item)) {
          const notice = await commentToNotice(item, this.name);
          if (!this.commentFilter(notice)) return;
          this.sendToChannels(notice);
        } else {
          const notice = submissionToNotice(item, this.name);
          if (!this.postFilter(notice)) return;
          this.sendToChannels(notice);
        }
      });
    });
  }

  sendToChannels = async (notice: Notice) => {
    for (const channel of this.channels) {
      await channel.sendMessage(notice);
    }
  };
}

function isComment(item: Comment | Submission): item is Comment {
  return Object.prototype.hasOwnProperty.call(item, 'parent_id');
}

class RedditWatcherFactory {
  static createForHireWatcher(channels: Channel[]) {
    const forHireWatcher = new RedditWatcher(channels, 'forhire');
    forHireWatcher.postFilter = (notice: Notice): boolean => {
      return notice.title.toLowerCase().includes('[hiring]');
    };
    forHireWatcher.commentFilter = (): boolean => {
      return false;
    };
    return forHireWatcher;
  }
  static createRemoteJsWatcher(channels: Channel[]) {
    const remoteJsWatcher = new RedditWatcher(channels, 'remotejs');
    remoteJsWatcher.postFilter = (notice: Notice): boolean => {
      return notice.title.toLowerCase().includes('hiring');
    };
    remoteJsWatcher.commentFilter = (): boolean => {
      return false;
    };
    return remoteJsWatcher;
  }
  static createTestWatcher(channels: Channel[]) {
    const testWatcher = new RedditWatcher(channels, 'testingground4bots');
    return testWatcher;
  }
}

export { RedditWatcherFactory };
