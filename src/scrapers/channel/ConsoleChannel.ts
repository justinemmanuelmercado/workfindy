import { Channel } from '../abstract/Channel';
import type { Notice } from '../abstract/Notice';

export class ConsoleChannel extends Channel {
  constructor(config = { name: 'ConsoleChannel' }) {
    super(config);
  }

  sendMessage = async (notice: Notice) => {
    console.log('NEW Notice');
    console.log(notice);
  };
}
