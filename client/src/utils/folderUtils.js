export const foldersLoader = async () => { // load lấy dữ liệu khi / được tải
    const query = `query Folders {
        folders {
          id
          name
          createdAt
        }
      }`;

    const res = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query
        })
    });

    const { data } = await res.json();
    console.log({ data });
    return data;
}