import { PrismaService } from '@database/prisma.service';
import { DMMFClass } from '@prisma/client/runtime';
import { ResourceOptions, ResourceWithOptions } from 'adminjs';

export class AdminResource {
  model: any;
  options: ResourceOptions;

  constructor(model: any, options?: ResourceOptions) {
    this.model = model;
    this.options = options || {};
  }
}

export default class AdminResourceBuilder {
  private readonly resources: Array<AdminResource> = [];
  dmmf: DMMFClass;

  constructor(private readonly prisma: PrismaService) {
    this.dmmf = (prisma as any)._baseDmmf as DMMFClass;
  }

  public addResource(resource: string, options?: ResourceOptions): this {
    const obj = new AdminResource(this.dmmf.modelMap[resource], options);
    this.resources.push(obj);
    return this;
  }

  public build(): Array<ResourceWithOptions | any> {
    return this.resources.map((resource) => {
      return {
        resource: {
          model: resource.model,
          client: this.prisma,
        },
        options: resource.options,
      };
    });
  }
}
