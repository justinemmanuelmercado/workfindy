import { Submission } from 'snoowrap';
import { Notice } from '../abstract/Notice';

export function submissionToNotice(submission: Submission, sourceName: string): Notice {
  const imageUrl = submission.preview?.enabled ? submission.preview.images[0].source.url : undefined;

  return {
    title: `${submission.title}`,
    body: `${submission.selftext}`,
    url: submission.url,
    authorName: submission.author.name,
    authorUrl: `https://www.reddit.com/user/${submission.author.name}`,
    imageUrl,
    raw: JSON.stringify(submission),
    sourceName,
    keywords: [],
  };
}
