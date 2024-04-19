import express, { query } from "express";
import http from "http";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import bodyParser from "body-parser";
import { expressMiddleware } from "@apollo/server/express4";
import cors from "cors";
import mongoose from "mongoose";
import { makeExecutableSchema } from '@graphql-tools/schema';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import "dotenv/config";
import "./firebaseConfig.js";
import { getAuth } from "firebase-admin/auth";
import { resolvers } from "./resolvers/index.js";
import { typeDefs } from "./schemas/index.js";

const app = express();
const httpServer = http.createServer(app);

const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.aoekngu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const PORT = process.env.PORT || 4000;

const schema = makeExecutableSchema({ typeDefs, resolvers });

const server = new ApolloServer({
    // typeDefs,
    // resolvers,
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
        async serverWillStart() {
            return {
                async drainServer() {
                    await serverCleanup.dispose();
                },
            };
        },
    },],
});

// Creating the WebSocket server
const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: '/graphql',
});

// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = useServer({ schema }, wsServer);



mongoose
    .connect(URI, {
        useNewURLParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        console.log("connected to DB ");
        await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
        console.log(`Server ready at http://localhost:4000`);
    });

await server.start();

const authorizatonJWT = async (req, res, next) => {
    // console.log({ authorization: req.headers["authorization"] });
    const authorizationHeader = req.headers["authorization"];

    if (authorizationHeader) {
        const accessToken = authorizationHeader.split(" ")[1];

        getAuth()
            .verifyIdToken(accessToken)
            .then((decodedToken) => {
                // console.log({ decodedToken });
                res.locals.uid = decodedToken.uid;
                next();
            })
            .catch((err) => {
                console.log({ err });
                return res.status(403).json({ message: "Forbidden", error: err });
            });
    } else {
        next();
        // return res.status(401).json({ message: "Unauthorized" });
    }
};

app.use(
    cors(),
    authorizatonJWT,
    bodyParser.json(),
    expressMiddleware(server, {
        context: async ({ req, res }) => {
            console.log({ uid: res.locals.uid });
            return { uid: res.locals.uid };
        },
    })
);
