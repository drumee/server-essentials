/**
 * 
 */

// Privileges specific to domain access control
// Privilege is the bit block that contains all the privilège
// The privilege is attached to the visitor whithin the hub scope
// Therefore Site.get(_a.privilege) gives the user privilege whithin the site

module.exports = {
  ROOT: 0b1111111,
  DOM_OWNER: 0b0111111,
  DOM_ADMIN: 0b0011111,
  DOM_ADMIN_SECURITY: 0b0001111,
  DOM_ADMIN_MEMEBER: 0b0000111,
  DOM_ADMIN_VIEW: 0b0000011,
  DOM_MEMBER: 0b0000001,
  OWNER: 0b0011111,
  ADMIN: 0b0001111,
  DELETE: 0b0000111,
  WRITE: 0b0000011,
  READ: 0b0000001,
}