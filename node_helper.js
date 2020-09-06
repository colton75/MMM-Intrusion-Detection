var NodeHelper = require("node_helper");
const { spawn } = require("child_process");
var config;

module.exports = NodeHelper.create({

  start: function() {

    this.expressApp.get('/api/intrusion/activate', (req, res) => {
      const process = spawn("python", ["./modules/MMM-Intrusion-Detection/python/intrusion_det.py"]);
      process.stdout.on("data", (data) => console.log(data.toString()));
      process.stderr.on("data", (data) => console.log("ERROR:",data.toString()));
      process.on("close", (data) => {console.log("Python program ended"); config.active=false});
      config.active = true;
      res.send("Intrusion system activated");
    })

    this.expressApp.get('/api/intrusion/deactivate', (req, res) => {
      const process = spawn("pkill", ["-2","-f","python ./modules/MMM-Intrusion-Detection/python/intrusion_det.py"]);
      //config.active = false;
      res.send("Intrusion system deactivated");
    })

    this.expressApp.get('/api/intrusion/isactive', (req, res) => {
      //console.log("check if active: ",config);
      res.send({active: config.active});
    })
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "SET_CONFIG") {
      //console.log(payload)
      config = payload;
    }
  },
});
