import { Notice } from './Notice';

export type ChannelConfig = {
  name: string;
};
export class Channel {
  constructor(config: ChannelConfig, keywords: string[] = []) {
    this.config = config;
    this.keywords = keywords;
  }
  protected config: ChannelConfig;
  protected keywords: string[] = [];
  public sendMessage = async (message: Notice): Promise<void> => {
    console.log(message);
    throw new Error("Method 'sendMessage' not implemented.");
  };
}
