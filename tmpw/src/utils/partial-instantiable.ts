export abstract class PartialInstantiable<T> {
  constructor(props?: Partial<T>) {
    Object.assign(this, props ?? {});
  }
}
