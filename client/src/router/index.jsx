import { createBrowserRouter, Outlet } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import AuthProvider from "../context/AuthProvider.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ErorrPage from "../pages/ErrorPage.jsx";
import NoteList from "../components/NoteList.jsx";
import Note from "../components/Note.jsx";

const AuthLayout = () => {
    return <AuthProvider><Outlet /></AuthProvider>
}

export default createBrowserRouter([
    {
        element: <AuthLayout />,
        errorElement: <ErorrPage />,
        children: [
            {
                element: <Login />,
                path: '/login',
            },
            {
                element: <ProtectedRoute />,
                //sau khi login xong thi ra trang giao dien chinh
                children: [
                    {
                        element: <Home />,
                        path: '/',
                        loader: async () => { // load lấy dữ liệu khi / được tải
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
                        },
                        children: [
                            {
                                //Khi nhap vao mot cai folder bat ky thi ra chu de cua folder do
                                element: <NoteList />,
                                path: `folders/:folderId`,
                                loader: async ({ params: { folderId } }) => {
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

                                    const res = await fetch('http://localhost:4000/graphql', {
                                        method: 'POST',
                                        headers: {
                                            'Content-type': 'application/json',
                                            'Accept': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            query,
                                            variables: {
                                                folderId: folderId
                                            }
                                        })
                                    });

                                    const { data } = await res.json();
                                    console.log('[Note List]', { data })
                                    return data;

                                },
                                children: [
                                    {
                                        // Khi nhap vao chu de thi dieu huong ra trang detail cua note
                                        element: <Note />,
                                        path: `note/:noteId`
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    // {
    //     element: <Home />,
    //     path: '/'
    // }
])