import { Channel } from '../abstract/Channel';
import { ConsoleChannel } from './ConsoleChannel';
import { getDiscordChannels } from './discord';

export const getChannels = async (): Promise<Channel[]> => {
  return [...(await getDiscordChannels()), new ConsoleChannel()];
};
