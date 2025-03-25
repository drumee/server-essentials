const { name, version, description } = require('../package.json');
const addons = require("./addons");
const Attr = require("./lex/attribute");
const Constants = require("./lex/constants");
const dbConf = require("./configs");
const Events = require("./lex/event");
const Logger = require("./logger");
const Mariadb = require("./mariadb");
const Messenger = require("./messenger");
const Network = require("./network");
const Offline = require("./offline");
const Permission = require("./lex/permission");
const Privilege = require("./lex/privilege");
const Remit = require("./lex/remit");
const Script = require("./lex/script");
const Template = require("./template");
const subtleCrypto = require("./subtleCrypto");
const { 
  sysEnv, getSysConst, setSysConst, loadSysEnv, getUiInfo, getPluginsInfo
} = require("./sysEnv");
const utils = require("./utils");
const TFauth = require("./utils/mfa");
const {sendSms} = require("./utils/mfa");
let DrumeeCache;
if (global.DrumeeSharedCache) {
  DrumeeCache = global.DrumeeSharedCache;
} else {
  DrumeeCache = require("./cache");
  global.DrumeeSharedCache = DrumeeCache;
}

let RedisStore;
if (global.SharedRedisStore) {
  RedisStore = global.SharedRedisStore;
} else {
  RedisStore = require("./redis-store");
  global.SharedRedisStore = RedisStore;
}


const { permissionValue } = Permission;
const { 
  detectFiletype,
  ensureObject,
  getFileinfo,
  getPartialBuffer,
  nullValue,
  randomString,
  sleep,
  timestamp,
  toArray,
  uniqueId,
} = utils;
module.exports = {
  addons,
  Attr,
  Cache: DrumeeCache,
  Constants,
  dbConf,
  detectFiletype,
  DrumeeCache,
  ensureObject,
  Events,
  getFileinfo,
  getPartialBuffer,
  getUiInfo,
  getPluginsInfo,
  Logger,
  Mariadb,
  MessageBus:RedisStore,
  Messenger,
  Network,
  nullValue,
  Offline,
  Permission,
  permissionValue,
  Privilege,
  randomString,
  RedisStore,
  Remit,
  Script,
  sendSms,
  sleep,
  subtleCrypto,
  sysEnv,
  getSysConst, 
  setSysConst, 
  loadSysEnv,
  Template,
  TFauth,
  timestamp,
  toArray,
  uniqueId,
  utils,
  Info: { version, description, name },
};
