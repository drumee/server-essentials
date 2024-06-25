
// let dbConf = require('../configs')();
// console.log("DB CONF IS", dbConf);
const { request } = require("../network");
//let url = `https://resellers.drumee.com/_/svc/yp.get_env`;
let url = `https://tunnel.drumee.com/faq/intro/intro_video_2.mp4`;
let opt = {
  method: 'GET',
  outfile: '/tmp/intro_video_2.mp4',
  url
}
request(opt).then((data) => {
  console.log("DATA", data);
}).catch((err) => {
  console.log("ERROR", url, err.statusMessage);
})