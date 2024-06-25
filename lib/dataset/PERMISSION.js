/**
 * 
 */

// Permission a particular privilege the user ask for
// It's a particular among the ones that compose the privilege word 
// The permission is 
// Therefore Site.get(_a.privilege) gives the user privilege whithin the site

module.exports = {
  OWNER: 0b0100000,
  ADMIN: 0b0010000,
  DELETE: 0b0001000,
  WRITE: 0b0000100,
  READ: 0b0000010,
  ANONYMOUS: 0b0000001,
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
  DOM_MEMBER: 0b0000001
}