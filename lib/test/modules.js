
// let dbConf = require('../configs')();
// console.log("DB CONF IS", dbConf);

const { Mariadb, Cache, Messenger, redisStore, Logger, addons, utils, Offline } = require("..");

new Mariadb({ name: 'yp', user:process.env.USER, idleTimeout: 60 });
new Cache();
new redisStore();
new Logger();
new Offline();