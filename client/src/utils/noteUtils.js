import { GraphQLRequest } from "./request";

export const notesLoader = async ({ params: { folderId } }) => {
  const query = `query Folder($folderId: String) {
        folder(folderID: $folderId) {
          id
          name
          notes {
            id
            content
          }
        }
      }`;

  const { data } = GraphQLRequest({
    query,
    variables: {
      folderId: folderId,
    },
  });

  return data;
};

export const noteLoader = async ({ params: { noteId } }) => {
  const query = `query Folder($noteId: String) {
        note(noteId: $noteId) {
          id
          content
        }
      }`;

  const { data } = GraphQLRequest({
    query,
    variables: {
      noteId: noteId,
    }
  });

  return data;
};
