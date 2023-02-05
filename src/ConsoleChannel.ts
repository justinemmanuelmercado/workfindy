import { Channel } from "./abstract/Channel";
import { Medium } from "./abstract/Medium";
import { Notice } from "./abstract/Notice";

export class ConsoleChannel implements Channel {
  name = "Console Channel";
  medium: Medium;
  constructor(medium: Medium) {
    this.medium = medium;
  }
  async sendMessage(notice: Notice) {
    console.log("NEW Notice");
    console.log(notice);
  }
}
