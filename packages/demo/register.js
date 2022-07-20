const dotenv = require("dotenv");
const { register } = require("esbuild-register/dist/node");

dotenv.config();
register({
  target: "es6",
});
