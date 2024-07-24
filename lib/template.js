const { template: Template } = require("lodash");
const {
  mkdirSync,
  writeSync,
  openSync,
  close,
  readFileSync,
  existsSync
} = require("fs");
const { dirname } = require("path");

/**
 * 
 * @param {*} err 
 */
function __error(err) {
  if (err) throw err;
};


/**
 * 
 */
function render(data, tpl, parse) {
  if (!existsSync(tpl)) {
    console.error(`Template file ${tpl} was not found`);
    return null;
  }
  console.log("Rendering from", tpl)
  let str = readFileSync(tpl);
  try {
    let res = Template(String(str).toString())(data);
    if (parse && typeof res === "string") {
      return JSON.parse(res);
    }
    return res;
  } catch (e) {
    console.error(`Failed to render from template ${tpl}`);
    console.error("------------\n", e);
  }
};

/**
 *
 * @param {*} data
 * @param {*} args
 * @returns
 */
function write(data, args) {
  let { out, tpl } = args;
  if (!out) {
    throw "Undefined output file"
  }
  if (!tpl) {
    throw "Undefined template file"
  }
  let dname = dirname(out);
  mkdirSync(dname, { recursive: true });

  console.log(`Rendering template tpl ${out}`);
  let fd = openSync(out, "w+");
  writeSync(fd, render(data, tpl));
  close(fd, __error);
}


module.exports = {
  write,
  render
};
