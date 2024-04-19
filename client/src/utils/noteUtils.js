import { GraphQLRequest } from "./request";

export const notesLoader = async ({ params: { folderId } }) => {
  const query = `query Folder($folderId: String!) {
        folder(folderID: $folderId) {
          id
          name
          notes {
            id
            content
          }
        }
      }`;

  const data = GraphQLRequest({
    query,
    variables: {
      folderId: folderId,
    },
  });

  return data;
};

export const noteLoader = async ({ params: { noteId } }) => {
  const query = `query Note($noteId: String) {
        note(noteId: $noteId) {
          id
          content
        }
      }`;

  const data = GraphQLRequest({
    query,
    variables: {
      noteId: noteId,
    },
  });

  return data;
};

export const addNewNote = async ({ params, request }) => {
  //Lấy dữ liệu khi submit
  const newNote = await request.formData();
  const formDataObj = {};
  newNote.forEach((value, key) => (formDataObj[key] = value));
  console.log({ newNote, formDataObj });

  const query = `mutation Mutation($content: String!, $folderId: ID!){
    addNote(content: $content, folderId: $folderId )
    {
      id,
      content
    }
  }`;

  const addNote = await GraphQLRequest({
    query,
    variables: formDataObj,
  });

  console.log({ addNote });
  return addNote;
};
