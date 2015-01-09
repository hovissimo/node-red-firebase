module.exports = function (RED) {
    "use strict";

    // The Server Definition - this opens (and closes) the connection
    function FirebaseServerNode(n) {
        RED.nodes.createNode(this, n);
        this.firebaseserver = n.firebaseserver;
    }

    RED.nodes.registerType("firebase server", FirebaseServerNode, {
        credentials: {
            url: { type: "text" },
            email: { type: "text" },
            password: { type: "password" }
        }
    });
}
