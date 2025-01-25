const { isString, isArray } = require("lodash");
const { UNKNOWN_ERROR } = require("./lex/constants");
const DEFAULT_LANGUAGE = "en";
const { readFileSync } = require("jsonfile");
const { existsSync } = require("fs");

const Filecap = new Map();
const Sysconf = new Map();
const Lexicon = new Map();
const Env = new Map();
let DefaultLexicon = {};

let sys_languages = ["en", "fr", "kh", "ru", "zh"];
const CONF_FILE = "/etc/drumee/conf.d/drumee.json";

if (existsSync(CONF_FILE)) {
  ({ sys_languages } = readFileSync(CONF_FILE));
} else {
  ({ sys_languages } = require('../default/drumee.json'));
}

//########################################
class DrumeeCache {
  constructor() {
    if (DrumeeCache._instance) {
      return DrumeeCache._instance;
    }
    return (DrumeeCache._instance = this);
  }

  /**
   *
   * @param {*} extension
   * @returns
   */
  static getFilecap(extension) {
    return Filecap.get(extension) || {};
  }

  /**
   *
   * @param {*} extension
   * @returns
   */
  static getSysConf(key) {
    return Sysconf.get(key);
  }

  /**
   *
   * @param {*} extension
   * @returns
   */
  static languages() {
    return sys_languages;
  }

  /**
   *  
   * @param {*} 
   * @returns
   */
  static stop() {
    /** DO NOT REMOVE */
    //console.log("Cache stopped");
  }

  /**
   * 
   */
  static setEnv(arg1, arg2) {
    if (arg1 && arg2) {
      Env.set(arg1, arg2)
    } else {
      for (let k in arg1) {
        Env.set(k, arg1[k])
      }
    }
  }

  /**
   * 
   */
  static getEnv(arg) {
    return Env.get(arg)
  }

  /**
   *
   */
  static async load(db, force = 0) {
    if (Lexicon && Lexicon.size && force == 0) {
      console.debug("Cache already loaded. Skipped...");
      return;
    }
    console.debug("Loading cache...");
    const Jsonfile = require("jsonfile");
    const Path = require("path");
    let Db = require("@drumee/server-essentials/lib/mariadb");
    const Fs = require("fs");

    let yp = db || Env.get('yp') || new Db({ name: "yp" });

    let data = await yp.await_query(
      "select extension, category, mimetype, capability from filecap"
    );
    for (let d of data) {
      Filecap.set(d.extension, d);
    }

    data = await yp.await_proc("get_sys_conf");
    let items = [];
    if (isArray(data[0])) {
      items = data[0];
    } else {
      items = data;
    }
    for (let d of items) {
      Sysconf.set(d.key, d.value);
    }
    if (db && db.isValid()) {
      db.end();
    }
    let base = Path.resolve(__dirname, "dataset", "locale");
    if (!Fs.existsSync(base)) {
      base = Path.resolve(__dirname, "src", "dataset", "locale");
    }

    let missing = [];
    for (let l of sys_languages) {
      let file = Path.resolve(base, `${l}.json`);
      console.log('Loading cache from', file);
      if (!Fs.existsSync(file)) {
        console.warn(
          `Lexicon file ${file} not found (skiped), will use default *${DEFAULT_LANGUAGE}*`
        );
        missing.push(l);
        continue;
      }
      Lexicon.set(l, Jsonfile.readFileSync(file));
    }
    DefaultLexicon = Lexicon.get(DEFAULT_LANGUAGE);
    for (let m in missing) {
      Lexicon.set(m, DefaultLexicon);
    }

  }

  /**
   *
   */
  static dumpFilecap() {
    console.log("==================== filecap ======================");
    console.log(Filecap.keys());
  }

  /**
   *
   * @param {*} lang
   * @returns
   */
  static lex(lang) {
    return Lexicon.get(lang) || DefaultLexicon;
  }

  /**
   * 
   * @param {*} key 
   * @param {*} lang 
   * @returns 
   */
  static message(key, lang = DEFAULT_LANGUAGE) {
    if (!key) return UNKNOWN_ERROR;

    if (!isString(key)) {
      console.info(`Cache : message key must be a string`);
      return UNKNOWN_ERROR;
    }
    let msg = key;
    let map = Lexicon.get(lang) || DefaultLexicon;
    if (/^_.+/.test(key)) {
      msg = map[key] || key;
    }
    return msg || key;
  }

  /**
   * Gets locale error message from cache by key.
   * @param {*} key 
   * @returns 
   */
  static complain(key) {
    if (key == null) {
      return UNKNOWN_ERROR;
    }
    if (!isString(key)) {
      return UNKNOWN_ERROR;
    }
    let msg = key;
    if (key.match(/^_.+/)) {
      msg = DefaultLexicon[key] || key;
    }
    return msg;
  }
}

module.exports = DrumeeCache;
