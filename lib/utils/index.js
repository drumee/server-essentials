// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: *
//   Copyright Xialia.com  2011-2023
//
//
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::: *

const { isArray, isEmpty, isString } = require("lodash");

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
function randomString(l=16){
  const {randomBytes} = require("crypto");
  return randomBytes(l).toString('base64').replace(/[\+\/=]+/g, '');
}

/**
 * 
 * @param {*} timer 
 * @returns 
 */
function sleep(timer=1000){
  return new Promise((resolve, reject)=>{
    setTimeout(resolve, timer)
  })
}

module.exports = {
  nullValue,
  timestamp,
  toArray,
  ensureObject,
  randomString,
  uniqueId:randomString,
  sleep
};
