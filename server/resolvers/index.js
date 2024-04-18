import fakeData from "../fakeData/index.js";
import { AuthorModel, FolderModel, NoteModel } from "../models/index.js";

export const resolvers = {
  //xử lý dữ liệu và trả về dữ liệu cho client dựa theo query
  Query: {
    folders: async (parent, args, context) => {
      const folders = await FolderModel.find({
        authorId: context.uid,
      });
      console.log({ folders, context });
      return folders;
    },
    folder: async (parent, args) => {
      const folderID = args.folderID;
      console.log({ folderID });
      const foundFolder = await FolderModel.findOne({
        _id: folderID,
      });
      return foundFolder;
    },
    // note: (parent, args) => {
    //   const noteID = args.noteID;
    //   return fakeData.notes.find((note) => note.id === noteID);
    // },
    note: async (parent, args) => {
      const noteID = args.noteID;
      console.log({ noteID });
      const foundnote = await NoteModel.findOne({
        _id: noteID,
      });
      return foundnote;
    },
  },
  Folder: {
    author: (parent, args) => {
      console.log({ parent, args });
      const authorId = parent.authorId;
      return fakeData.authors.find((author) => author.id === authorId);
      // return { id: 123, name: "huy" }
    },
    notes: (parent, args) => {
      return fakeData.notes.filter((note) => note.folderId === parent.id);
    },
  },

  Mutation: {
    addFolder: async (parent, args) => {
      const newFolder = new FolderModel({ ...args, authorId: "123" });
      console.log({ newFolder });
      await newFolder.save();
      return newFolder;
    },
    register: async (parent, args) => {
      const foundUser = await AuthorModel.findOne({ uid: args?.uid });

      if (!foundUser) {
        const newUser = new AuthorModel(args);
        await newUser.save();
        return newUser;
      }

      return foundUser;
    }
  },
};
