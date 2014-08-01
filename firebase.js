module.exports = function(RED) {
    "use strict";
    var Firebase = require("firebase");

    function sendMessageFromSnapshot(snapshot) {
        var msg = {};
        msg.href = snapshot.ref().toString();
        msg.payload = snapshot.val();
        this.send(msg);
    }

    // This Constructor is used to initialize nodes at deploy time
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

            this.firebase.child(childpath).once('value', sendMessageFromSnapshot.bind(this));
        });
    }
    RED.nodes.registerType("firebase query", FirebaseQuery);

    function FirebaseModify(n) {
        RED.nodes.createNode(this,n);
        this.firebaseurl = n.firebaseurl;
        this.child = n.child;
        this.method = n.method;
        this.firebase = new Firebase(this.firebaseurl);

        switch (this.method) {
            case "set":
            case "update":
            case "push":
                // To prevent code repetition, call the Firebase API function based on method directly
                this.on('input', function(msg) {
                    // get path from msg or default to /
                    var childpath = (this.child) ? msg[this.child] : "";
                    // make sure the path starts with /
                    childpath = (childpath.indexOf("/") == 0) ? childpath : "/" + childpath;

                    this.firebase.child(childpath)[this.method](msg.payload);
                });
                break;
            case "remove":
                // Remove method expects first argument to be a function, so we call it differently
                this.on('input', function(msg) {
                    // get path from msg or default to /
                    var childpath = (this.child) ? msg[this.child] : "";
                    // make sure the path starts with /
                    childpath = (childpath.indexOf("/") == 0) ? childpath : "/" + childpath;

                    this.firebase.child(childpath)[this.method]();
                });
                break;
        }
    }
    RED.nodes.registerType("firebase modify", FirebaseModify);
}
