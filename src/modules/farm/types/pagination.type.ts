import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Type } from "@nestjs/common";

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

@ObjectType()
export class PageInfo {
  @Field({ nullable: true })
  startCursor?: string;

  @Field({ nullable: true })
  endCursor?: string;

  @Field()
  hasNextPage: boolean;

  @Field()
  hasPreviousPage: boolean;
}
