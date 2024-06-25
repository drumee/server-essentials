

/**
 * 
 * @param {*} n 
 * @param {*} i 
 * @returns 
 */
Array.prototype.result = function (n, i = 0) {
  if (n != null) {
    return this[0][i][n];
  }
  return this[0][i];
};

/**
 * 
 * @returns 
 */
Array.prototype.results = function () {
  let a = this.filter(x =>
    (x.fieldCount === undefined) &&
    (x.serverStatus === undefined) &&
    (x.affectedRows === undefined)
  );
  let r = [];
  for (let i of a) {
    if (i.length === 1) {
      r.push(i.get_rows()[0]);
    } else {
      r.push(i)
    }
  }
  if (r.length === 1) {
    return r[0];
  }
  return r;
};



/**
 * 
 * @param {*} index 
 * @returns 
 */
Array.prototype.get_rows = function (index = null) {
  let a = this.filter(x =>
    (x.fieldCount === undefined) &&
    (x.serverStatus === undefined) &&
    (x.affectedRows === undefined)
  );
  let r = [];
  if (a.length === 1) {
    try {
      r = a[0].get_rows(index);
    } catch (e) {
      return a[0];
    }
    if (index !== null) {
      return r[index];
    }
    return r;
  }
  for (let i of a) {
    if (i.length === 1) {
      if (typeof (i[0]) !== 'array') {
        r.push(i[0]);
        continue;
      }
      let x = i[0].get_rows();
      if (x.length === 1) {
        r.push(x[0].get_rows());
      } else {
        r.push(i.get_rows());
      }
    } else {
      if (i) {
        r.push(i)
      }
    }
  }
  return r;
};

module.exports = {  };
