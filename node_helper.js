var NodeHelper = require("node_helper");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const express = require("express");
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

    const dirPath = "/home/pi/Videos";
    const resolveBase = path.resolve(dirPath);

    this.expressApp.get('/intrusion/media', (req, res) => {
	fs.readdir(dirPath, (err, files) => {
	    if(err) return res.send(err);
	    let fileObj = {};
	    fileObj.fileArr = [];
	    files.map(file => {
		const filePath = path.join(resolveBase, file);
		const stat = fs.statSync(filePath);
		//console.log(stat);
		if(stat.isFile() && path.extname(file)===".mp4") {
			const f = {};
			let datetime = file.split(".")[0];
			[f.date, f.time] = datetime.split("_");
			f.fileName = file;
			f.videoLink = file
			f.imageLink = `${file.split(".")[0]}.jpg`
			fileObj.fileArr.push(f);
		}
	    })
	    res.json(fileObj);
	});
    })

    this.expressApp.use('/intrusion/media', express.static("/home/pi/Videos"));
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "SET_CONFIG") {
      //console.log(payload)
      config = payload;
    }
  },
});
