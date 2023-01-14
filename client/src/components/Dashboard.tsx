import { AccountCircle, Add, AddCircle } from '@mui/icons-material';
import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Divider,
    Grid,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import Drawer from './Drawer';

import EventCard from './EventCard';
import axios from 'axios';
import { Workspace } from './Types';

const drawerWidth = 240;

const API_URL = 'http://localhost:8080'

function Dashboard() {
    const [open, setOpen] = useState(false);
    const [anchor, setAnchor] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchor);

    const [workspaces, setWorkspaces] = useState<Workspace[]>([])
    const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace>()

    useEffect(() => {
        const URI = '/entity-management/workspaces'

        axios.get(API_URL + URI)
            .then(res => setWorkspaces(res.data))
            .catch(res => console.log(res))

    }, [])

    return (
        <>
            <Drawer
                width={drawerWidth}
                open={open}
                setOpen={setOpen}
                workspaces={workspaces}
                setWorkspaces={setWorkspaces}
                setSelectedWorkspace={setSelectedWorkspace}
            />
            <Box
                sx={{
                    ...(open && {
                        width: `calc(100% - ${drawerWidth}px)`,
                        marginLeft: `${drawerWidth}px`,
                    }),
                }}
            >
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            color="inherit"
                            onClick={() => setOpen(true)}
                            sx={{ mr: 2, ...(open && { display: 'none' }) }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h5" sx={{ flexGrow: 1 }}>
                            Calendar
                        </Typography>
                        <IconButton
                            size="large"
                            color="inherit"
                            onClick={e => setAnchor(e.currentTarget)}
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            open={menuOpen}
                            anchorEl={anchor}
                            aria-labelledby="account-menu-button"
                            onClose={() => setAnchor(null)}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                        >
                            <MenuItem>Account</MenuItem>
                            <MenuItem>Sign out</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
                {selectedWorkspace ? (
                    <>
                        <Toolbar>
                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                {selectedWorkspace?.name}
                            </Typography>
                            <IconButton>
                                <EditIcon />
                            </IconButton>
                            <IconButton>
                                <DeleteIcon />
                            </IconButton>
                        </Toolbar>
                        <Divider />
                        <Grid container></Grid>
                        {selectedWorkspace?.events.map(e => (
                            <Grid key={e.id}>
                                <EventCard workspaceId={selectedWorkspace.id} event={e} />
                            </Grid>
                        )
                        )}
                        <Grid sx={{ display: 'flex' }}>
                            <IconButton size='large' sx={{ borderRadius: 0, flexGrow: 1 }}>
                                <AddCircle />
                            </IconButton>
                        </Grid>
                    </>) : (
                    <Typography variant='h6'>
                        Choose workspace to continue
                    </Typography>
                )
                }
            </Box>
        </>
    );
}

export default Dashboard;
