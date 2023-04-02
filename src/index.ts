import { config } from 'dotenv';
import { DiscordChannel } from './channel/DiscordChannel';
import { Client, GatewayIntentBits } from 'discord.js';
import Snoowrap from 'snoowrap';
import { RedditWatcher } from './watcher/RedditWatcher';
import { Notice } from './abstract/Notice';
import { ConsoleChannel } from './channel/ConsoleChannel';
config();

const devKeywords = [
  'software',
  'developer',
  'web',
  'angular',
  'react',
  'reactjs',
  'svelte',
  'tailwind',
  'node',
  'node.js',
  'nodejs',
  'javascript',
  'python',
  'java',
  'ruby',
  'c#',
  'c++',
  'html',
  'css',
  'typescript',
  'php',
  'ruby',
  'rust',
  'golang',
  'flutter',
  'vue',
  'swift',
  'kotlin',
  'react native',
  'full stack',
];

const connectDiscordClient = async (): Promise<Client> => {
  const token = process.env.JOBBYMCJOBFACE_DISCORD_TOKEN || '';
  if (!token) throw new Error('No Discord token found in environment variables');
  const client = new Client({ intents: GatewayIntentBits.Guilds });
  await client.login(token);
  return client;
};

const connectChannels = async (client: Client, channels: DiscordChannel[]) => {
  const connectedChannels: DiscordChannel[] = [];
  for (const channel of channels) {
    const ch = await channel.setChannel();
    if (ch) {
      connectedChannels.push(ch);
    }
  }
  return connectedChannels.filter(Boolean);
};

const connectSnoowrap = () => {
  return new Snoowrap({
    userAgent: 'SALPHBot',
    clientId: process.env.SALPHBOT_ID,
    clientSecret: process.env.SALPHBOT_SECRET,
    username: process.env.SALPHBOT_USERNAME,
    password: process.env.SALPHBOT_PASSWORD,
  });
};

async function main() {
  console.log('STARTING: ' + new Date().toLocaleString());
  const snoowrapClient = connectSnoowrap();
  const discordClient = await connectDiscordClient();
  const devDiscordChannel = new DiscordChannel(
    {
      channelId: process.env.JOBBYMCJOBFACE_DEVELOPER_CHANNEL_ID || '',
      client: discordClient,
    },
    'Dev Channel',
    devKeywords
  );

  const redditHiringDiscordChannel = new DiscordChannel(
    {
      channelId: process.env.JOBBYMCJOBFACE_HIRING_CHANNEL_ID || '',
      client: discordClient,
    },
    'Hiring Channel'
  );
  const consoleChannel = new ConsoleChannel();
  const channels = await connectChannels(discordClient, [devDiscordChannel, redditHiringDiscordChannel]);
  const forHireWatcher = new RedditWatcher(snoowrapClient, [consoleChannel, ...channels], 'forhire');
  forHireWatcher.postFilter = (notice: Notice): boolean => {
    return notice.title.toLowerCase().includes('[hiring]');
  };
  forHireWatcher.commentFilter = (): boolean => {
    return false;
  };
  const remoteJsWatcher = new RedditWatcher(snoowrapClient, [consoleChannel, ...channels], 'remotejs');
  remoteJsWatcher.postFilter = (notice: Notice): boolean => {
    return notice.title.toLowerCase().includes('hiring');
  };
  remoteJsWatcher.commentFilter = (): boolean => {
    return false;
  };
  remoteJsWatcher.listen();
  forHireWatcher.listen();
  // log out date in the format MM/DD/YYYY HH:MM:SS
  console.log('STARTED: ', new Date().toLocaleString());
}

main().catch((e) => console.error(e));

// .finally(async () => {
//   await prisma.$disconnect()
// })
