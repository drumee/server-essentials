// Permission a particular privilege the user ask for
// It's a particular among the ones that compose the privilege word
// The permission is
// Therefore Site.get(_a.privilege) gives the user privilege whithin the site

const def = {
  owner: 0b0100000,
  admin: 0b0010000,
  delete: 0b0001000,
  write: 0b0000100,
  read: 0b0000010,
  anonymous: 0b0000001,
  anyone: 0b0000001,
  modify: 0b0001000, // delete
  upload: 0b0000100, // write
  view: 0b0000010, // read
  download: 0b0000010, // read
  guest: 0b0000001, // read
  dom_owner: 0b0100000,
  dom_admin: 0b0010000,
  dom_admin_security: 0b0001000,
  dom_admin_memeber: 0b0000100,
  dom_admin_view: 0b0000010,
  dom_member: 0b0000001,
  OWNER: 0b0100000,
  ADMIN: 0b0010000,
  DELETE: 0b0001000,
  WRITE: 0b0000100,
  READ: 0b0000010,
  ANONYMOUS: 0b0000001,
  ANYONE: 0b0000001,
  MODIFY: 0b0001000, 
  UPLOAD: 0b0000100, 
  VIEW: 0b0000010, 
  DOWNLOAD: 0b0000010, 
  GUEST: 0b0000001, 
  DOM_OWNER: 0b0100000,
  DOM_ADMIN: 0b0010000,
  DOM_ADMIN_SECURITY: 0b0001000,
  DOM_ADMIN_MEMEBER: 0b0000100,
  DOM_ADMIN_VIEW: 0b0000010,
  DOM_MEMBER: 0b0000001,
};

const { value, key, keys} = require('./functions');
module.exports = {...def, 
  permissionValue:function(v) {
    return value(v, def)
  }, 
  permissionKey:function(v) {
    return key(v, def)
  }, 
  permissionKeys:function(v) {
    return keys(v, def)
  },
}