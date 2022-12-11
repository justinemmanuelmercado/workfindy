import { Medium } from "./Medium";
import { Notice } from "./Notice";
export abstract class Channel {
  abstract name: string;
  constructor(public medium: Medium) {}
  abstract sendMessage: (message: Notice) => Promise<void>;
}
