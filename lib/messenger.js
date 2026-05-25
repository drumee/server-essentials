
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
const {
  readFileSync: readJSON,
} = require("jsonfile");

const { dirname } = require("path");

let FROM = null;
const keyFile = resolve(credential_dir, `email.json`);
if (existsSync(keyFile)) {
  try {
    FROM = readJSON(keyFile).auth.user;
  } catch (e) {
    console.log("No credenial for email. Ignored.")
  }
}


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

    let data = opt.data;
    data.lex = opt.lex;
    data.lang = data.lang || data.__lang__ || '';
    this.set({ data });

    data.page_content = this._render(`${tpl}.tpl`)(data);
    data.origin = origin
    this._html = this._render(`index.tpl`)(data);
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
  async getMTA() {
    if (global.myDrumee) {
      if (!global.myDrumee.useEmail) {
        return null;
      }
    }
    if (transport) return transport;
    const Jsonfile = require('jsonfile');
    const googleapis = resolve(credential_dir, 'googleapis.json')
    if (existsSync(googleapis)) {
      const configs = Jsonfile.readFileSync(googleapis);
      if (configs && /googleapis\.com/i.test(configs.token_uri)) {
        const { google } = require('googleapis');
        const { client_id, client_secret, user, refresh_token } = configs;
        const oauth2Client = new google.auth.OAuth2(client_id, client_secret);
        const tokenFile = resolve(credential_dir, 'token.json');
        const tokens = existsSync(tokenFile) ? Jsonfile.readFileSync(tokenFile) : { refresh_token };
        oauth2Client.setCredentials(tokens);
        const { token: accessToken } = await oauth2Client.getAccessToken();
        return Nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user,
            clientId: client_id,
            clientSecret: client_secret,
            refreshToken: oauth2Client.credentials.refresh_token,
            accessToken,
          },
        });
      }
    }
    const configs = Jsonfile.readFileSync(resolve(credential_dir, 'email.json'));
    return Nodemailer.createTransport(configs);
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
  async send(args = {}) {
    let { html, text } = args
    const mta = await this.getMTA();
    if (!mta) {
      this.notice(`Mail not sent, NO_MTA`, global.myDrumee.arch, (global.myDrumee.arch != "cloud"), global.myDrumee);
      return this._html;
    }
    let recipient = this.get(Attr.recipient);
    if (!isArray(recipient)) {
      recipient = [recipient];
    }

    const subject = this.get(Attr.subject);
    html = html || this._html;
    text = text || this._text;
    const from = args.from || FROM;
    const sends = recipient.map((r) => {
      const mailOptions = { from, to: r, subject, html };
      if (text) {
        delete mailOptions.html;
        mailOptions.text = text;
      }
      return mta.sendMail(mailOptions).then(() => ({ r, ok: true })).catch(() => ({ r, ok: false }));
    });
    const results = await Promise.allSettled(sends);
    const error = results
      .filter((s) => s.status === 'fulfilled' && !s.value.ok)
      .map((s) => s.value.r);
    this.stop();
    return { recipient, error: error.length ? error : null };
  }

  /**
   * Fire-and-forget: send without blocking the caller.
   * Errors are logged internally; no rejection is surfaced.
   */
  dispatch(args = {}) {
    this.send(args).catch((e) => this.error('dispatch failed', e));
  }
}

module.exports = Messenger;
