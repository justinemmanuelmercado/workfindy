import { TextChannel } from "discord.js";
import { Channel } from "./abstract/Channel";
import { Notice } from "./abstract/Notice";
import { DiscordMedium } from "./DiscordMedium";

export class DiscordChannel implements Channel {
  name: string;
  channel?: TextChannel;
  medium: DiscordMedium;
  channelId: string;
  constructor(medium: DiscordMedium, channelId: string, name: string) {
    // Test if channelId is an empty string, throw error
    if (channelId === "") {
      throw new Error("Channel ID is not set for DiscordChannel: " + name);
    }

    this.medium = medium;
    this.medium.ready(() => this.setChannel());

    this.channelId = channelId;

    this.name = name;
  }

  async setChannel() {
    try {
      const cached = this.medium.client.channels.cache.get(
        this.channelId
      ) as TextChannel;
      this.channel = cached;
      if (!cached) {
        const channel = await this.medium.client.channels.fetch(this.channelId);
        this.channel = channel as TextChannel;
      }
    } catch (e) {
      console.log("Can't find channel: " + this.channelId);
      console.log(e);
    }
  }

  async sendMessage(notice: Notice) {
    if (!this.channel) await this.setChannel();
    try {
      await this.channel?.send(notice.body);
    } catch (e) {
      console.log(
        `[ERROR] Can't send message to channel: ${this.channelId} ${this.name}`
      );
      console.log(e);
    }
  }
}
