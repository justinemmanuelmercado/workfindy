import { TextChannel, EmbedBuilder, Client } from 'discord.js';
import { Channel } from './abstract/Channel';
import { Notice } from './abstract/Notice';
import { matchingWords } from './filters';
import { truncateString } from './helper/truncate-string';

type DiscordChannelConfig = {
  channelId: string;
  client: Client;
};

export class DiscordChannel extends Channel<DiscordChannelConfig> {
  channel?: TextChannel;
  constructor(config: DiscordChannelConfig, name: string, keywords: string[] = []) {
    super(config, name, keywords);
    if (config.channelId === '') {
      console.error('Channel ID is not set for DiscordChannel: ' + name);
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
      console.log(`[ERROR] Can't send message to channel: ${this.name}`);
      console.log(notice);
      console.log(e);
    }
  };
}
