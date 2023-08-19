import * as mongoose from 'mongoose';
import Deasyncify from 'deasyncify';
import Logger from '../logger';
interface DatabaseConnectArgs {
  url: string;
  /** Set too false to [disable buffering](http://mongoosejs.com/docs/faq.html#callback_never_executes) on all models associated with this connection. */
  bufferCommands?: boolean;
  /** The name of the database you want to use. If not provided, Mongoose uses the database name from connection string. */
  dbName?: string;
  /** username for authentication, equivalent to `options.auth.user`. Maintained for backwards compatibility. */
  user?: string;
  /** password for authentication, equivalent to `options.auth.password`. Maintained for backwards compatibility. */
  pass?: string;
  /** Set too false to disable automatic index creation for all models associated with this connection. */
  autoIndex?: boolean;
  /** Set to `true` to make Mongoose automatically call `createCollection()` on every model created on this connection. */
  autoCreate?: boolean;
}

export class Mongo {
  private static readonly logger = new Logger(Mongo.name);

  public static async connect(
    args: DatabaseConnectArgs,
  ): Promise<typeof import('mongoose') | null> {
    const { url, ...rest } = args;

    const [connection, err] = await Deasyncify.watch(
      mongoose.connect(url, { ...rest }),
    );

    if (err != null) {
      throw err;
    }

    this.logger.log('Successfully connected to mongo database');

    return connection;
  }

  public static async disconnect(): Promise<void> {
    return mongoose.disconnect();
  }
}
