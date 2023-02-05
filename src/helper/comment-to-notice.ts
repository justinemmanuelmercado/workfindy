import { Comment } from 'snoowrap';
import { Notice } from '../abstract/Notice';

export async function commentToNotice(comment: Comment, keywords: string[] = []): Promise<Notice> {
  // @ts-ignore
  if(comment.author.icon_img.then){
    comment.author.icon_img = await comment.author.icon_img;
  }

  return {
    title: `Comment from ${comment.author.name}`,
    body: `${comment.permalink} - ${comment.body}`,
    url: `https://www.reddit.com${comment.permalink}`,
    authorName: comment.author.name,
    authorUrl: `https://www.reddit.com/user/${comment.author.name}`,
    imageUrl: comment.author.icon_img,
    keywords
  };
}