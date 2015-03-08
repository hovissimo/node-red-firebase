module.exports = function (RED) {
    'use strict';

    function sendMessageFromSnapshot(msg, snapshot) {
        msg.href = snapshot.ref().toString();
        msg.payload = snapshot.val();
        this.send(msg);
    }

    function FirebaseQuery(n) {
        var Firebase = require('firebase'),
            firebaseStatus = require('./utility/status');

        RED.nodes.createNode(this, n);

        this.child = n.child;
        this.credentials = RED.nodes.getNode(n.firebaselogin).credentials;
        this.firebasepath = n.firebasepath;

        // Status
        firebaseStatus.connecting(this);

        // Check credentials
        if (!this.credentials.appid) {
            firebaseStatus.error(this, 'Check credentials! (Query)');
        } else {
            this.firebaseurl = 'https://' + this.credentials.appid + '.firebaseio.com/' + this.firebasepath;
            this.firebase = new Firebase(this.firebaseurl);

            // Status
            firebaseStatus.checkStatus(this);

            // Add listener
            this.on('input', function (msg) {
                var childpath = (this.child) ? String(msg[this.child]) : ''; // get path from msg or default to
                childpath = (childpath.indexOf('/') == 0) ? childpath : '/' + childpath; // make sure the path starts with
                this.firebase.child(childpath).once('value', sendMessageFromSnapshot.bind(this, msg));
            });
        }
    }

    RED.nodes.registerType('firebase query', FirebaseQuery);
};
