<img src="https://raw.githubusercontent.com/schlangguru/clip-beam-client/master/public/img/logo.svg" alt="clip-beam logo" title="Clip Beam" align="right" height="50" />

# Clip Beam Signaling Server

This is the signaling server of Clip Beam. To get an overview of the application visit the [client](https://github.com/schlangguru/clip-beam-client) repo.

The signaling server is responsible to initiate the WebRTC connection for Clip Beam.

![Clip Beam](https://raw.githubusercontent.com/schlangguru/clip-beam-client/master/assets/demo.png)

## Table of content

- [Signaling Server](#setup-the-signaling-server)
  - [Setup](#setup)
  - [Configuration](#configuration)
- [Client](#setup-the-client)

## Setup the signaling server

The server is written in typescript and requires Node.js to run. It uses websockets for signaling.

### Setup

Clone this repository and use the following commands:

```bash
# install dependencies
npm install
# run locally in watch mode
npm run dev
# build for the distribution
npm run build
# start the built server
npm run start
```

### Configuration

Per default the signaling server listens on port `9090`. To change this you can set an environment variable named `PORT`.

```bash
# Eg. to run the server on port `8081` run:
export PORT=8081 && npm run start
```

If you change the port or url of the signaling server remember to [configure the client](https://github.com/schlangguru/clip-beam-client#client-configuration) accordingly.

## Setup the client

See installation instructions for the [client](https://github.com/schlangguru/clip-beam-client#setup-the-client)
