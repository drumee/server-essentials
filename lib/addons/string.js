const {extname, basename} = require('path');

//########################################
// String superset to make sprintf equivalent
//########################################
String.prototype.format = function () {
  let formatted = this;
  for (let i = 0, end = arguments.length - 1, asc = 0 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
    const regexp = new RegExp('\\{' + i + '\\}', 'gi');
    formatted = formatted.replace(regexp, arguments[i]);
  }
  return formatted;
};


// --------------------
// 
// --------------------
const EMAIL = new RegExp(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/);
String.prototype.isEmail = function () {
  return EMAIL.test(this.trim())
}

// --------------------
// 
// --------------------
const PHONE = new RegExp(/^ *(\+|[0-9])[\.:,_\-0-9]+ *$/);
String.prototype.phoneNumber = function () {
  let s = this.replace(/[ \-\.\:]+/g, '').trim();
  if (PHONE.test(s)) return s;
  return null;
}

/**
 * 
 * @returns 
 */
String.prototype.extension = function () {
  const a = this.split('.');
  if (a.length > 1) {
    return a.pop();
  }
  return "bin";
}


/**
 * 
 * @returns 
 */
String.prototype.filename = function () {
  let filepath  = this.toString();
  let re = new RegExp(`${extname(filepath)}$`);
  let filename = basename(filepath).replace(re, '');
  let ext = extname(filepath).replace(/^\./, '').toLowerCase();
  return {filename, ext}
};

String.prototype.filename = function () {
  let filepath  = this.toString("utf8");
  let re = new RegExp(`${extname(filepath)}$`);
  let filename = basename(filepath).replace(re, '');
  let ext = extname(filepath).replace(/^\./, '').toLowerCase();
  return {filename, ext}
};


module.exports = {  };