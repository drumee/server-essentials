

const {isEmpty, isArray, isString, isObject, keys, template, isFunction, delay} = require('lodash');
const Backbone = require('backbone');
const {service, socket_id, data, base_dir} = require('../lex/attribute');
const {STORAGE_FOLDER} = require('../lex/constants');
const SYS_KEYS = new RegExp(/^mfs_|^.+secret$|session_id|^password$|db_name|^finger|home_dir|^sys_|_root$|_host$|_db$|^activation_/i);
const SYS_VALUES = new RegExp(`^(\\${process.env.DRUMEE_RUNTIME_DIR})`);

/**
 * 
 * @param {*} a 
 * @returns 
 */
Backbone.Model.prototype.normalizeArgs = function (a) {
  let args;
  if (!isEmpty(a)) {
    args = Array.prototype.slice.call(a);
  } else {
    args = Array.prototype.slice.call(arguments);
  }
  switch (args.length) {
    case 1:
      if (isArray(args)) return args[0];
      return args;
    case 2:
      if (isString(args[0])) {
        return { service: args[0], data: args[1] }
      }
      return args;
    case 3:
      if (isString(args[0])) {
        return { service: args[0], recipient: args[1], data: args[2] }
      }
      return args;
    default:
      return args;
  }
};


/**
 * 
 * @param {*} l 
 * @returns 
 */
Backbone.Model.prototype.randomString = function (l = 16) {
  let {randomBytes} = require("crypto");
  return randomBytes(l).toString('base64').replace(/[\+\/=]+/g, '');
};


/**
 * 
 * @param {*} a 
 * @returns 
 */
Backbone.Model.prototype.parser = function (a) {
  let o = a.isData ? a : new Data(a);
  return o;
};

/**
 * 
 * @param {*} data 
 * @returns 
 */
Backbone.Model.prototype.parseJSON = function (data) {
  if (isString(data)) {
    try {
      return JSON.parse(data);
    } catch (e) {
      // this.debug(`PARSERRRRR `, data);
      this.warn("PARSE FAILED", `type=${typeof (data)}`, data, e);
      return data;
    }
  }
  return data;
};


/**
 * 
 * @param {*} item 
 * @returns 
 */
Backbone.Model.prototype.sanitize = function (item) {
  if (isArray(item)) {
    // let res = item.filter(safe_value);
    for (let i = 0; i < item.length; i++) {
      let v = item[i];
      if (SYS_VALUES.test(v)) {
        delete item[k];
      } else if (isArray(v) || isObject(v)) {
        item[i] = this.sanitize(v);
      }
    }
    return item;
  }
  if (isObject(item)) {
    for (let k of keys(item)) {
      let v = item[k];
      //console.log("KEYS", k, v);
      if (typeof (v) === 'bigint') {
        v = Number(v)
      }
      if (SYS_KEYS.test(k) || SYS_VALUES.test(v)) {
        delete item[k];
      } else if (isArray(v) || isObject(v)) {
        item[k] = this.sanitize(v);
      }
    }
    return item;
  }
  if (isString(item)) {
    if (!SYS_VALUES.test(item)) return item;
    return "***";
  }
  return item;

}

/**
 * 
 * @param {*} item 
 * @returns 
 */
Backbone.Model.prototype.cleanData = function (item) {
  return this.sanitize(this.toJSON());
}


/**
 * 
 * @param {*} model 
 * @param {*} options 
 * @returns 
 */
Backbone.Model.prototype.payload = function (model, options) {
  let svc = null;
  if (this.input && this.input.get) {
    svc = this.input.get(service);
    let sock_id = this.input.get(socket_id);
    if (sock_id) {
      let sender = { sock_id };
      if (this.uid) sender.uid = this.uid;
      if (this.user) {
        let { firstname, lastname, fullname, id } = this.user.toJSON();
        sender = { ...sender, firstname, lastname, fullname, id };
      }
      if (!options) {
        options = { sender };
      } else if (!options.sender) {
        options.sender = sender;
      } else {
        options.sender = { ...sender, ...options.sender };
      }
    }
  }
  return {
    model,
    options: {
      service: svc,
      keys: '*',
      ...options
    },
  }
}

/**
 * 
 * @param {*} file 
 * @param {*} args 
 * @returns 
 */
Backbone.Model.prototype.include = function (file, args) {
  let opt = {...this.get(data), ...args};
  const tpl_dir = this.get(base_dir) || 'bb-templates/node/email';
  const Path = require('path');
  const dir = Path.resolve(process.env.ui_base, tpl_dir);
  const html_tpl = Path.resolve(dir, file);

  const Fs = require('fs');
  let html = Fs.readFileSync(html_tpl);
  html = String(html).trim().toString();
  const renderer = template(html, { imports: { renderer: this } });
  return renderer(opt);
}

/**
 * 
 * @param {*} a 
 * @returns 
 */
Backbone.Model.prototype.stop = function (a) {
  if (this._stopping || this.isPersistent) return;
  let cleanup = () => {
    this.clear();
    for (let key of keys(this)) {
      let obj = this[key];
      if (obj) {
        if (obj._stopping || obj.isPersistent) {
          //this.debug(`SKIP CLEAN UP ${key}`, obj._stopping, obj.isPersistent);
          continue;
        } else {
          if (isFunction(obj.stop)) {
            try {
              obj.stop();
            } catch (e) {
              this.warn(`Failed to stop component ${k}`, e);
            }
          }
          this[key] = null;
        }
      }
    }
    cleanup = null;
  };
  delay(cleanup, 11000);
  this._stopping = 1;
};


// ======================================================
//
// ======================================================
Backbone.Model.prototype.makeArchiveList = function (files, dest_dir, crop) {
  let dest, src, basename, dirname;
  let dump = [];
  const Path = require('path');
  const Fs = require('fs');
  for (let a of files) {
    if (isEmpty(a)) continue;
    //this.debug("AAAA:252mkdirSync ", a);
    src = Path.join('/',
      a.home_dir,
      STORAGE_FOLDER,
      a.nid,
      `orig.${a.ext}`
    );


    // Clean null extension bugs
    a.filepath = a.filepath.replace(/\.null$/, '');
    // a.filepath = a.filepath.replace(new RegExp(`\.${a.id}$`), `.${a.extension}`);
    a.filepath = decodeURI(encodeURI(Path.normalize(a.filepath)));
    dest = Path.join(dest_dir, a.filepath);

    if (/^(hub|folder)$/i.test(a.filetype)) {
      if (!Fs.existsSync(dest)) {
        Fs.mkdirSync(dest, { recursive: true });
      }
    } else {
      let dirname = Path.dirname(dest);
      if (!Fs.existsSync(dirname)) {
        Fs.mkdirSync(dirname, { recursive: true });
      }
    }
    dump.push({ src, dest, type: a.filetype });
  }
  //this.debug("AAA:257", dump);
  return dump;
}

/**
 * 
 * @param {*} l 
 * @returns 
 */
Backbone.Model.prototype.supportedLanguage = function (l) {
  let list = global.SYS_LANGUAGES || ['en', 'fr'];
  if (list.includes(l)) return l;
  return 'en';
}

module.exports = { Model : Backbone.Model };
