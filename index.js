const envReader = require("dotenv");
envReader.config(); // reads .env and merges it into process.env
// can condense the two lines above into one line as below
// require('dotenv').config()

const server = require("./server.js");
const port = process.env.PORT || 4000;

server.listen(port, () => {
  console.log("\n* Server Running on http://localhost:4000 *\n");
});
