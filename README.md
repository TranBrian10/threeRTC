# threeRTC

## Introduction
This project uses three.js and simplewebrtc to make a 3D game using real-time data from a mobile browser.

## Set Up
Clone the repo and ensure you have node.js installed.

Navigate to the ```client``` subdirectory.

Run ```npm install``` followed by ```npm run start```.

The page should be available at ```localhost:3000```.

Join the same room using a display device (ex. desktop browser) and a controller device (ex. mobile browser).

For linting, ```npm run lint```.

## Development
To render a game object immediately on page load, add the key ```test-canvas``` to the query string. For example, ```http://localhost:3000/?test-canvas```.

## Notes
This is currently using a development signaling server to facilitate the WebRTC connection. It will require a proper signaling server in the future (signalmaster).

The starting page and connection UI is handled by React, but it is not used in the game canvas or to handle game state.

The server subdirectory is not currently being used. It may be needed in the future for multiplayer features.
