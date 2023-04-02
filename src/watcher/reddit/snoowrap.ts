import Snoowrap from 'snoowrap';

const connectSnoowrap = () => {
  return new Snoowrap({
    userAgent: 'SALPHBot',
    clientId: process.env.SALPHBOT_ID,
    clientSecret: process.env.SALPHBOT_SECRET,
    username: process.env.SALPHBOT_USERNAME,
    password: process.env.SALPHBOT_PASSWORD,
  });
};

const snoowrapClient = connectSnoowrap();

export { snoowrapClient };
