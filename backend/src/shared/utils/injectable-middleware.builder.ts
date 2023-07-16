import { NextFunction, Request, Response } from 'express';

class MiddlewareContext {
  private readonly deps: { [name: string]: any } = {};

  private req: Request;
  private res: Response;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private _next: NextFunction = () => {};

  public getDep<T = any>(depToken: string | (new (...args: any[]) => T)): T {
    if (typeof depToken === 'string') {
      return this.deps?.[depToken];
    }

    return this.deps?.[depToken.name];
  }

  public recordDep(depToken: string, dep: any) {
    this.deps[depToken] = dep;
  }

  public setCtx(req: Request, res: Response, next: NextFunction) {
    this.req = req;
    this.res = res;
    this._next = next;
  }

  public getRequest() {
    return this.req;
  }

  public getResponse() {
    return this.res;
  }

  public next(err?: any): void;
  public next(deferToNext: 'router'): void;
  public next(args: any | 'router'): void {
    return this._next(args);
  }
}

export default class InjectableMiddlewareBuilder {
  private readonly deps: { [name: string]: any } = {};
  constructor(...args: any[]) {
    for (const arg of args) {
      Object.assign(this.deps, { [arg.constructor.name]: arg });
    }
  }

  public configure(
    middlewareDefinition: (ctx: MiddlewareContext) => void | Promise<void>,
  ) {
    const middlewareCtx = new MiddlewareContext();
    for (const dep in this.deps) {
      middlewareCtx.recordDep(dep, this.deps[dep]);
    }
    return (req: Request, res: Response, next: NextFunction) => {
      middlewareCtx.setCtx(req, res, next);
      const p = middlewareDefinition(middlewareCtx);

      if (p instanceof Promise) {
        Promise.resolve(p).catch(next);
      }
    };
  }
}
