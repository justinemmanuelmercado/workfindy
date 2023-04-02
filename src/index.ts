import { config } from 'dotenv';
config();

import { RedditWatcherFactory } from './watcher/reddit/RedditWatcher';
import { getChannels } from './channel';

async function main() {
  console.log('STARTING: ' + new Date().toLocaleString());
  const channels = await getChannels();

  const remoteJsWatcher = RedditWatcherFactory.createRemoteJsWatcher(channels);
  const forHireWatcher = RedditWatcherFactory.createForHireWatcher(channels);

  remoteJsWatcher.listen();
  forHireWatcher.listen();

  console.log('STARTED: ', new Date().toLocaleString());
}

main().catch((e) => console.error(e));

// .finally(async () => {
//   await prisma.$disconnect()
// })
