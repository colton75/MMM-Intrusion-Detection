Module.register("MMM-Intrusion-Detection", {
  defaults: {
    active: false,
  },

  start: function () {
    Log.log(this.name + " is started!");
  },

  notificationReceived: function (notification, payload, sender) {
    if (notification === "ACTIVATE") {
      if (!this.config.active) {
        //console.log("Intrusion System Activated............");
        this.sendSocketNotification("ACTIVATE", "activated");
        this.config.active = true;
      }
    }
    if (notification === "DEACTIVATE") {
      if (this.config.active) {
        //console.log("Intrusion System Dectivated............");
        this.sendSocketNotification("DEACTIVATE", "deactivated");
        this.config.active = false;
      }
    }
  },
});
