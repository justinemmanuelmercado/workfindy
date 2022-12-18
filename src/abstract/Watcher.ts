import { Channel } from "./Channel";
import { Platform } from "./Platform";

export abstract class Watcher {
  abstract platform: Platform;

  constructor() {}

  // Each watcher has its own separate config
  abstract config: any;

  // Identifier
  abstract id: string;

  // Establishes connection with the source of data
  abstract connect: () => Promise<void>;

  // Establishes streams
  abstract listen: () => Promise<void>;

  // Channels to send messages to
  abstract channels: Channel[];
}
