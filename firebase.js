module.exports = function(RED) {
    "use strict";
    var Firebase = require("firebase");

    // This Constructor is used to initialize nodes at deploy time
    function FirebaseWatch(n) {
        RED.nodes.createNode(this,n);

        this.firebaseurl = n.firebaseurl;
        this.firebase = new Firebase(this.firebaseurl);
        this.onValue = (function(snapshot) {
            var msg = {};
            msg.href = this.firebaseurl;
            msg.payload = snapshot.val();
            this.send(msg);
        }).bind(this);

        this.firebase.on("value", this.onValue);

        this.on('close', function() {
            // We need to unbind our callback, or we'll get duplicate messages when we redeploy
            this.firebase.off("value", this.onValue);
        });
    }
    // Register the node by name. This must be called before overriding any of the Node functions.
    RED.nodes.registerType("firebase watch", FirebaseWatch);

    function FirebaseQuery(n) {
        RED.nodes.createNode(this,n);

        this.firebaseurl = n.firebaseurl;
        this.child = n.child;
        this.firebase = new Firebase(this.firebaseurl);

        this.on('input', function(msg) {
            var childpath = (this.child) ? String(msg[this.child]) : ""; // get path from msg or default to /
            childpath = (childpath.indexOf("/") == 0) ? childpath : "/" + childpath; // make sure the path starts with /

            this.firebase.child(childpath).once('value', (function(snapshot) {
                msg.href = this.firebaseurl + childpath;
                msg.payload = snapshot.val();
                this.send(msg);
            }).bind(this));
        });
    }
    RED.nodes.registerType("firebase query", FirebaseQuery);

    function FirebaseSet(n) {
        RED.nodes.createNode(this,n);

        this.firebaseurl = n.firebaseurl;
        this.child = n.child;
        this.firebase = new Firebase(this.firebaseurl);

        this.on('input', function(msg) {
            var childpath = (this.child) ? msg[this.child] : ""; // get path from msg or default to /
            childpath = (childpath.indexOf("/") == 0) ? childpath : "/" + childpath; // make sure the path starts with /
            this.firebase.child(childpath).set(msg.payload);
        });
    }
    RED.nodes.registerType("firebase set", FirebaseSet);

    function FirebaseAdd(n) {
        RED.nodes.createNode(this,n);

        this.firebaseurl = n.firebaseurl;
        this.child = n.child;
        this.firebase = new Firebase(this.firebaseurl);

        this.on('input', function(msg) {
            var childpath = (this.child) ? msg[this.child] : ""; // get path from msg or default to /
            childpath = (childpath.indexOf("/") == 0) ? childpath : "/" + childpath; // make sure the path starts with /
            this.firebase.child(childpath).push(msg.payload);
        });
    }
    RED.nodes.registerType("firebase add", FirebaseAdd);
}
