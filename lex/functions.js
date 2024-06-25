
/**
 * 
 * @returns 
 */
function value(k, def){
  if(typeof(k) === 'number') return k;
  return def[k] || 0;
}


/**
 * 
 * @returns 
 */
function keys(val, def){
  if(typeof(val) !== 'number') return [val];
  let res = [];
  for(let k in def){
    if(def[k] == val){
      res.push(k)
    }
  }
  return res;
}

/**
 * 
 * @returns 
 */
function key(val, def){
  if(typeof(val) !== 'number') return val;
  for(let k in def){
    if(def[k] == val){
      return k;
    }
  }
  return '';
}

module.exports = { value, key, keys}