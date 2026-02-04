import { ApolloDriver } from '@nestjs/apollo';
import { GqlModuleOptions } from '@nestjs/graphql';

export async function getGraphQLConfig(): Promise<GqlModuleOptions> {
  return {
    driver: ApolloDriver,
    autoSchemaFile: true,
    sortSchema: true,
  };
}
