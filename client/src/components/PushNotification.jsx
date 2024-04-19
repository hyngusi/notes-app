import React, { useEffect, useState } from 'react';
import NotificationIcon from '@mui/icons-material/Notifications';
import { createClient } from 'graphql-ws';
import { GRAPHQL_SUBSCRIPTIN_ENDPOIN } from '../utils/constans';
import { Badge, Menu, MenuItem } from '@mui/material';

const client = createClient({
    url: GRAPHQL_SUBSCRIPTIN_ENDPOIN,
})

const query = `subscription PushNotification {
    notification {
      message
    }
  }`;

export function PushNotification() {
    const [invisible, setInvisible] = useState(true);
    const [notification, setNotification] = useState('');

    const [anchorEl, setAnchorEl] = useState(null);

    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
        setNotification('');
        setInvisible(true);
    };

    const handleClick = (e) => {
        if (notification) {
            setAnchorEl(e.currentTarget);
        }
    };

    useEffect(() => {
        // subscription to notification
        (async () => {
            const subscription = client.iterate({
                query,
            });

            for await (const event of subscription) {
                if (event.notification !== null) {
                    setInvisible(false);

                    const message = event?.data?.notification?.message;
                    setNotification(message);
                    // console.log('mes', { message });
                }
                console.log(event); // In ra sự kiện nhận được từ subscription
                // complete a running subscription by breaking the iterator loop
                break;

            }
        })();
    }, [])
    return (
        <>
            <Badge color='secondary' variant='dot' invisible={invisible}>
                <NotificationIcon onClick={handleClick} />
            </Badge>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose}>{notification}</MenuItem>
            </Menu >
        </>
    )
}