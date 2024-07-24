const { readFileSync } = require(`jsonfile`);
const { existsSync } = require(`fs`);
const { join } = require("path");
const EXCHANGE = `/etc/drumee/conf.d/exchange.json`;
const MY_CONF = `/etc/drumee/conf.d/myDrumee.json`;
const sysEnvFile = `/etc/drumee/drumee.json`;
const { env } = process;
let data = {};
if (existsSync(sysEnvFile)) {
  data = require(sysEnvFile)
} else {
  data = require("../default/env.json")
}

let {
  acme_dir,
  acme_email_account,
  acme_store,
  backup_dir,
  ca_server,
  cache_dir,
  credential_dir,
  data_dir,
  db_user,
  domain_desc,
  domain_name,
  drumee_root,
  export_dir,
  import_dir,
  log_dir,
  own_certs_dir,
  own_ssl,
  plugins_dir,
  public_ui_root,
  system_group,
  system_user,
  tmp_dir,
  socketPath
} = data;

system_user = system_user || 'www-data';
system_group = system_group || system_user || 'www-data';

const app_routing_mark = public_ui_root || "/-";
const domain = domain_name || env.DRUMEE_DOMAIN_NAME;
const instance = env.instance_name || 'main';
const jitsi_domain = `jit.${domain}`;

const root = drumee_root || env.DRUMEE_ROOT || '/srv/drumee';
const runtime_dir = join(root, 'runtime');
const server_dir = join(runtime_dir, 'server');
const quota_watermark = Infinity;
const rewite_root = "/";
const instance_mode = env.instance_mode || 'dist';
const secret_dir = credential_dir || '/etc/drumee/credential';
const static_dir = join(root, 'static');
const ui_base = join(runtime_dir, 'ui');
const server_location = join(server_dir, instance_mode, instance);
const ui_location = join(ui_base, instance_mode, instance);
const verbosity = 2;
const ws_location = "/websocket/";
let end_point = app_routing_mark;
let svc_location = join(app_routing_mark, "svc");
let vdo_location = join(app_routing_mark, "vdo");

if (instance != 'main') {
  end_point = join(app_routing_mark, instance);
  svc_location = join(end_point, "svc");
}

log_dir = log_dir || join(server_dir, ".pm2/logs");
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

export_dir = exchanges.export_dir || export_dir;
import_dir = exchanges.import_dir || import_dir;

const certs_dir = join(acme_dir, "certs");
const mfs_dir = join(data_dir, "mfs");
const COFIGS = {
  acme_dir,
  acme_email_account,
  acme_store,
  app_routing_mark,
  backup_dir: backup_dir || "",
  ca_server,
  cache_dir,
  certs_dir,
  credential_dir: secret_dir,
  data_dir,
  db_user,
  domain_desc,
  domain_name: domain,
  domain,
  drumee_root: root,
  end_point,
  endpoint: end_point,
  export_dir,
  import_dir,
  instance,
  instance_mode,
  instance_name: instance,
  jitsi_domain,
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
  rewite_root,
  runtime_dir,
  server_dir,
  server_home: server_dir,
  server_location,
  socketPath,
  static_dir,
  svc_location,
  svc: svc_location,
  system_group,
  system_user,
  tmp_dir,
  ui_base,
  ui_location,
  vdo: vdo_location,
  vdo_location,
  verbosity,
  ws_location,
}

/**
 * 
 * @returns 
 */
function sysEnv() {
  return COFIGS;
}
module.exports = sysEnv;
