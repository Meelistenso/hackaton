import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as util from 'util';
import { PubSub } from '@google-cloud/pubsub';

/** Maximum number of messages to queue locally un-acked */
const MAXMSG = 100;

/** Deadline for acknowledging messages */
const ACKDEAD = 30;

/** validate input **/
const TOPICNAME = 'projects/pubsub-public-data/topics/taxirides-realtime';

/** manufacture subscription name **/
const SUBNAME =
  process.env.USER +
  '-' +
  TOPICNAME.replace(/\//gi, '-') +
  '-' +
  crypto.randomUUID();

@Injectable()
export class PubSubService {
  private pubsub: PubSub;
  private SUB = undefined;

  constructor() {
    this.pubsub = new PubSub({
      keyFilename: './key.json',
    });
  }

  onApplicationShutdown() {
    const handleExit = () => {
      if (this.SUB) {
        this.SUB.delete(function (err) {
          if (err) {
            const error = util.inspect(err);
            console.error(
              `WARNING: could not delete subscription ${SUBNAME}: ${error}`,
            );
          }
        });
      }
    };

    process.on('exit', handleExit);
    process.on('SIGINT', handleExit);
    process.on('SIGTERM', handleExit);
  }

  subscribe(onMessage: (message) => void, onError?: (error) => void) {
    /** callback that registers event handlers **/
    const subCreationCallback = (err, sub) => {
      if (!err) {
        this.SUB = sub;
        this.SUB.on('message', (message) => {
          onMessage(JSON.parse(message.data.toString()));
          message.ack();
        });
        this.SUB.on('error', onError);
      } else {
        console.error(util.inspect(err));
        process.exit(1);
      }
    };

    const options = {
      flowControl: {
        maxMessages: MAXMSG,
      },
      ackDeadline: ACKDEAD,
    };

    /** create subscription, register callback **/
    this.pubsub.createSubscription(
      TOPICNAME,
      SUBNAME,
      options,
      subCreationCallback,
    );
  }
}
