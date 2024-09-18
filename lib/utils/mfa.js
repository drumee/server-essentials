

const Attr = require("./lex/attribute");
const sysEnv = require("./sysEnv");
const { domain, credential_dir } = sysEnv();

const {
  existsSync
} = require("fs");

const Methods = [
  { type: "passkey", provider: 'internal' },
  { type: "email", provider: 'internal' },
];


/**
 * 
 */
function smsFailover(opt) {
  const credential = '/etc/drumee/credential/ovh/sms.json';
  return new Promise((ok, nok) => {
    if (existsSync(credential)) {
      nok("Failed to handle sms failover. Provider not found");
      return
    }
    let Sms = require("../vendor/ovh/sms");
    let sms = new Sms(opt);
    sms
      .send()
      .then(() => {
        ok(opt);
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
  const credential = '/etc/drumee/credential/smsfactor/sms.json';
  return new Promise((ok, nok) => {
    if (existsSync(credential)) {
      nok("Failed to handle sms failover. Provider not found");
      return
    }
    let Sms = require("../vendor/smsfactor");
    const timer = setTimeout(() => {
      smsFailover(opt);
    }, 3500);
    let sms = new Sms(opt);
    sms
      .send()
      .then((result) => {
        if (timer) clearTimeout(timer);
        ok(opt);
      })
      .catch((e) => {
        console.warn("FAILED TO SEND OTP. Trying alternat", e);
        console.warn("Trying fallback method");
        smsFailover(opt).then(ok).catch(nok);
      });

  })
}



module.exports = { sendSms };
