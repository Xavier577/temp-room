export type EventStore = {
  [event: string]: (...args: any[]) => any | Promise<any>;
};

export class PubSub {
  private readonly eventStore: EventStore = {};

  public get events() {
    return Object.keys(this.eventStore);
  }

  public publish(event: string, ...args: any[]): any | Promise<any> {
    if (this.eventStore[event] != null) {
      const callback = this.eventStore[event];

      return callback(...args);
    }
  }

  public subscribe(event: string, callback: (...args: any[]) => any) {
    this.eventStore[event] = callback;
  }

  public unsubscribe(event: string) {
    if (this.eventStore[event] != null) {
      delete this.eventStore[event];
    }
  }
}
