

Number.prototype.pad = function (size) {
  var s = this + "";
  while (s.length < size) s = "0" + s;
  return s;
};

BigInt.prototype.toJSON = function () {
  return this.toString()
}

module.exports = {  };
