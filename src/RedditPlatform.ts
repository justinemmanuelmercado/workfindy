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

  }
}
