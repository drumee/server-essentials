const argparse = require("argparse");
const parser = new argparse.ArgumentParser({
  description: "Drumee Server Essentials Args Parser",
  add_help: true,
});


parser.addArgument("--http-port", {
  type: "int",
  defaultValue: 80,
  help: "If set, write minimal configs, no jitsi, no bind",
});

parser.addArgument("--https-port", {
  type: "int",
  defaultValue: 443,
  help: "If set, write minimal configs, no jitsi, no bind",
});

parser.addArgument("--restPort", {
  type: "int",
  defaultValue: 24000,
  help: "Micro server posrt",
});

parser.addArgument("--pushPort", {
  type: "int",
  defaultValue: 23000,
  help: "Page server port + websocket",
});

parser.addArgument("--conf-path", {
  type: String,
  defaultValue: null,
  help: "Path to application conf dir",
});

const args = parser.parseArgs();

module.exports = args;
