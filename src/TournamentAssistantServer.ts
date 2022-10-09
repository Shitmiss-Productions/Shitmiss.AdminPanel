import { Client } from "tournament-assistant-client";
import { WebSocket } from "ws";

let inMatch = false;

const client = new Client("Shitmiss City Admin Panel", {
    url: "tournamentassistant.net:2222",
});

const socket = new WebSocket("ws://localhost:2223");


// Blame anyone Hawk blames. I am just using this since it's convenient.
let port = 2223;
const wss = new WebSocket.Server({ "port": port });

wss.on("connection", function connection(ws) {
    ws.on("message", function message(data, isBinary) {
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data, {binary: isBinary });
            }
        });
    });
});

socket.onopen = function (event) {
    console.log("Connected to the relay!")
};


client.on("matchCreated", async (e) => {
    if (!inMatch) {
        e.data.associated_users.push(client.Self!.name);

    }
});

export {}