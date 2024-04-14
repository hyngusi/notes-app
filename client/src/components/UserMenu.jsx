import React, { useContext, useState } from "react";
import { AuthContext } from '../context/AuthProvider';
import { Avatar, Menu, MenuItem, Typography } from '@mui/material';
import { Box } from '@mui/system';

export default function UserMenu() {
    const { user } = useContext(AuthContext);
    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleLogout = () => {
        user.auth.signOut();
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (e) => {
        console.log('Avatar clicked'); // Thêm log ở đây
        setAnchorEl(e.currentTarget);
    };

    return (
        <>
            <Box sx={{ display: 'flex' }} onClick={handleClick}>
                <Typography>{user.displayName}</Typography>
                <Avatar alt='avatar' src={user.photoURL}
                    sx={{ width: 24, height: 24, marginLeft: '5px' }} />
            </Box>

            <Menu
                id='basic-menu'
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu >
        </>
    );
}
