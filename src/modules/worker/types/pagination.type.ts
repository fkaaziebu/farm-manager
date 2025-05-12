import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Type } from "@nestjs/common";
import { PageInfo } from "src/database/types";

export function Paginated<T>(classRef: Type<T>): Type<any> {
  @ObjectType(`${classRef.name}Edge`)
  class EdgeType {
    @Field()
    cursor: string;

    @Field(() => classRef)
    node: T;
  }

  @ObjectType({ isAbstract: true })
  class PaginatedType {
    @Field(() => [EdgeType])
    edges: EdgeType[];

    @Field()
    pageInfo: PageInfo;

    @Field(() => Int)
    count: number;
  }

  return PaginatedType;
}
