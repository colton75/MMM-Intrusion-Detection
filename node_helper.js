var NodeHelper = require("node_helper");
const { spawn } = require("child_process");


module.exports = NodeHelper.create({
  socketNotificationReceived: function (notification, payload) {
    if (notification === "ACTIVATE") {
      console.log(payload);
      const process = spawn("python", ["./modules/MMM-Intrusion-Detection/python/intrusion_det.py"]);
      process.stdout.on("data", (data) => console.log(data.toString()));
      process.stderr.on("data", (data) => console.log("ERROR:",data.toString()));
      process.on("close", (data) => console.log("Python program ended"));
    } else if (notification === "DEACTIVATE") {
      console.log(payload);
      const process = spawn("pkill", ["-2","-f","python ./modules/MMM-Intrusion-Detection/python/intrusion_det.py"]);
    }
  },
});
