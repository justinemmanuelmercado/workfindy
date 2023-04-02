// The name "message" is too common in the discord bot
export interface Notice {
  title: string;
  body: string;
  url: string;
  authorName: string;
  authorUrl: string;
  raw: string;

  imageUrl?: string;
  keywords?: string[];
}
