const { existsSync } = require("fs");
const { join } = require("path");
const { readFileSync } = require("jsonfile");
const { isEmpty } = require("lodash");
const sysEnv = require("./sysEnv");
const { instance, credential_dir, socketPath } = sysEnv();

const DEFAULT_CONF = join(credential_dir, "db.json");
const INSTANTCE_CONF = join(credential_dir, instance, "db.json");

let dbConf = {};

if (existsSync(INSTANTCE_CONF)) {
  dbConf = readFileSync(INSTANTCE_CONF);
} else if (existsSync(DEFAULT_CONF)) {
  dbConf = readFileSync(DEFAULT_CONF);
} else {
  dbConf.socketPath = socketPath;
}

if (isEmpty(dbConf)) {
  dbConf = { socketPath };
}

module.exports = function (opt) {
  return { ...dbConf, ...opt };
};
