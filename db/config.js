const env = process.env;

const config = {
   db: {
      host: env.DB_HOST || 'us-cdbr-east-05.cleardb.net',
      user: env.DB_USER || 'b36051ff385f38',
      password: env.DB_PASSWORD || '4c2ac879',
      database: env.DB_NAME || 'heroku_80e2ea22973feca',
   },
}

module.exports = config;