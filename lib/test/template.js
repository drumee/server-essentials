
const { render, write } = require("../template");
const { resolve } = require("path");
global.debug = 5;
async function run_test() {
  let data = {
    name: "Test Rendering",
    link: "#"
  }
  let tpl = resolve(__dirname, 'asset', 'welcome.html')
  let out = resolve(__dirname, 'build', 'welcome.html')
  let content = render(data, tpl);
  console.log("RENDERED CONTENT", content);
  write(data, {tpl, out})
}

run_test().then(() => {
  process.exit(0);
})
