
// ================================  *
//   Copyright Xialia.com  2013-2019 *
//   FILE  : src/lib/messenger.coffee
//   TYPE  : module
// ================================  *

const { createWriteStream, existsSync, mkdirSync, statSync } = require("fs");
const { isString } = require("lodash");
const { dirname } = require("path");
const Attr = require("./lex/attribute");

/**
 * 
 */
function request(opt = {}, payload = {}) {
  let md5Hash;
  return new Promise((resolve, reject) => {

    let { url, service, endpoint } = opt;
    if (isString(opt)) url = opt;

    let headers = {
      'Content-Type': 'application/json',
      ...opt.headers
    }

    let path = `/-/svc/`;
    if (service) {
      if (endpoint) {
        path = `/-/${endpoint}/svc/`;
      }
      path = `${path}${service}?`
    }

    payload = JSON.stringify(payload)
    if (opt.method == 'POST') {
      headers['Content-Length'] = payload.length;
    } else {
      path = `${path}${encodeURI(payload)}`
    }

    let options = {
      hostname: opt.hostname,
      port: opt.port || 443,
      method: opt.method || 'GET',
      path: opt.path || path,
      headers,
    };
    let https = require("https");
    let localStream = null;
    if (opt.outfile) {
      let dir = dirname(opt.outfile);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
      localStream = createWriteStream(opt.outfile)
    }

    let args = [options];
    if (url) {
      delete options.hostname;
      delete options.port;
      delete options.path;
      delete options.url;
      args = [url, options];
    }
    //console.log("ARGS:65", ...args);
    let req = https.request(...args, (res) => {
      if (res.statusCode != 200) {
        reject(res);
        return
      }
      const chunks = [];
      res.on("readable", () => {
        let chunk;
        let { createHash } = require("crypto");
        if (!md5Hash) md5Hash = createHash("md5");
        while (null !== (chunk = res.read())) {
          md5Hash.update(chunk);
          if (localStream) {
            try {
              localStream.write(chunk);
            } catch (e) {
              console.warm(`Failed to rwite into ${opt.outfile}`, e);
            }
          } else {
            chunks.push(chunk);
          }
          //console.log("CHUNK:84", ...chunk);
        }
      });

      res.on("end", () => {
        if (localStream) {
          localStream.end();
          if (existsSync(opt.outfile)) {
            let stat = statSync(opt.outfile);
            stat.md5Hash = md5Hash;
            resolve(stat);
          } else {
            setTimeout(() => {
              if (existsSync(opt.outfile)) {
                let stat = statSync(opt.outfile);
                stat.md5Hash = md5Hash;
                resolve(stat);
              } else {
                reject({});
              }
            }, 2000)
          }
        } else {
          const body = Buffer.concat(chunks);
          if (!md5Hash) md5Hash = createHash("md5");
          md5Hash.update(chunk);
          switch (opt.responseType) {
            case Attr.text:
              return resolve(body.toString('utf8'));
          }
          let raw = JSON.parse(body.toString('utf8'));
          if (opt.rawResult) {
            raw.md5Hash = md5Hash;
            resolve(raw);
          } else {
            let res = raw.data || raw
            res.md5Hash = md5Hash;
            resolve(res);
          }
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });
    if (opt.method == 'POST') {
      req.write(payload);
    }
    req.end();
  })
}

module.exports = { request };
