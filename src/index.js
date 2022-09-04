// Simple application file that initialized the web page (NOT TO BE USED WITH OBS AS A OVERLAY)

/*
Type 1 = {"Type":"1","userid":"numerical_id","order":0}
- This message is sent for every user added to the match, until there's no more users found in that list.
- The frontend handles showing the actual users playing, and not the overlay or the coordinator.

Type 2 = {"Type":"2"}
- This message tells that the match has been deleted, the script is free to create a new match.

Type 3 = {"Type":"3","LevelId":"custom_level_43304202EC7681E52B4026313C7AB9099BE2890D","Diff":2}
- This message is sent to change the lvl on the frontend in real time. - Sends the hash and diff. (Easy:0, Normal:1, Hard:2, Expert:3, ExpertPlus:4)

Type 4 = {'Type':'4','playerId':e.data.user_id,'score':e.data.score,'combo':e.data.combo,'acc':e.data.accuracy,'visible':true}
- This message sends the playerid, their score, their combo and their acc. Visible:true is gonna get removed later on, currently I'm just lazy
*/

const tournament_assistant_client_1 = require("tournament-assistant-client");
const WebSocket = require("ws");

let songData = ["", 0];
let matchData = [];
let inMatch = false;

// Do not blame me. Blame whoever Hawk blames.
var port = 2222;
const wss = new WebSocket.Server({ "port": port });
wss.on('connection', function connection(ws) {
    ws.on('message', function message(data, isBinary) {
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data, { binary: isBinary });
            }
        });
    });
});

const taWebsocket = new tournament_assistant_client_1.TAWebsocket({
    url: "ws://ta.danesaber.cc:2053",
    name: "Dane Saber Overlay",
});

//Connect to the relay server we created above. - Make sure your frontend is connecting to THIS ip.
let ws = new WebSocket("ws://localhost:2222");
sockets = ws;
//If the connection is opened successfully, we tell the user that.
ws.onopen = function(event) {
    console.log("Connected to Relay server");
};

taWebsocket.taClient.on('matchCreated', async (e) => {
    //If the backend is not locked into a current match, we continue.
    if (!inMatch) {
        //Add this client as an associated user
        e.data.associated_users.push(taWebsocket.taClient.Self);
        taWebsocket.sendEvent(new tournament_assistant_client_1.Packets.Event({
            match_updated_event: new tournament_assistant_client_1.Packets.Event.MatchUpdatedEvent({ match: e.data })
        }));

        for (var i = 0; i < e.data.associated_users.length; i++) {
            var findCoord = e.data.associated_users[i].name;
            if((i + 2) == (e.data.associated_users.length)){
                var coordinator = findCoord;
            }
            if (e.data.associated_users[i].user_id > 60) {
                matchData.push(e.data.associated_users[i].user_id);
                
                console.log("Player "+[i+1]+": "+matchData[i]+" | "+e.data.associated_users[i].name);
            }
        }
        sockets.send(JSON.stringify({'Type': '1','userid': matchData,'coordinator': coordinator,'order': i}));
        inMatch = true;

        console.log("Match created, backend locked by coordinator "+coordinator);
    }
});

//This is triggered when a match is deleted.
taWebsocket.taClient.on('matchDeleted', async (e) => {    
    //Here we check if the user_id associated with the data recieved, is in matchData[>0<,0], and if it is, we continue.
if (matchData[0] == e.data.associated_users[0].user_id) {
    //Here we send the message to the frontend through the relay server
    sockets.send(JSON.stringify({'Type': '2'}));
    //Here we unlock the backend.
    matchData.length = 0;
    inMatch = false;
    console.log("Match deleted, backend unlocked.");
}
});

taWebsocket.taClient.on("matchUpdated", (e) => {
    if (matchData[0] == e.data.associated_users[0].user_id) {
        if (typeof e.data.selected_level != "undefined") {
            if (songData[0] != e.data.selected_level.level_id || songData[1] != e.data.selected_difficulty) {
                sockets.send(JSON.stringify({'Type': '3','LevelId': e.data.selected_level.level_id,'Diff': e.data.selected_difficulty}));
                songData[1] = e.data.selected_level.level_id;
                songData[0] = e.data.selected_difficulty;
            }
        }
    }
});

taWebsocket.taClient.on('userUpdated', async (e) => {    
    if (inMatch) {
    //Here we check if the user_id associated with the data recieved, is in matchData[>0<,0], and if it is, we continue.
        if (matchData[0] == e.data.user_id || matchData[1] == e.data.user_id) {
            //Here we send the json-string to the relay-server. This contains: Player ID, Score, Combo and Acc.
            sockets.send(JSON.stringify({'Type': '4','playerId': e.data.user_id,'score': e.data.score,'combo': e.data.combo,'acc':e.data.accuracy}));
            console.log(JSON.stringify({'Type': '4','playerId': e.data.user_id,'score': e.data.score,'combo': e.data.combo,'acc':e.data.accuracy}));
        }
    }
});
