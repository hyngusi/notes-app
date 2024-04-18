import { GraphQLRequest } from "./request";

export const foldersLoader = async () => { // load lấy dữ liệu khi / được tải
    const query = `query Folders {
        folders {
          id
          name
          createdAt
        }
      }`;

    const data = await GraphQLRequest({ query })
    return data;
}