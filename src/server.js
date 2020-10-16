import { GraphQLServer } from "graphql-yoga";
import { createContext, EXPECTED_OPTIONS_KEY } from "dataloader-sequelize";

import { sequelize, typeDefs, resolvers } from "./schema";

import { resolver } from "graphql-sequelize";

resolver.contextToOptions = { [EXPECTED_OPTIONS_KEY]: EXPECTED_OPTIONS_KEY };

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context(req) {
    const dataloaderContext = createContext(sequelize);

    return {
      [EXPECTED_OPTIONS_KEY]: dataloaderContext,
    };
  },
});

export default server;
