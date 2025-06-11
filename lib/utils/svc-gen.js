#!/usr/bin/env node

// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: *
//   Copyright Xialia.com  2011-2017
//   FILE : src/utils/svc-gen
//   MANDATORY: attributes lexicon
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: *

//Log      = require './log'
const resolve = require('path');
const { modules } = require('../router/rest/services');
const Jsonfile = require('jsonfile');


const file = resolve(
  process.env.UI_SRC_PATH,
  'src/drumee/lex',
  'services.json'
);

let s = {};
for (let name in modules) {
  const v = modules[name];
  s[name] = {};
  for (let method in v) {
    s[name][method] = `${name}.${method}`;
  }
}
console.log(`Services files generated into ${file}`);

Jsonfile.writeFileSync(file, s, { spaces: 2, EOL: '\r\n' });
