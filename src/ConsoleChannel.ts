import { Channel } from "./abstract/Channel";
import { Notice } from "./abstract/Notice";

export class ConsoleChannel extends Channel<{}> {
  constructor(config: {} = {}, name: string = "ConsoleChannel") {
    super(config, name);
  }

  sendMessage = async (notice: Notice) => {
    console.log("NEW Notice");
    console.log(notice);
  }
}
