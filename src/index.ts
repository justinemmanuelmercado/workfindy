import { config } from "dotenv";
import { MockMedium } from "./abstract/Medium";
import { ConsoleChannel } from "./ConsoleChannel";
import { RedditBotTestingGroundWatcher } from "./RedditBotTestingGroundWatcher";
import { RedditPlatform } from "./RedditPlatform";
config();

const redditPlatform = new RedditPlatform();
const tg4bWatcher = new RedditBotTestingGroundWatcher(redditPlatform);
const logChannel = new ConsoleChannel(new MockMedium());

async function main() {
  console.log("STARTING...");
  tg4bWatcher.channels.push(logChannel);
  await tg4bWatcher.listen();
}

main();
