import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

// material-ui imports
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';

// assets
import BellOutlined from '@ant-design/icons/BellOutlined';
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';

// sx styles
const avatarSX = {
  width: 36,
  height: 36,
  fontSize: '1rem'
};

const actionSX = {
  mt: '6px',
  ml: 1,
  top: 'auto',
  right: 'auto',
  alignSelf: 'flex-start',
  transform: 'none'
};

export default function Notification() {
  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [read, setRead] = useState(0); // Update the read state based on new notifications count

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    const socket = new SockJS('http://localhost:8082/ws');
    const stompClient = Stomp.over(socket);
    const token = localStorage.token;
    stompClient.connect({ Authorization: `Bearer ${token}` }, (frame) => {
      console.log('Connected: ' + frame);

      stompClient.subscribe('/topic/booking', (message) => {
        const newNotification = `New booking created: ${message.body}`;
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          { text: newNotification, timestamp: new Date().toLocaleTimeString() }
        ]);
        setRead((prevRead) => prevRead + 1);
      });
    }, (error) => {
      console.error('Error connecting: ', error)
    });

    return () => {
      stompClient.disconnect();
    };
  }, []);

  const iconBackColorOpen = 'grey.100';

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={{ color: 'text.primary', bgcolor: open ? iconBackColorOpen : 'transparent' }}
        aria-label="open notifications"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={read} color="primary">
          <BellOutlined />
        </Badge>
      </IconButton>
      <Popper
        placement={matchesXs ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [matchesXs ? -5 : 0, 9] } }] }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position={matchesXs ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper sx={{ boxShadow: theme.customShadows.z1, width: '100%', minWidth: 285, maxWidth: { xs: 285, md: 420 } }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title="Notifications"
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={
                    <>
                      {read > 0 && (
                        <Tooltip title="Mark all as read">
                          <IconButton color="success" size="small" onClick={() => setRead(0)}>
                            <CheckCircleOutlined style={{ fontSize: '1.15rem' }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  }
                >
                  <List component="nav" sx={{ p: 0 }}>
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <React.Fragment key={index}>
                          <ListItemButton>
                            <ListItemAvatar>
                              <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                                <BellOutlined />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Typography variant="h6">
                                  {notification.text}
                                </Typography>
                              }
                              secondary={notification.timestamp}
                            />
                          </ListItemButton>
                          <Divider />
                        </React.Fragment>
                      ))
                    ) : (
                      <Typography variant="h6" align="center" sx={{ my: 2 }}>
                        No new notifications
                      </Typography>
                    )}
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
