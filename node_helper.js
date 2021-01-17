var NodeHelper = require("node_helper");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
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

    const dirPath = "../../Videos"
    const resolveBase = path.resolve(dirPath);

    this.expressApp.get('/videos', (req, res) => {
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
			//f.time = datetime.split("_")[1];
			f.fileName = file;
			f.videoLink = `/videos/download/${file}`
			f.imageLink = `/videos/download/${file.split(".")[0]}.jpg`
			fileObj.fileArr.push(f);
		}
	    })
	    res.json(fileObj);
	});
    })

    this.expressApp.get('/videos/download/:fileName', (req, res) => {
	const filePath = path.join(resolveBase, req.params.fileName);
	res.download(filePath);
    })
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "SET_CONFIG") {
      //console.log(payload)
      config = payload;
    }
  },
});
