import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './graphql/schemas';
import { resolvers } from './graphql/resolvers';
import { connectDB } from './db/client';

// Connect to PostgreSQL
connectDB();

// Apollo Server setup
const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, {
    listen: { port: 4000 },
}).then(({ url }) => {
    console.log(`🚀  Server ready at: ${url}`);
}).catch((err) => {
    console.error('Failed to start server:', err);
});
