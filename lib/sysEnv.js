const { readFileSync } = require(`jsonfile`);
const { existsSync } = require(`fs`);
const { join } = require("path");
let EXCHANGE = `/etc/drumee/conf.d/exchange.json`;
let MY_CONF = `/etc/drumee/conf.d/myDrumee.json`;
let sysEnvFile = `/etc/drumee/drumee.json`;
let credential_dir = `/etc/drumee/credential`;
let COFIGS = {};
let UI_INFO = {};
let PLUGINS_INFO = {};

const CONST = new Map();
const { env } = process;
/**
 * 
 * @param {*} chroot 
 */
function loadSysEnv(chroot) {
  if (chroot && existsSync(chroot)) {
    EXCHANGE = `/${chroot}/drumee/conf.d/exchange.json`;
    MY_CONF = `/${chroot}/drumee/conf.d/myDrumee.json`;
    sysEnvFile = `/${chroot}/drumee/drumee.json`;
    credential_dir = `/${chroot}/drumee/credential`;
  }
  let data = require("./default/env.json");
  if (existsSync(sysEnvFile)) {
    data = { ...data, ...require(sysEnvFile) }
  }

  let {
    acme_dir,
    acme_email_account,
    backup_dir,
    ca_server,
    cache_dir,
    certs_dir,
    data_dir,
    db_user,
    domain_desc,
    domain_name, /** Legacy */
    drumee_root,
    endpoint_name,
    export_dir,
    import_dir,
    log_dir,
    own_certs_dir,
    own_ssl,
    plugins_dir,
    private_domain,
    public_domain,
    public_ui_root,
    socketPath,
    system_group,
    system_user,
    tmp_dir,
  } = data;

  public_domain = public_domain || env.PUBLIC_DOMAIN;
  private_domain = private_domain || env.PRIVATE_DOMAIN;
  endpoint_name = env.route || endpoint_name || 'main';
  const app_routing_mark = public_ui_root || "/-";
  const domain = public_domain || private_domain || domain_name;
  const root = drumee_root;
  const runtime_dir = join(root, 'runtime');
  const server_base = join(runtime_dir, 'server');
  const quota_watermark = Infinity;
  const rewite_root = "/";
  const secret_dir = credential_dir || '/etc/drumee/credential';
  const static_dir = join(root, 'static');
  const ui_base = join(runtime_dir, 'ui');
  const verbosity = 2;
  const ws_location = "/websocket/";

  let server_location = join(server_base, endpoint_name);
  let ui_location = join(ui_base, endpoint_name);
  let endpoint_path = app_routing_mark;
  let svc_location = join(app_routing_mark, "svc");
  let vdo_location = join(app_routing_mark, "vdo");

  if (endpoint_name != 'main') {
    endpoint_path = join(app_routing_mark, endpoint_name);
    svc_location = join(endpoint_path, "svc");
  }

  log_dir = log_dir || join(server_base, ".pm2/logs");
  tmp_dir = tmp_dir || env.DRUMEE_TMP_DIR || join(runtime_dir, 'tmp');

  plugins_dir = plugins_dir || "/etc/drumee/conf.d/plugins"
  socketPath = socketPath || "/var/run/mysqld/mysqld.sock"
  let exchanges = {};
  let myConf = {};
  if (existsSync(EXCHANGE)) {
    exchanges = readFileSync(EXCHANGE);
  }
  if (existsSync(MY_CONF)) {
    myConf = readFileSync(MY_CONF);
  }
  let { quota } = myConf;
  if (!quota) {
    quota = { watermark: quota_watermark }
  }
  export_dir = exchanges.export_dir || export_dir;
  import_dir = exchanges.import_dir || import_dir;

  const mfs_dir = join(data_dir, "mfs");

  let ui_home = ui_base;
  if (env.ui_home) {
    ui_home = env.ui_home;
  } else {
    ui_home = join(ui_base, endpoint_name);
  }

  let server_home = server_base;
  if (env.server_home) {
    server_home = env.server_home;
  } else {
    server_home = join(server_base, endpoint_name);
  }

  COFIGS = {
    acme_dir,
    acme_email_account,
    app_routing_mark,
    backup_dir: backup_dir || "",
    ca_server,
    cache_dir,
    certs_dir: own_certs_dir || certs_dir,
    credential_dir: secret_dir,
    data_dir,
    db_user,
    domain_desc,
    domain_name: domain,
    domain,
    drumee_root: root,
    endpoint_name,
    endpoint_path,
    export_dir,
    import_dir,
    log_dir,
    log_level: verbosity,
    main_domain: domain,
    mfs_dir,
    myConf,
    own_certs_dir,
    own_ssl,
    plugins_dir,
    public_ui_root: app_routing_mark,
    quota_watermark,
    quota,
    rewite_root,
    runtime_dir,
    server_dir: server_base, /** To be deprecated */
    server_base,
    server_home,
    server_location,
    socketPath,
    static_dir,
    svc_location,
    svc: svc_location,
    system_group,
    system_user,
    tmp_dir,
    ui_base,
    ui_home,
    ui_location,
    vdo_location,
    vdo: vdo_location,
    verbosity,
    ws_location,
  }
  UI_INFO = loadUiinfo('app');
  PLUGINS_INFO = loadUiinfo('plugins');
}

/**
 * 
 * @returns 
 */
function sysEnv() {
  return { ...COFIGS, };
}

/**
 * 
 * @param {*} attr 
 * @param {*} value 
 */
function getSysConst(attr, value) {
  if (CONST.get(attr) != null) {
    console.warn(`getSysConst: ${attr} already set. Ignoring new value. Use setSysConst instead`);
    return CONST.get(attr)
  }
  CONST.set(attr, value)
  return CONST.get(attr)
}

/**
 * 
 * @param {*} attr 
 * @param {*} value 
 */
function setSysConst(attr, value) {
  CONST.set(attr, value)
  return CONST.get(attr)
}

/**
 * 
 */
function loadUiinfo(dir) {
  let { ui_home } = sysEnv();
  let app_file = join(ui_home, dir, "index.json");
  if (existsSync(app_file)) {
    return readFileSync(app_file);
  } else {
    console.warn(`loadUiinfo: ${dir} UI information file was not found under ${ui_home}`);
  }
  return {}
}


/**
* 
*/
function getUiInfo() {
  return UI_INFO;
}

/**
* 
*/
function getPluginsInfo() {
  return PLUGINS_INFO;
}

loadSysEnv();



module.exports = { sysEnv, getSysConst, setSysConst, loadSysEnv, getUiInfo, getPluginsInfo };
