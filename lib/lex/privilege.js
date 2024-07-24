// Privilege is the bit block that contains all the privilège
// The privilege is attached to the visitor whithin the hub scope
// Therefore Site.get(_a.privilege) gives the user privilege whithin the site

const def = {
  owner            : 0b0111111, 
  admin            : 0b0011111, 
  delete           : 0b0001111,
  write            : 0b0000111,
  read             : 0b0000011,
  anonymous        : 0b0000001,
  anyone           : 0b0000001,
  modify           : 0b0001111,
  upload           : 0b0000111,
  view             : 0b0000011,
  download         : 0b0000011,
  guest            : 0b0000001, 
  OWNER            : 0b0111111, 
  ADMIN            : 0b0011111, 
  DELETE           : 0b0001111,
  WRITE            : 0b0000111,
  READ             : 0b0000011,
  ANONYMOUS        : 0b0000001,
  ANYONE           : 0b0000001,
  MODIFY           : 0b0001111,
  UPLOAD           : 0b0000111,
  VIEW             : 0b0000011,
  DOWNLOAD         : 0b0000011,
  GUEST            : 0b0000001, 
};

const { value, key, keys} = require('./functions');

module.exports = {...def, 
  privilegeValue:function(v) {
    return value(v, def)
  }, 
  privilegeKey:function(v) {
    return key(v, def)
  }, 
  privilegeKeys:function(v) {
    return keys(v, def)
  },
}