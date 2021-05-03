const { ApolloServer, gql, PubSub } = require("apollo-server");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { registrationResolvers } = require("./Modules/Registration/resolvers");
const { registrationTypeDefs } = require("./Modules/Registration/Typedef");
const { postResolvers } = require("./Modules/Post/resolvers");
const { postTypeDefs } = require("./Modules/Post/Typedef");
const { commentResolvers } = require("./Modules/Comments/resolvers");
const { commentTypeDefs } = require("./Modules/Comments/Typedef");

dotenv.config();
//MongoDB Connection
mongoose.connect(
    process.env.MONGODB_CONNECTION_STRING,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => {
        console.log("connected To DataBase");
    }
);
const root = gql`
    type Query {
        _: String
    }
    type Mutation {
        _: String
    }
    type Subscription {
        _: String!
    }
`;

const pubSub = new PubSub();
const server = new ApolloServer({
    cors: {
        origin: "*", // <- allow request from all domains
        credentials: true,
    },
    typeDefs: [root, registrationTypeDefs, postTypeDefs, commentTypeDefs],
    resolvers: [registrationResolvers, postResolvers, commentResolvers],
    context: ({ req, res }) => ({
        req,
        res,
        pubSub,
    }),
});

server.listen().then(({ url }) => console.log(`Server Started ${url}`));
