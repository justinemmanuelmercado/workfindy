import { Client, GatewayIntentBits } from 'discord.js';
import { DiscordChannel, DiscordChannelFactory } from './DiscordChannel';

export const connectDiscordClient = async (): Promise<Client> => {
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
export const getDiscordChannels = async () => {
  const discordClient = await connectDiscordClient();
  const devDiscordChannel = DiscordChannelFactory.createDevDiscordChannel(discordClient);
  const redditHiringDiscordChannel = DiscordChannelFactory.createGeneralHiringDiscordChannel(discordClient);
  return connectChannels(discordClient, [devDiscordChannel, redditHiringDiscordChannel]);
};
