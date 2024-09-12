// ================================  *
//   Copyright Xialia.com  2013-2017 *
//   FILE  : src/utils/cache
//   TYPE  : module
// ================================  *

const { isString, isArray } = require("lodash");
const { UNKNOWN_ERROR } = require("./lex/constants");
const DEFAULT_LANGUAGE = "en";
const { sys_languages } = require("/etc/drumee/conf.d/drumee.json") || [
  "en",
  "fr",
];


//########################################
class DrumeeCache {
  constructor() {
    if (DrumeeCache._instance) {
      return DrumeeCache._instance;
    }
    this.filecap = new Map();
    this.sysconf = new Map();
    this.lexicon = new Map();
    this.env = new Map();
    this.defaultLexicon = {};
    return (DrumeeCache._instance = this);
  }


  /**
   *
   * @param {*} extension
   * @returns
   */
  static getFilecap(extension) {
    return this.filecap.get(extension) || {};
  }

  /**
   *
   * @param {*} extension
   * @returns
   */
  static getSysConf(key) {
    return this.sysconf.get(key);
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
      this.env.set(arg1, arg2)
    } else {
      for (let k in arg1) {
        this.env.set(k, arg1[k])
      }
    }
  }

  /**
   * 
   */
  static getEnv(arg) {
    return this.env.get(arg)
  }

  /**
   *
   */
  static async load(db, force = 0) {
    if (this.lexicon.size && force == 0) {
      console.debug("Cache already loaded. Skipped...");
      return;
    }
    console.debug("Loading cache...");
    const Jsonfile = require("jsonfile");
    const Path = require("path");
    let Db = require("./mariadb");
    const Fs = require("fs");

    let yp = db || this.env.get('yp') || new Db({ name: "yp" });

    let data = await yp.await_query(
      "select extension, category, mimetype, capability from filecap"
    );
    for (let d of data) {
      this.filecap.set(d.extension, d);
    }

    data = await yp.await_proc("get_sys_conf");
    let items = [];
    if (isArray(data[0])) {
      items = data[0];
    } else {
      items = data;
    }
    for (let d of items) {
      this.sysconf.set(d.key, d.value);
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
      this.lexicon.set(l, Jsonfile.readFileSync(file));
    }
    this.defaultLexicon = this.lexicon.get(DEFAULT_LANGUAGE);
    for (let m in missing) {
      this.lexicon.set(m, this.defaultLexicon);
    }

  }

  /**
   *
   */
  static dumpFilecap() {
    console.log("==================== filecap ======================");
    console.log(this.filecap.keys());
  }

  /**
   *
   * @param {*} lang
   * @returns
   */
  static lex(lang) {
    return this.lexicon.get(lang) || this.defaultLexicon;
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
    let map = this.lexicon.get(lang) || this.defaultLexicon;
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
      msg = this.defaultLexicon[key] || key;
    }
    return msg;
  }
}

module.exports = DrumeeCache;
