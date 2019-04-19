# Thrusta

## Publishing

To publish messages send HTTP POST request to `/pub` endpoint:

`curl --request POST --data 'message' https://thrusta.io/pub/{channel-name}` 

and substitute `{channel-name}` with your channel name. 

It's also possible to send content type metadata:

`curl --request POST --data '{"test": "value"}' -H 'Content-Type: application/json' https://thrusta.io/pub/{channel-name}`  

## Subscribing

For subscribing, we provide a js library that can use either `long polling`, `server sent events` or `websocket`.

Latest subscriber js library build is available in `dist` folder.

To use the library instantiate the `ThrustaSubscriber` class providing the channel name and options object:

```javascript 
let ch = 'channel-name';
let sub = new ThrustaSubscriber(ch, opt);
```

Following options are available:

```javascript
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
```

Additional options are also available:

```javascript
sub.reconnect; // should subscriber try to reconnect? true by default.
sub.reconnectTimeout; //how long to wait to reconnect? does not apply to EventSource, which reconnects on its own.
sub.lastMessageId; //last message id. useful for resuming a connection without loss or repetition.
```

The subscriber object emits several events which you can subscribe to using the `on` method.  

The most important event is `message` fired when new message comes in:

```javascript
sub.on("message", function(message, message_metadata) {
  // message is a string
  // message_metadata may contain 'id' and 'content-type'
});
```

And there are few technical events:

```javascript
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

sub.on('connect', function(evt) {
  //fired when first connected.
});

sub.on('disconnect', function(evt) {
  // when disconnected.
});

sub.on('error', function(code, message) {
  //error callback
});
```

Once you have the subscriber object set up call the `start` method to start listening for messages.
You may also stop listeneing using the `stop` method. 

```
sub.start(); // begin (or resume) subscribing
sub.stop(); // stop subscriber. do not reconnect.
```