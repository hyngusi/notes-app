import { createBrowserRouter, Outlet } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import AuthProvider from "../context/AuthProvider.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ErorrPage from "../pages/ErrorPage.jsx";
import NoteList from "../components/NoteList.jsx";
import Note from "../components/Note.jsx";
import { noteLoader, notesLoader } from "../utils/noteUtils.js";
import { foldersLoader } from "../utils/folderUtils.js";

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
                        loader: foldersLoader,
                        children: [
                            {
                                //Khi nhap vao mot cai folder bat ky thi ra chu de cua folder do
                                element: <NoteList />,
                                path: `folders/:folderId`,
                                loader: notesLoader,
                                children: [
                                    {
                                        // Khi nhap vao chu de thi dieu huong ra trang detail cua note
                                        element: <Note />,
                                        path: `note/:noteId`,
                                        loader: noteLoader
                                    },
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