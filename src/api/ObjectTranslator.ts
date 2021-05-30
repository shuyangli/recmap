import { keys, reduce } from "lodash-es";

export class ObjectTranslator {
  constructor(private target: any) {}

  get(): any {
    return this.target;
  }

  objectToArray(field: string) {
    const override: any = {};
    if (this.target[field]) {
      override[field] = keys(this.target[field]);
    } else {
      override[field] = [];
    }
    this.target = { ...this.target, ...override };
    return this;
  }

  arrayToObject(field: string) {
    const override: any = {};
    if (this.target[field]) {
      const flatValues: string[] = this.target[field];
      override[field] = reduce(flatValues, (acc: any, val) => {
        acc[val] = true;
        return acc;
      }, {});
    } else {
      override[field] = {};
    }
    this.target = { ...this.target, ...override }
    return this;
  }

  ensureObjectPresence(field: string) {
    if (!this.target[field]) {
      this.target[field] = {};
    }
    return this;
  }
}
