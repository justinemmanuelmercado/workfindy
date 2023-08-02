import { TextChannel, EmbedBuilder, Client, GatewayIntentBits } from 'discord.js';
import { Channel, ChannelConfig } from '../../abstract/Channel';
import type { Notice } from '../../abstract/Notice';
import { matchingWords } from '../../helper/matching-words';
import { truncateString } from '../../helper/truncate-string';
export let discordClient: Client;

export const connectDiscordClient = async (): Promise<Client> => {
  const token = process.env.JOBBYMCJOBFACE_DISCORD_TOKEN || '';
  if (!token) throw new Error('No Discord token found in environment variables');
  const client = new Client({ intents: GatewayIntentBits.Guilds });
  await client.login(token);
  discordClient = client;
  return discordClient;
};
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

interface DiscordChannelConfig extends ChannelConfig {
  channelId: string;
  client: Client;
}

export class DiscordChannel extends Channel {
  channel?: TextChannel;
  config: DiscordChannelConfig;
  constructor(config: DiscordChannelConfig, keywords: string[] = []) {
    super(config, keywords);
    this.config = config;
    if (config.channelId === '') {
      console.error('Channel ID is not set for DiscordChannel: ' + config.name);
    }
  }

  async setChannel(): Promise<DiscordChannel | null> {
    try {
      const cached = this.config.client.channels.cache.get(this.config.channelId) as TextChannel;
      this.channel = cached;
      if (!cached) {
        const channel = await this.config.client.channels.fetch(this.config.channelId);
        this.channel = channel as TextChannel;
      }
      return this;
    } catch (e) {
      console.log("Can't find channel: " + this.config.channelId);
      console.log(e);
    }
    return null;
  }

  noticeMatches = (notice: Notice): string[] => {
    const matches = matchingWords(this.keywords, notice.title);
    return matches;
  };

  sendMessage = async (notice: Notice) => {
    if (this.keywords.length > 0) {
      const matches = this.noticeMatches(notice);
      if (matches.length === 0) return;
    }
    try {
      if (!this.channel) await this.setChannel();
      const messageEmbed = new EmbedBuilder()
        .setColor(0x0099f)
        .setTitle(notice.title)
        .setURL(notice.url)
        .setImage(notice.imageUrl ?? null)
        .setAuthor({ name: notice.authorName, url: notice.authorUrl })
        .setDescription(notice.body.length === 0 ? 'No body' : truncateString(notice.body))
        .setTimestamp();
      await this.channel?.send({ embeds: [messageEmbed] });
    } catch (e) {
      console.log(`[ERROR] Can't send message to channel: ${this.config.name}`);
      console.log(e);
    }
  };
}

export class DiscordChannelFactory {
  static createGeneralHiringDiscordChannel = () => {
    return new DiscordChannel({
      channelId: process.env.JOBBYMCJOBFACE_HIRING_CHANNEL_ID || '',
      client: discordClient,
      name: 'Hiring Channel',
    });
  };
  static createDevDiscordChannel = () => {
    return new DiscordChannel(
      {
        channelId: process.env.JOBBYMCJOBFACE_DEVELOPER_CHANNEL_ID || '',
        client: discordClient,
        name: 'Dev Channel',
      },
      devKeywords
    );
  };
  static createTestDiscordChannel = () => {
    return new DiscordChannel({
      channelId: process.env.JOBBYMCJOBFACE_TEST_CHANNEL_ID || '',
      client: discordClient,
      name: 'Test Channel',
    });
  };
}
