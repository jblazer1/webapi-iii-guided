const express = require("express"); // importing a CommonJS module
const helmet = require("helmet");
const logger = require("morgan");

const hubsRouter = require("./hubs/hubs-router.js");

const server = express();

// GLOBAL MIDDLEWARE

// built in middleware
server.use(express.json());

// third party middleware
server.use(helmet());
server.use(logger("dev"));

// custom middleware
// at the bottom of the page function TYPELOGGER is declared and then put in as a parameter
// for the server to use
server.use(typeLogger);
server.use(addName);
// server.use(lockout);
// server.use(moodyGatekeeper);

// router
server.use("/api/hubs", hubsRouter);

// server.get("/", async (req, res) => {
//   try {
//     const shoutouts = await db("shoutouts");
//     res.status(200).json({ messageOfTheDay: process.env.MOTD, shoutouts });
//   } catch (error) {
//     console.error("\nERROR", error);
//     res.status(500).json({ error: "Cannot retrieve the shoutouts" });
//   }
// });

server.get("/", (req, res) => {
  const nameInsert = req.name ? ` ${req.name}` : "";

  res.status(200).json({ messageOfTheDay: process.env.BANANA });
  res.send(`
  <h2>Lambda Hubs API</h2>
  <p>Welcome${nameInsert} to the Lambda Hubs API</p>
  `);
});

// custom middleware declared here and plugged into server.use at the top of the page
function typeLogger(req, res, next) {
  console.log(`${req.method} Request`);
  next();
}

function addName(req, res, next) {
  req.name = req.name || "Dumas";
  next();
}

function lockout(req, res, next) {
  res.status(403).json({ message: "You been locked out bitch!" });
}

// keeps you out 1/3 of the time
// when kept out it sends back status 403 message: "you shall not pass"
function moodyGatekeeper(req, res, next) {
  const seconds = new Date().getSeconds();

  if (seconds % 3 === 0) {
    res.status(403).json({ message: "You shall not pass!!!" });
  } else {
    next();
  }
}

// global catch all error handler - must be at the bottom of file right before the export
// only executes if next() is called with an argument
server.use((err, req, res, next) => {
  res
    .status(500)
    .json({ message: "This is from the global error handler", err });
});

module.exports = server;
