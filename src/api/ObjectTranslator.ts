import * as _ from 'lodash';

export class ObjectTranslator {
  constructor(
    private target: any
  ) {}

  get(): any {
    return this.target;
  }

  objectToArray(field: string) {
    let override: any = {};
    if (this.target[field]) {
      override[field] = _.keys(this.target[field]);
    } else {
      override[field] = [];
    }
    this.target = _.assign({}, this.target, override);
    return this;
  }

  arrayToObject(field: string) {
    let override: any = {};
    if (this.target[field]) {
      const flatValues: string[] = this.target[field];
      override[field] = _.reduce(flatValues, (acc: any, val) => {
        acc[val] = true;
        return acc;
      }, {});
    } else {
      override[field] = {};
    }
    this.target = _.assign({}, this.target, override);
    return this;
  }
}
