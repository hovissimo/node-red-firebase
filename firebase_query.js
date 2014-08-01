module.exports = function(RED) {
    "use strict";
    var Firebase = require("firebase");

    function sendMessageFromSnapshot(snapshot) {
        var msg = {};
        msg.href = snapshot.ref().toString();
        msg.payload = snapshot.val();
        this.send(msg);
    }
    function FirebaseQuery(n) {
        RED.nodes.createNode(this,n);

        this.firebaseurl = n.firebaseurl;
        this.child = n.child;
        this.firebase = new Firebase(this.firebaseurl);

        this.on('input', function(msg) {
            var childpath = (this.child) ? String(msg[this.child]) : ""; // get path from msg or default to /
            childpath = (childpath.indexOf("/") == 0) ? childpath : "/" + childpath; // make sure the path starts with /

            this.firebase.child(childpath).once('value', sendMessageFromSnapshot.bind(this));
        });
    }
    RED.nodes.registerType("firebase query", FirebaseQuery);
}
