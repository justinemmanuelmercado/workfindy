import { config } from "dotenv";
import { MockMedium } from "./abstract/Medium";
import { ConsoleChannel } from "./ConsoleChannel";
import { DiscordChannel } from "./DiscordChannel";
import { DiscordMedium } from "./DiscordMedium";
import { RedditBotTestingGroundWatcher } from "./RedditBotTestingGroundWatcher";
import { RedditPlatform } from "./RedditPlatform";
config();

const redditPlatform = new RedditPlatform();
const tg4bWatcher = new RedditBotTestingGroundWatcher(redditPlatform);
const logChannel = new ConsoleChannel(new MockMedium());
const discordMedium = new DiscordMedium();

async function main() {
  console.log("STARTING...");
  await discordMedium.connect();
  const testDiscordChannel = new DiscordChannel(
    discordMedium,
    process.env.JOBBYMCJOBFACE_TEST_CHANNEL_ID || "",
    "Test Channel"
  );

  tg4bWatcher.channels.push(logChannel);
  tg4bWatcher.channels.push(testDiscordChannel);
  await tg4bWatcher.listen();
}

main();
