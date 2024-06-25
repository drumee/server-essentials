
// ================================  *
//   Copyright Xialia.com  2013-2019 *
//   FILE  : src/lib/messenger.coffee
//   TYPE  : module
// ================================  *

const { resolve } = require('path');
const { existsSync, readFileSync } = require('fs');
const { template, isFunction, isEmpty, isArray } = require('lodash');
const Nodemailer = require('nodemailer');
const credential_dir = process.env.credential_dir || '/etc/drumee/credential';
let transport = null;
const Attr = require("./lex/attribute");

const allowedAttributes = {
  "*": ['style', 'src', 'data-*', 'href', 'font-', 'class', 'width', 'height', 'target']
};

const extraTags = [
  'img', 'title'
]
const Logger = require('@drumee/server-essentials/lib/logger');

//########################################
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
    const tpl = this.get(Attr.template);
    const origin = opt.origin || 'desk'
    this.debug(`CHECKING template=${tpl}`);

    let data = { ...this.get('lex'), ...this.get(Attr.data) };
    data.lang = data.lang || data.__lang__ || '';
    //this.debug(`CHECKING DATA`, data);
    this.set({ data });

    let page_content = this._render(`${tpl}.tpl`)(data);
    this._html = this._render(`index.tpl`)({ ...data, page_content, origin });

    const sanitizeHtml = require('sanitize-html');
    const allowedTags = sanitizeHtml.defaults.allowedTags.concat(extraTags);
    this._html = sanitizeHtml(this._html, { allowedTags, allowedAttributes });

    //this.debug("AAAA:64", this._html);
    if (isEmpty(this._html)) {
      this.debug(`HTLM IS EMPTY TPL=${content_tpl}`);
    }
  }

  /**
   * 
   */
  _render(fn) {
    const base_dir = this.get(Attr.base_dir) || '../templates/email';
    const dir = resolve(__dirname, base_dir);
    this.debug(`RENDERING FROM ::50 ${dir}/${fn}`);
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
   * @returns 
   */
  getMTA() {
    if (global.myDrumee) {
      if (!global.myDrumee.useEmail || global.myDrumee.arch != "cloud") {
        acceptEmail = false;
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
   * 
   * @returns 
   */
  send() {
    const mta = this.getMTA();
    if (!mta) {
      this.info(`Mail not sent, NO_MTA`, global.myDrumee.arch, (global.myDrumee.arch != "cloud"), global.myDrumee);
      return this._html;
    }
    return new Promise(async (resolve, reject) => {
      let recipient = this.get(Attr.recipient);
      if (!isArray(recipient)) {
        recipient = [recipient];
      }

      const subject = this.get(Attr.subject);
      let from = 'butler@drumee.com';
      try {
        from = configs.auth.user;
      } catch (e) {

      }
      this.silly("AAAA:101 -- SENDING", this._html);
      let error = null;
      for (let r of recipient) {
        const mailOptions = {
          from: `Team Drumee <${from}>`,
          to: r,
          subject,
          html: this._html
        };
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
