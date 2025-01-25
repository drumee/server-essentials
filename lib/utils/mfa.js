

const sysEnv = require("../sysEnv");
const Cache = require("../cache");
const { domain } = sysEnv();
const {
  INVALID_EMAIL_FORMAT,
} = require("../lex/constants");

const {
  existsSync
} = require("fs");

const ovh = '/etc/drumee/credential/ovh/sms.json';
const smsfactor = '/etc/drumee/credential/smsfactor/sms.json';

const Methods = [
  { type: "passkey", provider: 'internal' },
  { type: "email", provider: 'internal' },
];

if (existsSync(ovh) || existsSync(smsfactor)) {
  Methods.push({ type: "sms", provider: 'internal' })
}

/**
 * 
 */
function smsFailover(opt) {
  return new Promise((ok, nok) => {
    if (!existsSync(ovh)) {
      nok("Failed to handle sms failover. Provider not found");
      return
    }
    let Sms = require("../vendor/ovh/sms");
    let sms = new Sms(opt);
    sms
      .send()
      .then((result) => {
        ok(result);
      })
      .catch((e) => {
        console.warn("Failed to handle sms failover. Giving up", e);
        nok("MSG_NOT_SENT");
      });
  })

}

/**
 * Only legacy
 * @param {*} user 
 * @param {*} resent 
 */
async function sendSms(opt) {
  return new Promise((ok, nok) => {
    if (!existsSync(smsfactor)) {
      smsFailover(opt).then(ok).catch(nok);
      return
    }
    let Sms = require("../vendor/smsfactor");
    const timer = setTimeout(() => {
      smsFailover(opt).then(ok).catch(nok);
    }, 3500);
    let sms = new Sms(opt);
    sms
      .send()
      .then((result) => {
        if (timer) clearTimeout(timer);
        ok(result);
      })
      .catch((e) => {
        console.warn("FAILED TO SEND OTP. Trying alternat", e);
        console.warn("Trying fallback method");
        smsFailover(opt).then(ok).catch(nok);
      });

  })
}

/**
* Send otp by email
* @param {obj} user
* @param {obj} code
* @param {obj} expiry
*/
async function sendEmail(user, code, expiry) {
  return new Promise((ok, nok) => {
    email = email.trim();
    if (!email.isEmail()) {
      nok(INVALID_EMAIL_FORMAT);
      return;
    }
  
    const {lang, email, fullname} = user;
    const msg = new Messenger({
      template: "butler/otp",
      subject : Cache.message("_your_otp", lang),
      recipient: email,
      lex: Cache.lex(lang),
      data: {
        recipient: fullname,
        text :Cache.message("_your_otp_is_x", lang).format(code, domain, expiry),
        home: domain,
      },
      handler: nok
    });
    try{
      msg.send();
      ok(e);
    }catch(e){
      nok(e)
    }
  })
}



module.exports = { sendSms, sendEmail, Methods };
