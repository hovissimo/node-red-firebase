module.exports = function(RED) {
    'use strict';

    function sendMessageFromSnapshot(snapshot) {
        var msg = {};
        msg.href = snapshot.ref().toString();
        msg.payload = snapshot.val();
        this.send(msg);
    }

    function FirebaseWatch(n) {
        var Firebase = require('firebase'),
            firebaseStatus = require('./utility/status');

        RED.nodes.createNode(this,n);

        this.credentials = RED.nodes.getNode(n.firebaselogin).credentials;
        this.onValue = sendMessageFromSnapshot.bind(this);
        this.firebasepath = n.firebasepath;

        // Status
        firebaseStatus.connecting(this);

        // Check credentials
        if (!this.credentials.appid) {
            firebaseStatus.error(this,'Check credentials!');
            this.error('You need to setup Firebase credentials!');
        } else {
            this.firebaseurl = 'https://' + this.credentials.appid + '.firebaseio.com/' + this.firebasepath;
            this.firebase = new Firebase(this.firebaseurl);

            // Status
            firebaseStatus.checkStatus(this);

            this.firebase.on('value', this.onValue);
            this.on('close', function() {
                // We need to unbind our callback, or we'll get duplicate messages when we redeploy
                this.firebase.off('value', this.onValue);
            });
        }
    }
    RED.nodes.registerType('firebase watch', FirebaseWatch);
};
