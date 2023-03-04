import { Client, GatewayIntentBits } from "discord.js";

export class DiscordMedium implements Medium {
  client: Client;
  token: string;
  constructor() {
    this.token = process.env.JOBBYMCJOBFACE_DISCORD_TOKEN || "";
    this.client = new Client({ intents: GatewayIntentBits.Guilds });
  }
  async connect() {
    await this.client.login(this.token);
  }

  async ready(callback: () => void) {
    return new Promise(() => {
      this.client.once("ready", () => {
        callback();
      });
    });
  }
}
