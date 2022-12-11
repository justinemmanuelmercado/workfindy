import { TextChannel } from "discord.js";
import { Channel } from "./abstract/Channel";
import { Notice } from "./abstract/Notice";
import { DiscordMedium } from "./DiscordMedium";

export class TestDiscordChannel implements Channel {
  name: string = "Test Discord Channel";
  channel?: TextChannel;
  medium: DiscordMedium;
  channelId: string = process.env.JOBBYMCJOBFACE_TEST_CHANNEL_ID || "";

  constructor(medium: DiscordMedium) {
    this.medium = medium;
    this.medium.ready(() => this.setChannel());
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

    await this.channel?.send(notice.body);
  }
}
