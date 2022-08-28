import { Medium } from "./Medium";

// Channels for the medium. e.g. discord threads
export interface Message {
  body: string;
  title: string;
}

export abstract class Channel {
  abstract name: string;
  constructor(public medium: Medium) {}
  abstract sendMessage: (message: Message) => Promise<void>;
}
