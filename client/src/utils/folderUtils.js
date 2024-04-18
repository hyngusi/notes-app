import NewFolder from "../components/NewFolder";
import { GraphQLRequest } from "./request";

export const foldersLoader = async () => {
  // load lấy dữ liệu khi / được tải
  const query = `query Folders {
        folders {
          id
          name
          createdAt
        }
      }`;

  const data = await GraphQLRequest({ query });
  return data;
};
export const addNewFolder = async (newFolder) => {
  const query = `mutation Mutation($name: String!){
    addFolder(name: $name) {
      name
      author{
        name
      }
    }
  }`;
  const data = await GraphQLRequest({
    query,
    variables: { name: newFolder.name },
  });
  console.log({ data: data });
  return data;
};
