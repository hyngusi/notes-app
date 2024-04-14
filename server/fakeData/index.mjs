export default {
    authors: [
        {
            id: "123",
            name: 'huy'
        },
        {
            id: 999,
            name: 'test'
        }
    ],
    folders: [
        {
            id: "1",
            name: 'Home',
            createdAt: '2023',
            authorId: 123,
        },
        {
            id: "2",
            name: 'Home2',
            createdAt: '2023',
            authorId: 999,
        },
        {
            id: "3",
            name: 'Home3',
            createdAt: '2023',
            authorId: 123,
        },
    ],
    notes: [
        {
            id: "123",
            content: '<p>Go to supermarket</p>',
            folderId: "1",
        },
        {
            id: "234",
            content: '<p>Go to park</p>',
            folderId: "1",
        },
        {
            id: "123",
            content: '<p>Go to school</p>',
            folderId: "2",
        }
    ]
}