module.exports = function(RED) {
    "use strict";
    var Firebase = require("firebase");

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
