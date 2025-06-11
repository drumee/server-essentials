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
  let is_text = isText(null, buffer);
  let type = null;
  try {
    type = await fileTypeFromBuffer(buffer);
  } catch (err) {
    console.warn(`detectFiletype:Error buffer`, err, buffer);
  }
  if (!type) {
    if (is_text) return { mimetype: "text/*", is_text };
    return { mimetype: "", is_text };
  }
  if (type && type.mime) return { mimetype: type.mime, is_text };
  if (is_text) return { mimetype: "text/*", is_text };
  return { mimetype: "application/octet-stream", is_text };
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
  let ext2;
  if (/^\..+/.test(filename)) {
    extension = ''
  } else {
    let e = filename.split('.');
    e.shift();
    extension = e.pop() || "";
    extension = extension.toLowerCase();
    ext2 = e.pop();
    if (ext2) {
      ext2 = `${ext2}.${extension}`.toLowerCase();
    }
  }
  let { mimetype, is_text } = await detectFiletype(filepath);
  let def = Cache.getFilecap(extension, ext2);
  if (!mimetype) {
    if (!is_text) {
      def.category = def.category || OTHER;
      def.capability = def.capability || "---";
    }
  } else {
    let category = mimetype.split('/')[0] || OTHER;
    if (is_text) {
      def.mimetype = def.mimetype || mimetype;
      def.category = def.category || category;
      if (/script/.test(def.mimetype)) {
        def.category = def.category || Attr.script;
      } else if (/video/.test(def.category)) { /** Video can not be text */
        def.category = category || def.category;
      } else if (def.category) {
        ext2 = "";
      }
      def.capability = def.capability || "---";
    } else {
      def.category = def.category || category || OTHER;
    }
  }
  extension = def.extension || extension; /** give precedence to know extension */
  if (extension) {
    let re = new RegExp('.' + extension + '$')
    name = filename.replace(re, "");
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
