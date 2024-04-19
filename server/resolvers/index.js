import fakeData from "../fakeData/index.js";
import NotificationModel from "../models/NotificationModel.js";
import { GraphQLScalarType } from "graphql";
import { AuthorModel, FolderModel, NoteModel } from "../models/index.js";
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export const resolvers = {
  Date: new GraphQLScalarType({
    name: "Date",
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.toISOString();
    },
  }),
  //xử lý dữ liệu và trả về dữ liệu cho client dựa theo query
  Query: {
    folders: async (parent, args, context) => {
      const folders = await FolderModel.find({
        authorId: context.uid,
      }) // Sắp xếp lại folder, đưa folder mới tạo lên đầu
        .sort({
          updatedAt: "desc",
        });
      console.log({ folders, context });
      return folders;
    },
    folder: async (parent, args) => {
      const folderID = args.folderID;
      console.log(folderID);
      const foundFolder = await FolderModel.findById(folderID);
      return foundFolder;
    },
    // note: (parent, args) => {
    //   const noteID = args.noteID;
    //   return fakeData.notes.find((note) => note.id === noteID);
    // },
    note: async (parent, args) => {
      const noteId = args.noteId;
      const note = await NoteModel.findById(noteId);
      console.log(note);
      return note;
    },
  },
  Folder: {
    author: async (parent, args) => {
      const authorId = parent.authorId;
      const author = await AuthorModel.findOne({
        uid: authorId,
      });
      return author;
      // return { id: 123, name: "huy" }
    },
    notes: async (parent, args) => {
      const notes = await NoteModel.find({
        folderId: parent.id,
      }).sort({
        updatedAt: "desc",
      });
      console.log({ notes });
      return notes;
    },
  },
  Mutation: {
    addNote: async (parent, args) => {
      const newNote = new NoteModel(args);
      await newNote.save();
      return newNote;
    },

    updateNote: async (parent, args) => {
      const noteId = args.id;
      const note = await NoteModel.findByIdAndUpdate(noteId, args);
      return note;
    },

    addFolder: async (parent, args, context) => {
      const newFolder = new FolderModel({ ...args, authorId: context["uid"] });
      console.log({ newFolder });
      pubsub.publish('FOLDER_CREATED', {
        folderCreated: {
          message: 'A new folder created'
        }
      })
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
    },
    pushNotification: async (parent, args) => {
      const newNotification = new NotificationModel(args);

      pubsub.publish('PUSH_NOTIFICATION', {
        notification: {
          message: args.content
        },
      });

      await newNotification.save();
      return { message: "Notification sent" };
    }
  },
  Subscription: {
    folderCreated: {
      subscribe: () => pubsub.asyncIterator(['FOLDER_CREATED', 'NOTE_CREATED'])
    },
    notification: {
      subscribe: () => pubsub.asyncIterator('PUSH_NOTIFICATION')
    }
  }
};
