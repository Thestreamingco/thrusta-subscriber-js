# Thrusta

## Publishing

To publish messages send HTTP POST request to `/pub` endpoint:

`curl --request POST --data 'message' https://thrusta.io/pub/{channel-name}` 

and substitute `{channel-name}` with your channel name. 

It's also possible to send content type metadata:

`curl --request POST --data '{"test": "value"}' -H 'Content-Type: application/json' https://thrusta.io/pub/{channel-name}`  

## Subscribing

For subscribing, we provide a js library that can use either long polling, server sent events or websocket.
To use the library instantiate the `ThrustaSubscriber` class:

```javascript
let url = 'https://thrusta.io/sub/{channel-name}'; // substitute {channel-name} with the name used to publish 
let sub = new ThrustaSubscriber(url, opt);
opt = {
  subscriber: 'longpoll', 'eventsource', or 'websocket',
    //or an array of the above indicating subscriber type preference
  reconnect: undefined or 'session' or 'persist'
    //if the HTML5 sessionStore or localStore should be used to resume
    //connections interrupted by a page load
  shared: true or undefined
    //share connection to same subscriber url between browser
    //windows and tabs using localStorage. In shared mode,
    //only 1 running subscriber is allowed per url per window/tab.
}

sub.on("transportSetup", function(opt, subscriberName) {
  // opt is a hash/object - not all transports support all options equally. Only longpoll supports arbitrary headers
  // subscriberName is a string
  //
  // longpoll transport supports:
  //   opt.longpoll.pollDelay - delay in milliseconds between successful requests
  // eventsource transport supports:
  //   opt.eventsource.withCredentials - boolean enabling the withCredentials CORS setting
});

sub.on("transportNativeCreated", function(nativeTransportObject, subscriberName) {
  // nativeTransportObject is the native transport object and depends on the subscriber type
  // subscriberName is a string
});

sub.on("transportNativeBeforeDestroy", function(nativeTransportObject, subscriberName) {
  // nativeTransportObject is the native transport object and depends on the subscriber type
  // subscriberName is a string
});

sub.on("message", function(message, message_metadata) {
  // message is a string
  // message_metadata may contain 'id' and 'content-type'
});

sub.on('connect', function(evt) {
  //fired when first connected.
});

sub.on('disconnect', function(evt) {
  // when disconnected.
});

sub.on('error', function(code, message) {
  //error callback
});

sub.reconnect; // should subscriber try to reconnect? true by default.
sub.reconnectTimeout; //how long to wait to reconnect? does not apply to EventSource, which reconnects on its own.
sub.lastMessageId; //last message id. useful for resuming a connection without loss or repetition.

sub.start(); // begin (or resume) subscribing
sub.stop(); // stop subscriber. do not reconnect.
```

## Build

Latest subscriber js library build is available in `dist` folder.

You may also build it from source using `npm run build` 