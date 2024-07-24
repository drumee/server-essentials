
const Logger = require('./logger');
class logger extends Logger {

  /**
   * 
   * @param {*} cmd 
   * @param {*} trace 
   * @returns 
   */
  exec(cmd, trace = 0) {
    if (trace) {
      this.debug(`EXECUTING cmd=${cmd}`);
    }
    try {
      const { exec: run } = require('shelljs');
      const r = run(cmd);
      if (r.code === 0) {
        return true;
      } else {
        this.syslog(`Shell command **${cmd}** exited with status=${r.code}`);
      }
    } catch (e) {
      this.syslog(`Failed to execute shell command = ${cmd}`, e);
    }
    return false;
  }


  /**
   * 
   * @param {*} msg 
   */
  stop(msg) {
    let status = 0;
    const { isString } = require("lodash");
    if (isString(msg)) {
      console.error(msg);
      status = 1;
    }
    console.log("DONE!!!", msg);
    if (this.db) this.db.end();
    this.clear();
    setTimeout(() => {
      process.exit(status)
    }, 1000);
  }

}

module.exports = logger;
