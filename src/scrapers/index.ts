import { config } from 'dotenv';
config();

import { RedditWatcherFactory } from './reddit/RedditWatcher';
import { connectDiscordClient, DiscordChannelFactory } from './channel/discord/DiscordChannel';
import { ConsoleChannel } from './channel/ConsoleChannel';
import { Channel } from './abstract/Channel';
import { DatabaseChannelFactory } from './channel/db/DatabaseChannel';
import { prisma } from './data/prisma-client';

async function main() {
  console.log('STARTING: ' + new Date().toLocaleString());
  await connectDiscordClient();
  const discordChannels = await Promise.all([
    DiscordChannelFactory.createDevDiscordChannel().setChannel(),
    DiscordChannelFactory.createGeneralHiringDiscordChannel().setChannel(),
  ]);
  const filteredChannels = discordChannels.filter((d) => d !== null) as Channel[];
  filteredChannels.push(new ConsoleChannel());
  filteredChannels.push(DatabaseChannelFactory.createDatabaseChannel());

  const remoteJsWatcher = RedditWatcherFactory.createRemoteJsWatcher(filteredChannels);
  const forHireWatcher = RedditWatcherFactory.createForHireWatcher(filteredChannels);

  remoteJsWatcher.listen();
  forHireWatcher.listen();
  console.log('STARTED: ', new Date().toLocaleString());
}

async function test() {
  console.log('STARTING TEST: ' + new Date().toLocaleString());
  await connectDiscordClient();
  const channels = await Promise.all([DiscordChannelFactory.createTestDiscordChannel().setChannel()]);
  const filtered = channels.filter((d) => d !== null) as Channel[];
  filtered.push(new ConsoleChannel());
  const testWatcher = RedditWatcherFactory.createTestWatcher(filtered);
  testWatcher.listen();
  console.log('STARTED: ', new Date().toLocaleString());
}

test()
  .catch((e) => console.error(e))
  .finally(async () => {
    console.log('DISCONNECTING: ' + new Date().toLocaleString());
    await prisma.$disconnect();
  });
