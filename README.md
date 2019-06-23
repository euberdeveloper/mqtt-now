[![NPM](https://img.shields.io/npm/l/dree.svg)](https://github.com/euberdeveloper/dree/blob/master/LICENSE.md)

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
  onMessage: message => console.log('Message received ', message)
}

mqttNow.subscribe(options);
```

With Web Sockets:

```js
const { subscribe, Protocol } = require('mqtt-now');

const options = {
  type: Protocol.WS,
  host: 'localhost',
  actions: [{ topic: 'public' }, { topic: 'random' }],
  onMessage: message => console.log('Message received ', message)
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
    }
  ],
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
