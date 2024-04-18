import React, { useContext } from "react"
import { Button, Typography } from '@mui/material';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from 'react-router-dom';
import { GraphQLRequest } from "../utils/request";

export default function Login() {
    const auth = getAuth();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleLoginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();

        const { user: { uid, displayName } } = await signInWithPopup(auth, provider);
        await GraphQLRequest({
            query: `mutation register($uid: String!, $name: String!){
            register(uid: $uid, name: $name) {
                uid,
                name
            }
        }`,
            variables: {
                uid,
                name: displayName
            }
        });
        console.log('register', { data });
    }

    if (user?.uid) {
        navigate('/');
        return;
    }

    return (
        <>
            <Typography variant="h5" sx={{ marginBottom: '10px' }}>
                Welcome to Note App
            </Typography>
            <Button variant="contained" onClick={handleLoginWithGoogle}>
                Login with Google
            </Button>
        </>
    )
}