// Simple application file that initialized the web page (NOT TO BE USED WITH OBS AS A OVERLAY)
import { TAWebsocket } from "tournament-assistant-client";
import { WebSocket } from "ws";

let songData = ["", 0];
let matchData = ["", ""];
let inMatch = false;
let coordinator = "";

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

const taWebsocket = new TAWebsocket({
    url: "ws://ta.danesaber.cc:2053",
    name: "Dane Saber Overlay",
});

//Connect to the relay server we created above. - Make sure your frontend is connecting to THIS ip.
let sockets = new WebSocket("ws://localhost:2222");
//If the connection is opened successfully, we tell the user that.
sockets.onopen = function (event) {
    console.log("Connected to Relay server");
};

taWebsocket.taClient.on('matchCreated', async (e) => {
    //If the backend is not locked into a current match, we continue.
    if (!inMatch) {
        //Add this client as an associated user
        // e.data.associated_users.push(taWebsocket.taClient.Self);
        // taWebsocket.sendEvent(new taWebsocket.Packets.Event({
        //     match_updated_event: new taWebsocket.Packets.Event.MatchUpdatedEvent({ match: e.data })
        // }));

        for (var i = 0; i < e.data.associated_users.length; i++) {
            var findCoord = e.data.associated_users[i].name;
            if ((i + 2) == (e.data.associated_users.length)) {
                coordinator = findCoord;
            }
            if (e.data.associated_users[i].user_id !== "0") {
                matchData[i] = e.data.associated_users[i].user_id;

                console.log("Player " + [i + 1] + ": " + matchData[i] + " | " + e.data.associated_users[i].name);
            }
        }
        sockets.send(JSON.stringify({ 'Type': '1', 'userid': matchData, 'coordinator': coordinator, 'order': i }));
        inMatch = true;

        console.log("Match created, backend locked by coordinator " + coordinator);
    }
});

//This is triggered when a match is deleted.
taWebsocket.taClient.on('matchDeleted', async (e) => {
    //Here we check if the user_id associated with the data recieved, is in matchData[>0<,0], and if it is, we continue.
    if (matchData[0] == e.data.associated_users[0].user_id) {
        //Here we send the message to the frontend through the relay server
        sockets.send(JSON.stringify({ 'Type': '2' }));
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
                sockets.send(JSON.stringify({ 'Type': '3', 'LevelId': e.data.selected_level.level_id, 'Diff': e.data.selected_difficulty }));
                songData[1] = e.data.selected_level.level_id;
                songData[0] = e.data.selected_difficulty;
            }
        }
    }
});

taWebsocket.taClient.on('userUpdated', async (e) => {
    // if (inMatch) {
        //Here we check if the user_id associated with the data recieved, is in matchData[>0<,0], and if it is, we continue.
        // if (matchData[0] == e.data.user_id || matchData[1] == e.data.user_id) {
            //Here we send the json-string to the relay-server. This contains: Player ID, Score, Combo and Acc.
            sockets.send(JSON.stringify({ 'Type': '4', 'playerId': e.data.user_id, 'score': e.data.score, 'combo': e.data.combo, 'acc': e.data.accuracy }));
            console.log(JSON.stringify({ 'Type': '4', 'playerId': e.data.user_id, 'score': e.data.score, 'combo': e.data.combo, 'acc': e.data.accuracy }));
        // }
    // }
});