const fs = require("fs");

const appPort = fs.readFileSync("/etc/config/app.port", "utf-8");
console.log("appPort from file: ", appPort);

const appHost = process.env.APP_HOST;
console.log("appHost from env: ", appHost);
