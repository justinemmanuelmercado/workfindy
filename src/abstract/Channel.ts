import { Notice } from "./Notice";
export class Channel<T> {
  constructor(config: T, name: string, keywords: string[] = []) {
    this.config = config;
    this.name = name;
    this.keywords = keywords;
  }
  protected config: T;
  protected name: string = "";
  protected keywords: string[] = [];
  public sendMessage = async (message: Notice): Promise<void> => {
    throw new Error("Method 'sendMessage' not implemented.");
  };
}
