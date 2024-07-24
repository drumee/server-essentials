
const { Messenger, Cache, sysEnv } = require("..");
const { domain } = sysEnv();
let { ADMIN_EMAIL } = process.env;
let { exit } = process;
global.debug = 5;
async function run_test() {
  let email = ADMIN_EMAIL || `butler@${domain}`;
  email = email.trim();
  if (!email.isEmail()) {
    console.log("Invalid email")
    exit(1)
  }
  new Cache();
  await Cache.load();

  const subject = 'Test from lib/test/email.js'

  const msg = new Messenger({
    template: "butler/password-forgot",
    subject,
    recipient: email,
    lex: Cache.lex('en'),
    trace: true,
    data: {
      icon: `https://${domain}/-/images/logo/desk.png`,
      recipient: email,
      link: `https://${domain}`,
      home: domain,
    },
    handler: (e)=>{
      console.log("Failed to send email", e)
    },
  });
  await msg.send();
}

run_test().then(() => {
  db.end();
  process.exit(0);
})
