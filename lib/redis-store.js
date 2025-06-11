const { resolve } = require("path");
const { readFileSync } = require("jsonfile");
const { createClient } = require("redis");
const { existsSync } = require("fs");
const { isEmpty, isArray, isString } = require("lodash");
const credential_dir = process.env.credential_dir || "/etc/drumee/credential";

let instance = process.env.instance_name || "";

let redisConfFile = resolve(credential_dir, instance, "redis-config.json");
let defaultConfFile = "/etc/drumee/credential/redis.json";
let fallbackConfFile = "/etc/drumee/infrastructure/redis-config.json";

let conf = {};
if (existsSync(redisConfFile)) {
  conf = readFileSync(redisConfFile);
} else if (existsSync(defaultConfFile)) {
  conf = readFileSync(defaultConfFile);
  redisConfFile = defaultConfFile;
} else if (existsSync(fallbackConfFile)) {
  conf = readFileSync(fallbackConfFile);
  redisConfFile = redisConfFile;
}

let redisServerConf = {
  redisHost: "localhost",
  redisPort: 6379,
  redisAuth: null,
  liveUpdateChannel: "LIVE_UPDATE_CHANNEL",
  ...conf,
};

let {
  redisPort, redisHost, redisUrl, liveUpdateChannel
} = redisServerConf;

let onError = function (error) {
  console.error("Error in Redis client: " + error.message);
  console.error(error.stack);
  console.log("Exiting now because of error in Redis client");
};

let onConnect = function () {
  console.log("Successfully connected to Redis " + redisHost + ":" + redisPort);
};

class RedisStore {
  redisClient;
  subscribers = [];
  inited = false;

  constructor() {
    if (RedisStore._instance) {
      return RedisStore._instance;
    }
    return (RedisStore._instance = this);
  }

  /**
   * Singleton Client
   * @returns
   */
  static getClient() {
    return RedisStore._instance.redisClient;
  }

  /**
   * Singleton publisher
   * @returns
   */
  static GetPublisher() {
    return RedisStore._instance.publisher;
  }

  /**
   *
   * @returns
   */
  static getLiveUpdateChannel() {
    let self = RedisStore._instance;
    let channel = self.channel;
    return channel;
  }

  /**
   *
   * @param {*} key
   * @param {*} data
   * @returns
   */
  static async publishLiveUpdate(key, data) {
    let self = RedisStore._instance;
    return await self.publisher.publish(
      self.channel,
      JSON.stringify({ key, data })
    );
  }

  /**
   *
   * @param {*} payload
   * @param {*} dest
   * @returns
   */
  static async sendData(payload, dest) {
    if (!dest) {
      dest = { ...payload.dest };
    }
    delete payload.dest;
    if (isEmpty(dest)) return;

    let publisher = RedisStore.GetPublisher();
    let channel = RedisStore.getLiveUpdateChannel();

    if (isArray(dest)) {
      for (let d of dest) {
        let msg = null;
        if (isEmpty(d)) continue;
        if (!d.socket_id && !d.socket_id) continue;
        try {
          msg = JSON.stringify({
            source: global.endpointAddress,
            dest: d,
            payload,
          });
        } catch (e) {
          console.error("EEE:109 -- Failed to sendData", e);
          continue;
        }
        //i.publisher.publish(i.channel, msg);
        await publisher.publish(channel, msg);

      }
      return;
    }

    if (isString(dest)) dest = { socket_id: dest };

    let msg = null;
    try {
      msg = JSON.stringify({
        source: global.endpointAddress,
        dest,
        payload,
      });
    } catch (e) {
      console.error("ERROR[147] Failed to sendData", e);
      return;
    }

    return publisher.publish(channel, msg);
  }

  /**
   * Subscriber will return every timer a new instance
   * @returns subscriber
   */
  static async getSubscribe() {
    let self = RedisStore._instance;
    const subscriber = self.redisClient.duplicate();
    await subscriber.connect();
    self.subscribers.push(subscriber);
    return subscriber;
  }


  /**
   *
   * @returns
   */
  async init() {
    let self = RedisStore._instance;
    this.channel = liveUpdateChannel || "LIVE_UPDATE_CHANNEL";
    if (this.inited) {
      return;
    }

    let url = redisUrl || `redis://${redisHost}:${redisPort}`;

    let redisClient = createClient({
      url: url,
    });
    redisClient.on("error", onError);
    redisClient.on("connect", onConnect);
    await redisClient.connect();
    self.redisClient = redisClient;
    self.publisher = self.redisClient.duplicate();
    await self.publisher.connect();
    self.inited = true;
    return RedisStore;
  }
}

module.exports = RedisStore;
