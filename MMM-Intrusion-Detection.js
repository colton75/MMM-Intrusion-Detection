Module.register("MMM-Intrusion-Detection", {
  defaults: {
    active: false,
  },

  start: function () {
    Log.log(this.name + " is started!");
    this.sendSocketNotification('SET_CONFIG', this.config);
  },
});