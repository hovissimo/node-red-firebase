module.exports = function (RED) {
    'use strict';

    function FirebaseModify(n) {
        var Firebase = require('firebase'),
            firebaseStatus = require('./utility/status');

        RED.nodes.createNode(this, n);

        this.child = n.child;
        this.credentials = RED.nodes.getNode(n.firebaselogin).credentials;
        this.firebasepath = n.firebasepath;
        this.method = n.method;

        // Status
        firebaseStatus.connecting(this);

        // Retrieve the config node
        if (!this.credentials.appid) {
            firebaseStatus.error(this, 'Check credentials!');
            this.error('You need to setup Firebase credentials!');
        } else {
            this.firebaseurl = 'https://' + this.credentials.appid + '.firebaseio.com/' + this.firebasepath;
            this.firebase = new Firebase(this.firebaseurl);

            // Status
            firebaseStatus.checkStatus(this);

            switch (this.method) {
                case 'set':
                case 'update':
                case 'push':
                    // To prevent code repetition, call the Firebase API function based on method directly
                    this.on('input', function (msg) {
                        // get path from msg or default to /
                        var childpath = (this.child) ? msg[this.child] : '';
                        // make sure the path starts with /
                        childpath = (childpath.indexOf('/') == 0) ? childpath : '/' + childpath;

                        this.firebase.child(childpath)[this.method](msg.payload);
                    });
                    break;
                case 'remove':
                    // Remove method expects first argument to be a function, so we call it differently
                    this.on('input', function (msg) {
                        // get path from msg or default to /
                        var childpath = (this.child) ? msg[this.child] : '';
                        // make sure the path starts with /
                        childpath = (childpath.indexOf('/') == 0) ? childpath : '/' + childpath;

                        this.firebase.child(childpath)[this.method]();
                    });
                    break;
            }
        }
    }

    RED.nodes.registerType('firebase modify', FirebaseModify);
};
