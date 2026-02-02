
// ================================  *
//   Copyright Xialia.com  2013-2019 *
//   FILE  : src/lib/messenger.coffee
//   TYPE  : module
// ================================  *

const { resolve } = require('path');
const { template, isFunction, isArray } = require('lodash');
const Nodemailer = require('nodemailer');
let transport = null;
const Attr = require("./lex/attribute");
const { sysEnv } = require("./sysEnv");
const { domain, credential_dir } = sysEnv();

const allowedAttributes = {
  "*": ['style', 'src', 'data-*', 'href', 'font-', 'class', 'width', 'height', 'target']
};

const extraTags = [
  'img', 'title'
]

const {
  mkdirSync,
  writeSync,
  openSync,
  close,
  readFileSync,
  existsSync
} = require("fs");
const { dirname } = require("path");


const Logger = require('./logger');
class Messenger extends Logger {


  /**
   * 
   * @param  {...any} args 
   */
  constructor(...args) {
    super(...args);
    this.initialize = this.initialize.bind(this);
    this.error_handler = this.error_handler.bind(this);
    this.send = this.send.bind(this);
    this.getMTA = this.getMTA.bind(this);
    this._render = this._render.bind(this);
  }

  /**
   * 
   * @param {*} opt 
   */
  initialize(opt) {
    const tpl = opt.template;
    if (opt.text) {
      this._text = opt.text;
      return;
    }
    const sanitize = require('sanitize-html');
    const allowedTags = sanitize.defaults.allowedTags.concat(extraTags);
    const sanitizerOptions = { allowedTags, allowedAttributes };

    if (opt.html) {
      this._html = sanitize(opt.html, sanitizerOptions);
      return;
    }

    if (!tpl) {
      this._html = "<p>No was provided</p>";
      return;
    }
    const origin = opt.origin || 'desk'
    const { trace } = opt;
    if (trace) {
      this.notice(`Creating messenger with template =${tpl}`);
    }

    let data = { ...this.get('lex'), ...opt.data };
    data.lang = data.lang || data.__lang__ || '';
    this.set({ data });

    let page_content = this._render(`${tpl}.tpl`)(data);
    this._html = this._render(`index.tpl`)({ ...data, page_content, origin });

    this._html = sanitize(this._html, sanitizerOptions);

  }

  /**
   * 
   */
  _render(fn) {
    const base_dir = this.get(Attr.base_dir) || '../templates/email';
    const dir = resolve(__dirname, base_dir);
    this.debug(`RENDERING CONTENT FROM ${dir}/${fn}`);
    let filename = resolve(dir, fn);
    if (!existsSync(filename)) {
      throw (`${__filename} : template not found ${filename}`);
    }
    let x = readFileSync(filename);
    let content = String(x).trim().toString();
    return template(content, { imports: { renderer: this } });
  }

  /**
   * 
   * @param {*} filepath 
   */
  renderFrom(filepath, data) {
    if (!existsSync(filepath)) {
      throw (`${__filename} : template not found ${filepath}`);
    }
    let x = readFileSync(filepath);
    let content = String(x).trim().toString();
    this.debug(`RENDERING CONTENT FROM ${filepath}`);
    return template(content, { imports: { renderer: this } })(data);
  }

  /**
   * 
   * @returns 
   */
  getMTA() {
    if (global.myDrumee) {
      if (!global.myDrumee.useEmail) {
        return null;
      }
    }
    if (transport) return transport;
    const Jsonfile = require('jsonfile');
    const configs = Jsonfile.readFileSync(resolve(credential_dir, 'email.json'));
    transport = Nodemailer.createTransport(configs);
    return transport;
  }


  /**
   * 
   * @param {*} error 
   * @param {*} info 
   * @returns 
   */
  error_handler(error, info) {
    const handler = this.get(Attr.handler);
    if (isFunction(handler)) {
      return handler(error, info);
    } else {
      return console.error(error);
    }
  }

  /**
   * file
   */
  save(file) {
    let dname = dirname(file);
    mkdirSync(dname, { recursive: true });

    this.debu(`Saving file ${file}`);
    let fd = openSync(out, "w+");
    let content = this._text || this._html;
    writeSync(fd, content);
    close(fd, (e) => {
      this.warn("Failed to save", e)
    });
  }

  /**
   * 
   * @returns 
   */
  send(args = {}) {
    let { html, text } = args
    const mta = this.getMTA();
    if (!mta) {
      this.notice(`Mail not sent, NO_MTA`, global.myDrumee.arch, (global.myDrumee.arch != "cloud"), global.myDrumee);
      return this._html;
    }
    return new Promise(async (resolve, reject) => {
      let recipient = this.get(Attr.recipient);
      if (!isArray(recipient)) {
        recipient = [recipient];
      }

      const subject = this.get(Attr.subject);
      let from = args.from || `butler@${domain}`;
      try {
        from = configs.auth.user;
      } catch (e) {

      }
      html = html || this._html;
      text = text || this._text;
      this.silly("SENDING", this._html);
      let error = null;
      for (let r of recipient) {
        const mailOptions = {
          from: `Drumee <${from}>`,
          to: r,
          subject,
          html: html
        };
        if (text) {
          delete mailOptions.html;
          mailOptions.text = text;
        }
        try {
          let info = await mta.sendMail(mailOptions);
          this.debug(`Message sent to ${r}: ${info.messageId}`);
        } catch (e) {
          if (!error) error = [];
          error.push(r);
        }
      }
      this.stop();
      resolve({ recipient, error });
    })
  }
}

module.exports = Messenger;
