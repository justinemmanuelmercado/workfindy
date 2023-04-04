import { Channel, ChannelConfig } from '../../abstract/Channel';
import { Notice } from '../../abstract/Notice';
import { createNotice } from '../../data/helper/notice';

interface DatabaseChannelConfig extends ChannelConfig {
  name: string;
}

export class DatabaseChannel extends Channel {
  constructor(config: DatabaseChannelConfig) {
    super(config);
  }

  sendMessage = async (notice: Notice) => {
    await createNotice(notice);
  };
}

export class DatabaseChannelFactory {
  static createDatabaseChannel() {
    return new DatabaseChannel({
      name: 'Database Channel',
    });
  }
}
