
const { readFileSync, existsSync } = require('fs');
const { randomBytes, subtle, verify } = require("crypto");
const { RSA_PKCS1_PSS_PADDING } = require("crypto").constants;
const { isString } = require("lodash");

/*
 Fetch the contents of the "message" textbox, and encode it
 in a form we can use for sign operation.
 */
function getMessageEncoding(message) {
  let enc = new TextEncoder();
  return enc.encode(message);
}


/**
 * 
 * @param {*} data
 * @param {*} keyFile
 * @returns 
 */
async function verifyMessage(data, keyFile) {
  let { signature, content } = data;
  let encoded = getMessageEncoding(content);
  signature = stringToArrayBuffer(signature);
  let publicKey = await importPublicKey(keyFile);
  return subtle.verify(
    "RSASSA-PKCS1-v1_5", publicKey, signature, encoded
  );
}

/**
 * 
 * @param {*} str 
 * @returns 
 */
function stringToArrayBuffer(a) {
  let str = atob(a);
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

/** 
 * 
 */
function importPrivateKey(file) {
  let pem = getKey(file);
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = pem.substring(
    pemHeader.length,
    pem.length - pemFooter.length - 1,
  );
  const binaryPem = stringToArrayBuffer(pemContents);
  return subtle.importKey(
    "pkcs8",
    binaryPem,
    {
      name: "RSASSA-PKCS1-v1_5",
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign"],
  );
}

/** 
 * 
 */
function importPublicKey(file) {
  let pem = getKey(file);
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  const pemContents = pem.substring(
    pemHeader.length,
    pem.length - pemFooter.length - 1,
  );
  const binaryPem = stringToArrayBuffer(pemContents);
  return subtle.importKey(
    "spki",
    binaryPem,
    {
      name: "RSASSA-PKCS1-v1_5",
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["verify"],
  );
}

/**
 * 
 */
function make_key() {
  let str = "";
  for (let i = 0; i < 4; i++) {
    let s = randomBytes(4).toString('base64').replace(/[\+\/=]+/g, '');
    if (str) {
      str = `${s.toUpperCase()}-${str}`;
    } else {
      str = s.toUpperCase();
    }
  }
  //console.log(str);
  return str;
}

/**
 * 
 */
function getKey(str) {
  if(existsSync(str)){
    return readFileSync(str).toString();
  }
  return str;
}

/**
 * 
 */
async function signMessage(data, keyFile) {
  let content;
  if (isString(data)) {
    content = data;
  } else {
    content = JSON.stringify(data);
  }
  let privateKey = await importPrivateKey(keyFile);
  let encoded = getMessageEncoding(content);
  let sig = await subtle.sign(
    "RSASSA-PKCS1-v1_5",
    privateKey,
    encoded
  );

  let signature = Buffer.from(sig).toString("base64");
  return { signature, content };
}

/**
 * 
 * @param {*} str 
 * @returns 
 */
function formatAsPem(str, type) {
  var finalString = `-----BEGIN ${type} KEY-----\n`;
  while (str.length > 0) {
    finalString += str.substring(0, 64) + '\n';
    str = str.substring(64);
  }
  finalString = finalString + `-----END ${type} KEY-----`;
  return finalString;
}

/**
 * 
 * @param {*} buffer 
 * @returns 
 */
function arrayBufferToString(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return binary;
}


/**
 * 
 * @param {*} keydata 
 * @returns 
 */
function bufferToPEM(keydata, type) {
  var keydataS = arrayBufferToString(keydata);
  var keydataB64 = btoa(keydataS);
  var keydataB64Pem = formatAsPem(keydataB64, type);
  return keydataB64Pem;
}

/**
 * 
 * @param {*} format 
 * @param {*} key 
 * @returns 
 */
async function exportCryptoKey(format, type, key) {
  const exported = await subtle.exportKey(format, key);
  return bufferToPEM(exported, type);
}

/**
 * 
 * @param {*} publicKeyFile 
 * @param {*} privateKeyFile 
 */
async function generateKeysPair(publicKeyFile, privateKeyFile) {
  let keysPair = await subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"]
  )
  let { privateKey, publicKey } = keysPair;
  let publicKeyString = await exportCryptoKey("spki", "PUBLIC", publicKey);
  let privateKeyString = await exportCryptoKey("pkcs8", "PRIVATE", privateKey);
  if (publicKeyFile && privateKeyFile) {
    console.log(`Writting public key in ${publicKeyFile}`);
    writeFileSync(publicKeyFile, publicKeyString);
    console.log(`Writting private key in ${privateKeyFile}`);
    writeFileSync(privateKeyFile, privateKeyString);
  }
  console.log("PublicKey:\n", publicKeyString);
  console.log("PrivateKey:\n", privateKeyString);
  return { publicKey: publicKeyString, privateKey: privateKeyString };
}

module.exports = {
  generateKeysPair,
  stringToArrayBuffer,
  signMessage,
  verifyMessage,
  importPublicKey,
  importPrivateKey,
  make_key
};