import Snoowrap from 'snoowrap';

const connectSnoowrap = () => {
  return new Snoowrap({
    userAgent: 'SALPHBot',
    clientId: process.env.REDDIT_ID,
    clientSecret: process.env.REDDIT_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD,
  });
};

const snoowrapClient = connectSnoowrap();

export { snoowrapClient };
