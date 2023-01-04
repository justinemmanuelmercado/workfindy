import { config } from "dotenv";
import { MockMedium } from "./abstract/Medium";
import { ConsoleChannel } from "./ConsoleChannel";
import { DiscordChannel } from "./DiscordChannel";
import { DiscordMedium } from "./DiscordMedium";
import { RedditBotForHireDeveloperWatcher } from "./RedditBotForHireDeveloperWatcher";
import { RedditBotTestingGroundWatcher } from './RedditBotTestingGroundWatcher';
import { RedditPlatform } from "./RedditPlatform";
config();

const redditPlatform = new RedditPlatform();
const logChannel = new ConsoleChannel(new MockMedium());
const discordMedium = new DiscordMedium();

async function main() {
  console.log("STARTING...");
  await discordMedium.connect();

  const devDiscordChannel = new DiscordChannel(
    discordMedium,
    process.env.JOBBYMCJOBFACE_DEVELOPER_CHANNEL_ID || "",
    "Dev Channel"
  );

  const testDiscordChannel = new DiscordChannel(
    discordMedium,
    process.env.JOBBYMCJOBFACE_TEST_CHANNEL_ID || "",
    "Test Channel"
  );


  

  const redditTestWatcher = new RedditBotTestingGroundWatcher(
    redditPlatform
  )

  const redditFHDeveloperWatcher = new RedditBotForHireDeveloperWatcher(
    redditPlatform
  );

  redditTestWatcher.channels = [testDiscordChannel, logChannel];
  // redditTestWatcher.listen();
  redditFHDeveloperWatcher.setChannels([devDiscordChannel, logChannel]);
  redditFHDeveloperWatcher.listen();
}

main();
