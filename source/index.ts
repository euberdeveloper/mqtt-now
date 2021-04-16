import { connect } from 'mqtt';

/* TYPES */

/**
 * The interface contains the details (protocol name and port) of a protocol.
 */
interface ProtocolDetails {
    protocol: string;
    port: number;
}

/**
 * The interface contains generic options, such as the ones that handle
 * the url and the one to handle the error.
 */
interface MqttOptions {
    /**
     * If not overwritten, the protocol and the port will be determined by this property.
     */
    type?: Protocol;
    /**
     * Specifies the protocol to use in the url string.
     * Note: overwrites the protocol specified by type property but is overwritten by url property.
     */
    protocol?: string;
    /**
     * Specifies the host to use in the url string.
     * Note: overwritten by url property.
     */
    host?: string;
    /**
     * Specifies the port to use in the url string.
     * Note: overwrites the port specified by type property but is overwritten by url property.
     */
    port?: number;
    /**
     * Specifies the url used by the connection.
     * Note: overwrites all the other properties that specify the url.
     */
    url?: string;
    /**
     * Specifies what will be executed in case of an error.
     * Note: overwritten by the more-specific onError option whether specified in a certain topic.
     */
    onError?: (error: Error) => void;
}

/**
 * Enumeration of available protocols.
 */
export enum Protocol {
    MQTT,
    WS
}

/**
 * Enumeration of available message's types.
 */
export enum MessageType {
    BUFFER,
    STRING
}

/**
 * The type of the publisher object returned by the getPublisher function
 */
export type Publisher = (topics?: string | string[], data?: any) => void;

/**
 * The interface contains the action of a topic when published.
 */
export interface MqttPublishAction {
    /**
     * The topic that will be published.
     */
    topic: string;
    /**
     * The message that will be published.
     */
    message: (string | Buffer) | (() => string | Buffer);
    /**
     * What will be executed in case of a publishing error.
     * Note: overwrites the onError callback specified by the options.
     */
    onError?: (error: Error) => void;
    /**
     * The time in milliseconds between every publication of this topic.
     * Note: overwrites the interval property specified by the options.
     */
    interval?: number;
}

/**
 * The interface contains the options of the publish function.
 */
export interface MqttPublishOptions extends MqttOptions {
    /**
     * The actions (topic and message) that you want to publish.
     */
    actions?: MqttPublishAction[];
    /**
     * The time in milliseconds between every publication of a topic.
     * Note: overwritten by the more-specific interval option whether specified in a certain topic.
     */
    interval?: number;
}

/**
 * The interface contains the properties of a topic when received.
 */
export interface MqttSubscribeAction {
    /**
     * The topic that will be subscribed.
     */
    topic: string;
    /**
     * What will be done with the received message.
     * Note: overwrites the onMessage callback specified by the options.
     */
    onMessage?: (message: string | Buffer) => void;
    /**
     * The type of the message given as argument of onMessage callback.
     * Default: BUFFER.
     * Note: overwrites the messageType callback specified by the options.
     */
    messageType?: MessageType;
    /**
     * What will be executed in case of a subscribing error.
     * Note: overwrites the onError callback specified by the options.
     */
    onError?: (error: Error) => void;
}

/**
 * The interface contians the options of the subscribe function.
 */
export interface MqttSubscribeOptions extends MqttOptions {
    /**
     * The actions that specifies which topics you want to subscribe to and what to do
     * with the received messages.
     */
    actions?: MqttSubscribeAction[];
    /**
     * What will be done with the received messages.
     * Note: overwritten by the more-specific onMessage option whether specified in a certain topic.
     */
    onMessage?: (message: string | Buffer) => void;
    /**
     * The type of the message given as parameter of onMessage callback.
     * Default: BUFFER.
     * Note: overwritten by the more-specific messageType option whether specified in a certain topic.
     */
    messageType?: MessageType;
}

/**
 * The interface contains the action of a topic when published by a publisher.
 */
export interface MqttPublisherAction {
    /**
     * The topic that will be published.
     */
    topic: string;
    /**
     * The message that will be published. It can be a constant value or a function that returns the value.
     * In case it is a function, the function can use the data passed as the second argument when publisher is called.
     */
    message: (string | Buffer) | ((data?: any) => string | Buffer);
    /**
     * What will be executed in case of a publishing error.
     * Note: overwrites the onError callback specified by the options.
     */
    onError?: (error: Error) => void;
}

/**
 * The interface contains the options of the getPublisher function.
 */
export interface MqttPublisherOptions extends MqttOptions {
    /**
     * The actions (topic and message) that you want to publish.
     */
    actions?: MqttPublisherAction[];
}

/* DEFAULT OPTIONS */

const MQTT_PROTOCOL: ProtocolDetails = {
    protocol: 'mqtt',
    port: 1883
};
const WS_PROTOCOL: ProtocolDetails = {
    protocol: 'ws',
    port: 9001
};

const PUBLISH_DEFAULT_OPTIONS: MqttPublishOptions = {
    type: Protocol.MQTT,
    protocol: undefined,
    host: 'localhost',
    port: undefined,
    url: undefined,
    actions: [],
    interval: 1000,
    onError: _ => {}
};

const SUBSCRIBE_DEFAULT_OPTIONS: MqttSubscribeOptions = {
    type: Protocol.MQTT,
    protocol: undefined,
    host: 'localhost',
    port: undefined,
    url: undefined,
    actions: [],
    onError: _ => {},
    onMessage: _ => {},
    messageType: MessageType.BUFFER
};

const PUBLISHER_DEFAULT_OPTIONS: MqttPublisherOptions = {
    type: Protocol.MQTT,
    protocol: undefined,
    host: 'localhost',
    port: undefined,
    url: undefined,
    actions: [],
    onError: _ => {}
};

/* SUPPORT FUNCTIONS */

function mergePublishOptions(options?: MqttPublishOptions): MqttPublishOptions {
    let result: MqttPublishOptions = {};
    if (options) {
        for (const key in PUBLISH_DEFAULT_OPTIONS) {
            result[key] = options[key] !== undefined ? options[key] : PUBLISH_DEFAULT_OPTIONS[key];
        }
        if (result.interval < 0) {
            result.interval = 1;
        }
    } else {
        result = PUBLISH_DEFAULT_OPTIONS;
    }
    return result;
}

function mergeSubscribeOptions(options?: MqttSubscribeOptions): MqttSubscribeOptions {
    let result: MqttSubscribeOptions = {};
    if (options) {
        for (const key in SUBSCRIBE_DEFAULT_OPTIONS) {
            result[key] = options[key] !== undefined ? options[key] : SUBSCRIBE_DEFAULT_OPTIONS[key];
        }
    } else {
        result = SUBSCRIBE_DEFAULT_OPTIONS;
    }
    return result;
}

function mergePublisherOptions(options?: MqttPublisherOptions): MqttPublisherOptions {
    let result: MqttPublisherOptions = {};
    if (options) {
        for (const key in PUBLISHER_DEFAULT_OPTIONS) {
            result[key] = options[key] !== undefined ? options[key] : PUBLISHER_DEFAULT_OPTIONS[key];
        }
    } else {
        result = PUBLISHER_DEFAULT_OPTIONS;
    }
    return result;
}

function getProtocolDetails(protocol: Protocol): ProtocolDetails {
    switch (protocol) {
        case Protocol.MQTT:
            return MQTT_PROTOCOL;
        case Protocol.WS:
            return WS_PROTOCOL;
        default:
            return null;
    }
}

function getUrlFromOptions(options: MqttOptions): string {
    let url: string;
    if (options.url) {
        url = options.url;
    } else {
        const fallback = getProtocolDetails(options.type);
        const protocol = options.protocol || fallback.protocol;
        const host = options.host;
        const port = options.port || fallback.port;
        url = `${protocol}://${host}:${port}`;
    }
    return url;
}

function getMessage(message: (string | Buffer) | ((data?: any) => string | Buffer), data?: any): string | Buffer {
    if (typeof message === 'string' || message instanceof Buffer) {
        return message;
    } else {
        return message(data);
    }
}

function getPayload(payload: Buffer, type: MessageType): string | Buffer {
    switch (type) {
        case MessageType.BUFFER:
            return payload;
        case MessageType.STRING:
            return payload.toString();
    }
}

/* EXPORTED FUNCTIONS */

/**
 * This function publishes every a certain amount of time the data to the topics specified by
 * the options.
 * @param options The options which specifies which topics and which data have to be sent and
 * which url these things will be sent to.
 */
export function publish(options: MqttPublishOptions): void {
    const opt = mergePublishOptions(options);
    const url = getUrlFromOptions(opt);
    const client = connect(url);
    client.on('connect', () => {
        opt.actions.forEach(({ topic, message, onError, interval }) => {
            setInterval(
                () => {
                    client.publish(topic, getMessage(message), error => {
                        if (error) {
                            (onError || opt.onError)(error);
                        }
                    });
                },
                interval !== undefined ? interval : opt.interval
            );
        });
    });
}

/**
 * This function subscribes to the topics specified by the options and handle the received messages
 * in the way specified by the options.
 * @param options The options which specifies which topics are to be subscribed and which message handlers
 * are to be executed and which url is to be listened.
 */
export function subscribe(options: MqttSubscribeOptions): void {
    const opt = mergeSubscribeOptions(options);
    const url = getUrlFromOptions(opt);
    const client = connect(url);
    client.on('connect', () => {
        opt.actions.forEach(({ topic, onMessage: _, onError }) => {
            client.subscribe(topic, error => {
                if (error) {
                    (onError || opt.onError)(error);
                }
            });
        });
        client.on('message', (topic, payload) => {
            const action = opt.actions.find(action => action.topic === topic);
            if (action) {
                (action.onMessage || opt.onMessage)(getPayload(payload, action.messageType || opt.messageType));
            }
        });
    });
}

/**
 * This function returns a promise with a Publisher, which is a function that takes a list of topics and in case some data as
 * arguments and when is called publishes everything is specified in the options given to this function.
 * In the returned function: If no topic or an  empty string is passed, it publishes all the topics. Also, in case data is passed
 * as second argument, it will passed as the argument of each function that generates the message for a topic.
 * @param options The options which specifies which topics and which data have to be sent and
 * which url these things will be sent to.
 */
export async function getPublisher(options: MqttPublisherOptions): Promise<Publisher> {
    return new Promise((resolve, _reject) => {
        const opt = mergePublisherOptions(options);
        const url = getUrlFromOptions(opt);
        const client = connect(url);
        client.on('connect', () => {
            resolve((topics?: string | string[], data?: any) => {
                topics = typeof topics === 'string' && topics !== '' ? [topics] : topics;
                opt.actions.forEach(({ topic, message, onError }) => {
                    if (!topics || topics.includes(topic)) {
                        client.publish(topic, getMessage(message, data), error => {
                            if (error) {
                                (onError || opt.onError)(error);
                            }
                        });
                    }
                });
            });
        });
    });
}
