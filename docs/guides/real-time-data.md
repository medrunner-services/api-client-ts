# Real time data guide

## Introduction

To share real-time data from the Medrunner API, we use the WebSocket protocol and the [signalr library](https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction?view=aspnetcore-8.0) from Microsoft. The Medrunner API provides a WebSocket endpoint that you can connect to and listen for different events.

## Connect to the WebSocket

The easiest way to connect to the WebSocket is to use the TypeScript client that will interface with the signalr library. The client will handle the connection for you, here is how you can initialize the WebSocket connection:

```ts
const ws = await api.websocket.initialize();
await ws.start();
```

The authentication is handled by the client you initialized previously. The start method will connect to the WebSocket endpoint and start listening for events.

You can now use all the methods provided by the signalr library like `on`, `state` or `onreconnected` for exemple.

```ts
console.log(ws.state); // HubConnectionState.Connected
```

## Listen for events

The Medrunner API provides different events that you can listen to. Here is an example of how to listen to the `PersonUpdate` event:

```ts
ws.on("PersonUpdate", (newUser: Person) => {
  console.log(newUser);
});
```

You can also use signalr methods like `onreconnected` or `onclose` for exemple to handle all states:

```ts
ws.onreconnected(async () => {
  console.log("Reconnected to the WebSocket");
});

ws.onclose(async () => {
  console.log("Connection has been lost");
});
```

Take a look at the [signalr documentation](https://learn.microsoft.com/en-us/aspnet/core/signalr/introduction?view=aspnetcore-8.0) to discover all the features.

## List of available events

You can find a complete list of available events in the [WebSocket events reference](/reference/websockets-events).
