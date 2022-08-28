import Snoowrap from "snoowrap";
import { Platform } from "./abstract/Platform";

export class RedditPlatform implements Platform {
  config: any = {};
  constructor() {
    this.connect();
  }

  get snoowrap() {
    return this.config.snoowrap;
  }

  connect() {
    this.config.snoowrap = new Snoowrap({
      userAgent: "SALPHBot",
      clientId: process.env.SALPHBOT_ID,
      clientSecret: process.env.SALPHBOT_SECRET,
      username: process.env.SALPHBOT_USERNAME,
      password: process.env.SALPHBOT_PASSWORD,
    });
  }
}
