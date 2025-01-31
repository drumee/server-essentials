const { isArray, isEmpty, isString } = require("lodash");
const { isText } = require('istextorbinary');
const Attr = require("../lex/attribute");

const { readSync, openSync, closeSync } = require("fs");

const { OTHER } = require("../lex/constants");
const Cache = require("../cache");

/**
 *
 * @param {*} a
 * @returns
 */
function nullValue(a) {
  return [null, undefined, "null", "undefined", ""].includes(a);
}

/**
 *
 * @param {*} a
 * @param {*} no_null
 * @returns
 */
function toArray(a, no_null = 1) {
  if (isEmpty(a)) {
    if (no_null) return [];
    return null;
  }
  if (isArray(a)) return a;
  return [a];
}

/**
 *
 * @param {*} sec
 * @returns
 */
function timestamp(sec = 0) {
  const ts = new Date().getTime();
  if (sec) return ts / 1000;
  return ts;
}

/**
 *
 * @param {*} p
 */
function ensureObject(p) {
  if (isString(p)) {
    try {
      return JSON.parse(p);
    } catch (e) {
      return {};
    }
  }
  return p;
}

/**
 * 
 * @returns 
 */
function randomString(l = 16, type = 'base64') {
  const { randomBytes } = require("crypto");
  return randomBytes(l).toString(type).replace(/[\+\/=]+/g, '');
}

/**
 * 
 * @param {*} timer 
 * @returns 
 */
function sleep(timer = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, timer)
  })
}


/**
 * 
 */
function getPartialBuffer(filePath, chunkSize = 1024) {
  const buffer = Buffer.alloc(chunkSize);
  const fd = openSync(filePath, 'r');
  try {
    const bytesRead = readSync(fd, buffer, 0, chunkSize, 0);
    const partialBuffer = buffer.slice(0, bytesRead);
    return partialBuffer;
  } catch (err) {
    console.warn(`getPartialBuffer:Error reading file: ${err.message}`);
  } finally {
    closeSync(fd);
  }
  return null;
}

/**
 * 
 * @param {*} filePath 
 * @returns 
 */
async function detectFiletype(filePath) {
  const { fileTypeFromBuffer } = await import('file-type');
  const buffer = getPartialBuffer(filePath);
  let type = null;
  try {
    type = await fileTypeFromBuffer(buffer);
  } catch (err) {
    console.warn(`detectFiletype:Error buffer`, err, buffer);
  }
  if (!type) {
    return "";
  }
  if (type && type.mime) return type.mime;
  if (isText(null, buffer)) return "text/*";
  return 'application/octet-stream';
};

/**
 *
 * @param {*} filename
 * @returns
 */
async function getFileinfo(filepath, filename) {
  filename = filename.replace(/\/+$/, "");
  let name = filename;
  let extension;
  if (/^\..+/.test(filename)) {
    extension = ''
  } else {
    let e = filename.split('.');
    extension = e.pop() || "";
    extension = extension.toLowerCase();
    let re = new RegExp('.' + extension + '$')
    name = filename.replace(re, "")
  }
  let mimetype = await detectFiletype(filepath);
  let def = Cache.getFilecap(extension);
  if (!mimetype) {
    def.category = def.category || OTHER;
    def.capability = def.capability || "---";
  }

  if (!def.mimetype) def.mimetype = mimetype;

  if (/script/.test(def.mimetype)) {
    def.category = Attr.script;
    def.capability = "---";
  } else if (/text/.test(def.mimetype)) {
    def.category = def.category || Attr.text;
    def.capability = def.capability || "---";
  } else if (/video/.test(def.mimetype)) {
    def.category = Attr.video;
  }

  if (!def.category || def.category == OTHER) {
    def.category = mimetype.split('/')[0];
  }

  let c = {
    mimetype,
    extension,
    capability: "---",
    category: OTHER,
    filename: name,
    ...def,
  };
  return c;
}

module.exports = {
  detectFiletype,
  ensureObject,
  getFileinfo,
  getPartialBuffer,
  nullValue,
  randomString,
  sleep,
  timestamp,
  toArray,
  uniqueId: randomString,
};
