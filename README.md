# Firebase nodes for Node-RED

Check it out! Now you can access your Firebase data with Node-RED!
This allows you to automate Firebase data manipulation or generate custom events based on what's going on with your data store.

NOTE:  See the network https://github.com/hovissimo/node-red-firebase/network for other people who have made neat things based on this project since I stopped.

Installing node-red-firebase
----------------------------

    npm install firebase
    cd nodes/
    git clone https://github.com/hovissimo/node-red-firebase

Check out the demo flows
-----------------------
To see the Firebase nodes in action, you can start Node-RED with

    node red nodes/node-red-firebase/demo_flows.json
    

Note: You'll need to register your own Firebase account, and edit all of the Firebase nodes to use your personal Firebase URL.

It's easiest to see what's going on if you have the live Firebase view open in another browser window while you interact with the flows.

Have questions?  Found a bug?
-----------------------------
Please submit issues to the Github issue tracker

