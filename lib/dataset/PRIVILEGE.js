/**
 * 
 */


// Privilege is the bit block that contains all the privilège
// The privilege is attached to the visitor whithin the hub scope
// Therefore Site.get(_a.privilege) gives the user privilege whithin the site

module.exports = {
  OWNER: 0b0111111,
  ADMIN: 0b0011111,
  DELETE: 0b0001111,
  WRITE: 0b0000111,
  READ: 0b0000011,
  ANONYMOUS: 0b0000001,
  //aliases
  MODIFY: 0b0001111,
  UPLOAD: 0b0000111,
  VIEW: 0b0000011,
  DOWNLOAD: 0b0000011,
  GUEST: 0b0000001,

}