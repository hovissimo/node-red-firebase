module.exports = function(RED) {
    "use strict";
    var Firebase = require("firebase");

    function sendMessageFromSnapshot(snapshot) {
        var msg = {};
        msg.href = snapshot.ref().toString();
        msg.payload = snapshot.val();
        this.send(msg);
    }

    function FirebaseWatch(n) {
        RED.nodes.createNode(this,n);

        this.firebaseurl = n.firebaseurl;
        this.firebase = new Firebase(this.firebaseurl);
        this.onValue = sendMessageFromSnapshot.bind(this);

        this.firebase.on("value", this.onValue);

        this.on('close', function() {
            // We need to unbind our callback, or we'll get duplicate messages when we redeploy
            this.firebase.off("value", this.onValue);
        });
    }
    RED.nodes.registerType("firebase watch", FirebaseWatch);
}
