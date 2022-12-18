import { config } from "dotenv";
import { MockMedium } from "./abstract/Medium";
import { ConsoleChannel } from "./ConsoleChannel";
import { DiscordChannel } from "./DiscordChannel";
import { DiscordMedium } from "./DiscordMedium";
import { RedditBotForHireWatcher } from "./RedditBotForHireWatcher";
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
  // An array of words related to job postings for web developers, includes job description and popular languages and frameworks limit to one word each value
  const keywords = [
    "developer",
    "web",
    "angular",
    "react",
    "reactjs",
    "node",
    "nodejs",
    "javascript",
    "python",
    "java",
    "ruby",
    "c#",
    "c++",
    "html",
    "css",
    "typescript",
    "php",
    "ruby",
    "rust",
    "golang",
    "flutter",
    "vue",
    "swift",
    "kotlin",
    "react native",
    "full stack",
  ];

  const redditFHDeveloperWatcher = new RedditBotForHireWatcher(
    redditPlatform,
    keywords
  );
  redditFHDeveloperWatcher.setChannels([devDiscordChannel, logChannel]);
  redditFHDeveloperWatcher.listen();
}

main();
