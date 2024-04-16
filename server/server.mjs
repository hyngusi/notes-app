import express, { query } from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import bodyParser from 'body-parser';
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors'
import fakeData from './fakeData/index.mjs';
import { argv } from 'process';

const app = express();
const httpServer = http.createServer(app);

const typeDefs = `#graphql
    type Folder { 
        id:String,
        name:String,
        createdAt:String,
        author: Author,
        notes: [Note]
    }

    type Note {
        id: String,
        content: String
    }

    type Author {
        id:String,
        name:String
    }

    type Query {
        folders: [Folder],
        folder(folderID: String): Folder,
        note(noteId: String): Note,
    }
`;
const resolvers = {  //xử lý dữ liệu và trả về dữ liệu cho client dựa theo query 
    Query: {
        folders: () => {
            return fakeData.folders
        },
        folder: (parent, args) => {
            const folderID = args.folderID;
            return fakeData.folders.find(folder => folder.id === folderID)
        }, note: (parent, args) => {
            const noteId = args.noteId;
            return fakeData.notes.find(note => note.id === noteId);
        },
    },
    Folder: {
        author: (parent, args) => {
            console.log({ parent, args });
            const authorId = parent.authorId;
            return fakeData.authors.find(author => author.id === authorId);
            // return { id: 123, name: "huy" }
        },
        notes: (parent, args) => {
            return fakeData.notes.filter(note => note.folderId === parent.id);
        }
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