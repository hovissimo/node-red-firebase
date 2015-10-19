module.exports = function (RED) {
    'use strict';

    /**
     * FirebaseLoginNode
     *
     * The Server Definition - this opens (and closes) the connection
     *
     * @param n
     * @constructor
     */
    function FirebaseLoginNode(n) {

        var Firebase,
            node = this,
            firebaseStatus = require('./utility/status');

        RED.nodes.createNode(this, n);

        this.appid = n.appid;
        this.type = n.type;
        this.uid = n.uid;
        this.email = n.email;
        this.password = n.password;
        this.secret = n.secret;

        Firebase = require('firebase');

        // Retrieve the config node
        this.server = RED.nodes.getNode(n.server);

        if (this.credentials
            && this.credentials.appid
            && this.credentials.type) {

            firebaseStatus.connecting(this);

            this.url = 'https://' + this.credentials.appid + '.firebaseio.com';
            global.refFirebase = new Firebase(this.url);
            switch (this.credentials.type) {
                case 'custom':
                    LoginTypeCustom(node, firebaseStatus);
                    break;
                case 'email':
                    LoginTypeEmail(node);
                    break;
            }
        }
        else {
            this.error('Check your credentials! (Login node)');
        }

    }

    /**
     * Fire base login via user and secret
     * @constructor
     * @return void
     */
    function LoginTypeCustom(node) {
        var FirebaseLoginCustom,
            firebaseLoginCustom;

        FirebaseLoginCustom = require('firebase-login-custom');

        node.log('Firebase login custom');

        if (node.credentials.secret &&
            node.credentials.uid) {
            node.data = {
                uid: node.credentials.uid,
                secret: node.credentials.secret
            };

            firebaseLoginCustom = new FirebaseLoginCustom(node.refFirebase,
                {
                    uid: node.data.uid
                },
                {
                    secret: node.data.secret
                },
                function (error) {
                    if (error !== null) {
                        node.error('Login error with custom login');
                        node.error(error);
                    } else {
                        node.log('Login successful');
                    }
                }
            );
        } else {
            node.error('Check your secret!');
        }
    }

    /**
     * Fire base login via password and email
     * @constructor
     * @return void
     */
    function LoginTypeEmail(node) {
        var FirebaseLoginEmail,
            firebaseLoginEmail;

        FirebaseLoginEmail = require('firebase-login-email');

        node.log('Firebase login email');

        if (node.credentials.email &&
            node.credentials.password) {

            node.data = {
                email: node.credentials.email,
                password: node.credentials.password
            };

            firebaseLoginEmail = new FirebaseLoginEmail(
                global.refFirebase,
                node.data,
                function (error) {
                    if (error !== null) {
                        node.error('Login error with custom login');
                        node.error(error);
                    } else {
                        node.log('Login successful');
                    }
                }
            );
        } else {
            node.error('Check your email credentials!');
        }
    }

    RED.nodes.registerType('firebase login', FirebaseLoginNode, {
        credentials: {
            appid: {type: 'text'},
            type: {type: 'text'},
            uid: {type: 'text'},
            email: {type: 'text'},
            password: {type: 'password'},
            secret: {type: 'text'}
        }
    });
};
