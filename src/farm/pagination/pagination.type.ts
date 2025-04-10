import { Field, ObjectType, Int, InputType } from "@nestjs/graphql";
import { Type } from "@nestjs/common";

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

// Factory function to create a paginated result type for a specific entity
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

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true })
  first?: number;

  @Field(() => String, { nullable: true })
  after?: string;

  @Field(() => Int, { nullable: true })
  last?: number;

  @Field(() => String, { nullable: true })
  before?: string;
}

@InputType()
export class SortInput {
  @Field()
  field: string;

  @Field()
  direction: "ASC" | "DESC";
}
