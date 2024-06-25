
// let dbConf = require('../configs')();
// console.log("DB CONF IS", dbConf);

const {Cache, Mariadb, Offline}  = require("..");
/**
 * 
 * @param {*} e 
 */
function filecap(e){
  console.log(`File capabilitie of ${e}`, Cache.getFilecap('mp4'));
}

/**
 * 
 * @param {*} e 
 */
function message(key){
  console.log(`=========== Translation for ${key} ===========`);
  for(let l of Cache.languages()){
    console.log(`${l}: ${Cache.message(key)}`);
  }
}

/**
 * 
 * @param {*} e 
 */
function sysConf(){
  console.log(`=========== getSysConf ===========`);
  for(let k of ['wallpaper_b2b', 'public_email', 'public_id']){
    console.log(`${k} --> `, Cache.getSysConf(k));
  }
}
/**
 * 
 */
function quit(){
  let offline = new Offline();
  offline.stop();
}

global.verbosity = 9;
(async()=>{
  let db = new Mariadb({ name: 'yp', user:process.env.USER, idleTimeout: 60 });  
  new Cache();
  await Cache.load(db);

  for(let c of ['pdf', 'mp4', 'docx']){
    filecap(c);
  }

  for(let c of ['_access_videoconference', '_firstname', '_change_password']){
    message(c);
  }

  sysConf();

  Cache.setEnv({"one": 1, "two": 2});
  console.log("get env", Cache.getEnv("one"), Cache.getEnv("two"));
  db.info("Checking log : DEBUG");
  db.syslog("Checking log : SYSLOG");
  quit();
})()