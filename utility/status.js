/**
 * Status
 *
 * @type {{offline: Function, connecting: Function, connected: Function, error: Function, addListener: Function}}
 */
module.exports = {

    /**
     * Status offline
     *
     * @param node
     */
    offline: function (node) {
        node.status({
                fill: 'gray',
                shape: 'ring',
                text: 'disconnected'
            }
        );
    },

    /**
     * Status connecting
     *
     * @param node
     */
    connecting: function (node) {
        node.status({
                fill: 'grey',
                shape: 'ring',
                text: 'connecting'
            }
        );
    },

    /**
     * Status connected
     *
     * @param node
     */
    connected: function (node) {
        node.status({
                fill: 'green',
                shape: 'dot',
                text: 'connected'
            }
        );
    },

    /**
     * Status error
     *
     * @param node
     * @param msg
     */
    error: function (node, msg) {
        node.status({
                fill: 'red',
                shape: 'ring',
                text: msg || 'connection failed'
            }
        );
    },

    /**
     * AddEventListener
     *
     * @param node
     */
    addListener: function (node) {

        var self = this;

        global.refFirebase.onAuth(function(authData) {
            if (authData) {
                self.connected(node);
            } else {
                self.error(node);
            }
        });

        global.refFirebase.offAuth(function(authData) {
            if (authData) {
                self.connected(node);
            } else {
                self.offline(node);
            }
        });
    },

    /**
     * AddEventListener
     *
     * @param node
     */
    checkStatus: function (node) {

        var authData,
            self = this;

        node.firebase.onAuth(function(authData) {
            if (authData) {
                self.connected(node);
            } else {
                self.error(node);
            }
        });

        node.firebase.offAuth(function(authData) {
            if (authData) {
                self.connected(node);
            } else {
                self.offline(node);
            }
        });

        authData = node.firebase.getAuth();
        if (authData) {
            self.connected(node);
        } else {
            self.offline(node);
        }
    }
};
