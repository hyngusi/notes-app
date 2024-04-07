import express, { query } from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors'
import fakeData from './fakeData/index.mjs';

const app = express();
const httpServer = http.createServer(app);

const typeDefs = `#graphql
    type Folder { 
        id:String,
        name:String,
        createdAt:String,
        author: Author
    }

    type Author {
        id:String,
        name:String
    }

    type Query {
        folders: [Folder],

    }
`;
const resolvers = {  //xử lý dữ liệu và trả về dữ liệu cho client dựa theo query 
    Query: {
        folders: () => { return fakeData.folders }
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});

await server.start();

app.use(cors(), bodyParser.json(), expressMiddleware(server));

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`Server ready at http://localhost:4000`)