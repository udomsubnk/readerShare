var admin = require("firebase-admin");
var MicroGear = require('microgear')
var firebase = require('firebase')

firebase.initializeApp({
  apiKey: "AIzaSyCxV1SPVPdDQg539Ir6G0Rn5Y-WgAAgzVs",
  authDomain: "reader-db.firebaseapp.com",
  databaseURL: "https://reader-db.firebaseio.com",
  storageBucket: "reader-db.appspot.com"
})

var microgear = MicroGear.create({
  key : "6xeLdlHHWBuM49O",
  secret : "tzTRtxJbuejASaIBHWD3snUa3",
  alias: 'server'
});

var database = firebase.database();

module.exports = {
  notification: function() {
  	microgear.connect('noti')
      microgear.on('connected', function() {
        console.log('test')
		  microgear.publish('/message','eieieeiieieie.')
		    microgear.disconnect()
	  })
  }
}
