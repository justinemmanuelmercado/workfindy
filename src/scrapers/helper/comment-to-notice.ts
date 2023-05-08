import type { Comment } from 'snoowrap';
import type { Notice } from '../abstract/Notice';

export async function commentToNotice(comment: Comment, sourceName: string): Promise<Notice> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (comment.author.icon_img.then) {
    comment.author.icon_img = await comment.author.icon_img;
  }

  return {
    title: `Comment from ${comment.author.name}`,
    body: `${comment.body}`,
    url: `https://www.reddit.com${comment.permalink}`,
    authorName: comment.author.name,
    authorUrl: `https://www.reddit.com/user/${comment.author.name}`,
    imageUrl: comment.author.icon_img,
    raw: JSON.stringify(comment),
    sourceName,
    keywords: [],
  };
}
