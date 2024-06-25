

let {signMessage, make_key, generateKeysPair, verifyMessage} = require("../subtleCrypto");

global.verbosity = 9;
(async()=>{
  let data = {
    key1 : make_key(),
    key2 : make_key(),
    name : 'random keys',
  };
  let {signature, content} = await signMessage(data, '/etc/drumee/credential/crypto/private.pem');
  console.log("Signed data:", {signature, content});

  let verified = await verifyMessage({signature, content}, '/etc/drumee/credential/crypto/public.pem');
  console.log("Verified data:", verified);
  await generateKeysPair();
  process.exit(0);
})()