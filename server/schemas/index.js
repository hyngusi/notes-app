export const typeDefs = `#graphql
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
        note(noteID: String): Note
    }
    

    type Mutation{
        addFolder(name: String!): Folder
    }

`;