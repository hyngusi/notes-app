import mongoose, { model } from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
    },
    folderId: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const NoteModel = mongoose.model("Note", noteSchema);

export default NoteModel;
