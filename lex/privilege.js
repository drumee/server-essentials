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
  modify           : 0b0001111, // delete
  upload           : 0b0000111, // write
  view             : 0b0000011, // read
  download         : 0b0000011, // read
  guest            : 0b0000001, // read 
  OWNER            : 0B0111111, 
  ADMIN            : 0B0011111, 
  DELETE           : 0B0001111,
  WRITE            : 0B0000111,
  READ             : 0B0000011,
  ANONYMOUS        : 0B0000001,
  MODIFY           : 0B0001111, // DELETE
  UPLOAD           : 0B0000111, // WRITE
  VIEW             : 0B0000011, // READ
  DOWNLOAD         : 0B0000011, // READ
  GUEST            : 0B0000001, // READ 
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