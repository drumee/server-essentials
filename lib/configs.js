const { existsSync } = require("fs");
const { resolve } = require("path");
const { readFileSync } = require("jsonfile");
const { exec } = require("shelljs");
const { isEmpty } = require("lodash");
const sysEnv = require("./sysEnv");
const { instance, credential_dir } = sysEnv();

const DEFAULT_CONF = resolve(credential_dir, "db.json");
const INSTANTCE_CONF = resolve(credential_dir, instance, "db.json");

let dbConf = {};
let socketPath = "/var/run/mysqld/mysqld.sock";
try {
  socketPath = exec(`mariadb_config --socket`, {
    silent: true,
  }).stdout;
  if (socketPath) {
    socketPath = socketPath.trim();
  }
} finally {
}

if (existsSync(INSTANTCE_CONF)) {
  dbConf = readFileSync(INSTANTCE_CONF);
} else if (existsSync(DEFAULT_CONF)) {
  dbConf = readFileSync(DEFAULT_CONF);
} else {
  dbConf.socketPath = socketPath || "/var/run/mysqld/mysqld.sock";
}

if (isEmpty(dbConf)) {
  dbConf = { socketPath };
}

module.exports = function () {
  return dbConf;
};
