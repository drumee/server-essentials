
// let dbConf = require('../configs')();
// console.log("DB CONF IS", dbConf);
const { Mariadb } = require("..");
let db = new Mariadb({ name: 'yp', user:process.env.USER, idleTimeout: 60 });
async function run_test(){
  let seq1 = await db.await_query('SELECT 1 AS n');
  console.log("SEQ1", seq1[0]);
  let seq2 = await db.await_query('SHOW TABLES');
  console.log("SEQ2", seq2[0]);
  
}

run_test().then(()=>{
  db.end();
  process.exit(0);
})
