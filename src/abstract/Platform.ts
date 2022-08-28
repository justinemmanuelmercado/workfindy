import { Watcher } from "./Watcher";

export abstract class Platform {
  abstract connect: () => any;
  config: any;
}
