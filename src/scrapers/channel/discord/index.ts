import { connectDiscordClient, DiscordChannel, DiscordChannelFactory } from './DiscordChannel';

const connectChannels = async (channels: DiscordChannel[]) => {
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
  await connectDiscordClient();
  const devDiscordChannel = DiscordChannelFactory.createDevDiscordChannel();
  const redditHiringDiscordChannel = DiscordChannelFactory.createGeneralHiringDiscordChannel();
  return connectChannels([devDiscordChannel, redditHiringDiscordChannel]);
};
