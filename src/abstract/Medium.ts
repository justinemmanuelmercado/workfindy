// This class sends messages to the subscribed messaging mediums
export abstract class Medium {
  abstract connect: () => Promise<void>;
}

export class MockMedium implements Medium {
  async connect() {}
}
