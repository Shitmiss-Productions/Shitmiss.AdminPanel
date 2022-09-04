# Basic page that leeches off TA

## What's in the repo?

The repo contains 2 files to worry about: `index.js/ts` and `frontend/index.html`  

- `index.js/ts` contains the code to the relay server, and handles the actual TournamentAssistant-server connection.
- `frontend/index.html` & `frontend/song.js/ts` contains the frontend code to generate the overlay, and should be hosted on a webserver.

Index.html can be previewed by using the variables `?p1=[scoresaberID]&p2=[scoresaberID]`.
It's mostly used to make sure that style changes didn't mess it up.

## Deployment

Before you deploy the relay server, there's a few things to change:

You'll want to replace the following lines port numbers; `29`, `36` and `44` in `index.js/ts`, the ports I've used here are the same as @ThaNightHawk's relay server.

Start out by opening your terminal of choice, and navigate to the directory where `main.js/ts` is located.

Proceed to run:

```bash
  yarn
```

and then

```bash
  node index.js
  // or
  ts-node index.ts
```

If all goes well, you should see "Connected to relay server".

- `index.html` can be deployed on GitHub-pages or your own webserver. 

Add a browser source to OBS, with 1920x1080 dimensions, linking to **http**://IP_OR_URL/index.html  
(Do **not** use HTTPS, as it **will** refuse the connecting to a non-secured WebSocket Server.)
