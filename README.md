[![NPM](https://img.shields.io/npm/l/dree.svg)](https://github.com/euberdeveloper/mqtt-now/blob/master/LICENSE.md)

# mqtt-now
A node.js module which provides you a publisher and a subscriber, allowing you to easily run repetitive tasks. With Typescript support.

## Install

To install mqtt-now:

```bash
$ npm install mqtt-now
```

### Publish data

Simple:

```js
const mqttNow = require('mqtt-now');

const options = {
  host: 'localhost',
  interval: 1000,
  actions: [
    {
      topic: 'public',
      message: 'my message'
    },
    {
      topic: 'random',
      message: () => ( 'random ' + Math.random() )
    }
  ]
}

mqttNow.publish(options);
```

With Buffer:

```js
const mqttNow = require('mqtt-now');

const options = {
  host: 'localhost',
  interval: 1000,
  actions: [
    {
      topic: 'public',
      message: Buffer.alloc(10, 'my message')
    }
  ]
}

mqttNow.publish(options);
```

With Web Sockets:

```js
const { publish, Protocol } = require('mqtt-now');

const options = {
  type: Protocol.WS,
  host: 'localhost',
  interval: 1000,
  actions: [{ topic: 'public', message: 'my message' }]
}

publish(options);
```

With further configurations:

```js
const mqttNow = require('mqtt-now');

const options = {
  url: 'mqtt://localhost:3000',
  actions: [
    {
      topic: 'public',
      message: 'my message',
      onError: error => console.error('Error in public')
    },
    {
      topic: 'random',
      message: () => ( 'random ' + Math.random() ),
      interval: 100
    }
  ],
  interval: 1000,
  onError: error => console.error('Error in publishing', error)
}

mqttNow.publish(options);
```

### Subscribe and handle

Simple:

```js
const mqttNow = require('mqtt-now');

const options = {
  host: 'localhost',
  actions: [{ topic: 'public' }, { topic: 'random' }],
  onMessage: message => console.log('Message received ', message),
  messageType: mqttNow.MessageType.STRING
}

mqttNow.subscribe(options);
```

With Web Sockets:

```js
const { subscribe, Protocol, MessageType } = require('mqtt-now');

const options = {
  type: Protocol.WS,
  host: 'localhost',
  actions: [{ topic: 'public' }, { topic: 'random' }],
  onMessage: message => console.log('Message received ', message),
  messageType: MessageType.STRING
}

subscribe(options);
```

With further configurations:

```js
const mqttNow = require('mqtt-now');

const options = {
  protocol: 'mqtt',
  port: '1883',
  host: 'localhost',
  actions: [
    {
      topic: 'public',
      onError: error => console.error('Error in subscribing to "public" ', error)
    },
    {
      topic: 'random',
      onMessage: message => console.log('Random message received ', message)
    },
    {
      topic: 'buffer',
      messageType: mqttNow.MessageType.BUFFER,
      onMessage: message => console.log('This remains a buffer ', message)
    }
  ],
  messageType: mqttNow.MessageType.STRING,
  onMessage: message => console.log('Message received ', message),
  onError: error => console.error('Error in subscribing ', error)
}

mqttNow.subscribe(options);
```

## Result

Given this code:

```js
const mqttNow = require('mqtt-now');

const publishOptions = {
  host: 'localhost',
  actions: [
    {
      topic: 'public',
      message: 'my message',
      interval: 500
    },
    {
      topic: 'random',
      message: () => ( 'random ' + Math.random() )
    }
  ],
  interval: 1000
}

const subscribeOptions = {
  host: 'localhost',
  actions: [
    { topic: 'public' },
    {
      topic: 'random',
      onMessage: message => console.log('Random message received ', message)
    }
  ],
  messageType: mqttNow.MessageType.STRING,
  onMessage: message => console.log('Message received ', message)
}

mqttNow.publish(publishOptions);
mqttNow.subscribe(subscribeOptions);
```

Supposing that there is a mqtt instance running in localhost,

The console will result in this:

```
Message received  my message
Random message received  random 0.48166328598140296
Message received  my message
Message received  my message
Random message received  random 0.8821357744971647
Message received  my message
Message received  my message
Random message received  random 0.8432069519144318
Message received  my message
Message received  my message
Random message received  random 0.13065012342886484
..................................................
```

## API

### publish

**Syntax:**

`mqttNow.publish(options)`

**Description:**

This method publishes every a certain amount of time the data to the topics specified by the options. See __Usage__ to have an example.

**Parameters:**

* __options__: The options wich specifies which topics and which data have to be sent and which url these things will be sent to.

**Options parameters:**

* __type__: Default value: `Protocol.MQTT`. If not overwritten, the protocol and the port of the url will be determined by this property.
* __protocol__: Default value: `undefined`. Specifies the protocol to use in the url string. Note: overwrites the protocol specified by type property but is overwritten by url property.
* __host__: Default value: `localhost`. Specifies the host to use in the url string. Note: overwritten by url property.
* __port__: Default value: `undefined`. Specifies the port to use in the url string. Note: overwrites the port specified by type property but is overwritten by url property.
* __url__: Default value: `undefined`. Specifies the url used by the connection. Note: overwrites all the other properties that specify the url.
* __onError__: Default value: `error => {}`. Specifies what will be executed in case of an error. Note: overwritten by the more-specific onError option whether specified in a certain topic.
* __actions__: Default value: `[]`. The actions (topic and message) that you want to publish. See __MqttPublishAction__ to further information.
* __interval__: Default value: `1`. The time in milliseconds between every publication of a topic. Note: overwritten by the more-specific interval option whether specified in a certain topic.

**MqttPublishAction**

* __topic__: The topic that will be published.
* __message__: The message that will be published, as a string or a Buffer.
* __onError__: Optional. What will be executed in case of a publishing error. Note: overwrites the onError callback specified by the options.
* __interval__: Optional. The time in milliseconds between every publication of this topic. Note: overwrites the interval property specified by the options.

### subscribe

**Syntax:**

`mqttNow.subscribe(options)`

**Description:**

This method subscribes to the topics specified by the options and handle the received messages in the way specified by the options. See __Usage__ to have an example.

**Parameters:**

* __options__: The options wich specifies which topics are to be subscribed and which message handlers are to be executed and which url is to be listened.

**Options parameters:**

* __type__: Default value: `Protocol.MQTT`. If not overwritten, the protocol and the port of the url will be determined by this property.
* __protocol__: Default value: `undefined`. Specifies the protocol to use in the url string. Note: overwrites the protocol specified by type property but is overwritten by url property.
* __host__: Default value: `localhost`. Specifies the host to use in the url string. Note: overwritten by url property.
* __port__: Default value: `undefined`. Specifies the port to use in the url string. Note: overwrites the port specified by type property but is overwritten by url property.
* __url__: Default value: `undefined`. Specifies the url used by the connection. Note: overwrites all the other properties that specify the url.
* __onError__: Default value: `error => {}`. Specifies what will be executed in case of an error. Note: overwritten by the more-specific onError option whether specified in a certain topic.
* __actions__: Default value: `[]`. The actions that specifies wich topics you want to subscribe to and what to do with the received messages. See __MqttSubscribeAction__ to further information.
* __onMessage__: Default value: `message => {}`. What will be done with the received messages. Note: overwritten by the more-specific onMessage option whether specified in a certain topic.
* __messageType__: Default value: `MessageType.BUFFER`. The type of the message given as argument of onMessage callback. Note: overwritten by the more-specific messageType option whether specified in a certain topic.

**MqttSubscribeAction**

* __topic__: The topic that will be subscribed.
* __onMessage__: Optional. What will be done with the received message. Note: overwrites the onError callback specified by the options.
* __messageType__: Default value: `MessageType.BUFFER`. The type of the message given as argument of onMessage callback. Note: overwrites the messageType callback specified by the options.
* __onError__: Optional. What will be executed in case of a subscribing error. Note: overwrites the onError callback specified by the options.

## Note

Please notice that an mqtt instance have to run in your localhost in order to the above examples to work.

## Build

To build the module make sure you have Typescript installed or install the dev dependencies. After this, run:

```bash
$ npm run transpile
```

The `source` folder will be compiled in the `dist` folder.
