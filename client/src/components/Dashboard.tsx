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

    const [renderTrigger, setRenderTrigger] = useState(false)

    const [workspaces, setWorkspaces] = useState<Workspace[]>([])
    const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace>()

    const [edit, setEdit] = useState(false)

    const [oldName, setOldName] = useState(selectedWorkspace?.name);
    const [newName, setNewName] = useState(selectedWorkspace?.name);

    const deleteWorkspace = () => {
        const URI = '/entity-management/workspaces/' + selectedWorkspace?.id

        axios.delete(API_URL + URI)
            .then(res => {
                setSelectedWorkspace(undefined)
                setRenderTrigger(!renderTrigger)
                console.log(res)
            })
            .catch(res => console.log(res))
    }

    const addEvent = () => {
        const URI = '/entity-management/events/'

        axios.post(API_URL + URI, {
            'title': 'new event',
            'workspaceId': selectedWorkspace?.id
        })
            .then(res => {
                setRenderTrigger(!renderTrigger)
                console.log(res)
            })
            .catch(res => console.log(res))
    }

    useEffect(() => {
        const URI = '/entity-management/workspaces'

        axios.get(API_URL + URI)
            .then(res => {
                setWorkspaces([...res.data])

                let selected = [...res.data].find(w => w.id == selectedWorkspace?.id)
                setSelectedWorkspace(selected)
            })
            .catch(res => console.log(res))

    }, [renderTrigger])

    useEffect(() => {
        if (selectedWorkspace && !edit) {
            const URI = '/entity-management/workspaces/' + selectedWorkspace?.id

            axios.put(API_URL + URI, {
                'name': newName,
                'events': selectedWorkspace?.events
            }).then(res => {
                setOldName(newName)
                setRenderTrigger(!renderTrigger)
            })
            .catch(res => setNewName(oldName))
        }
    }, [edit])

    return (
        <>
            <Drawer
                width={drawerWidth}
                open={open}
                setOpen={setOpen}
                workspaces={workspaces}
                setWorkspaces={setWorkspaces}
                setSelectedWorkspace={setSelectedWorkspace}
                renderTrigger={renderTrigger}
                setRenderTrigger={setRenderTrigger}
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
                            <Typography variant="h6"/>
                            <input
                                className="MuiTypography-root MuiTypography-h6 css-2ulfj5-MuiTypography-root"
                                readOnly={!edit}
                                style={{
                                    ...(!edit && { border: 'none', borderWidth: 0,
                                    outline: 'none', outlineWidth: 0 }),
                                    width: '100%', flexGrow: 1
                                }}
                                value={newName || selectedWorkspace.name}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                            <IconButton sx={{ ...(edit && { color: 'red' }) }} onClick={() => setEdit(!edit)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => deleteWorkspace()}>
                                <DeleteIcon />
                            </IconButton>
                        </Toolbar>
                        <Divider />
                        <Grid container></Grid>
                        {selectedWorkspace?.events.map(e => (
                            <Grid key={e.id}>
                                <EventCard
                                    workspaceId={selectedWorkspace.id}
                                    event={e}
                                    renderTrigger={renderTrigger}
                                    setRenderTrigger={setRenderTrigger}
                                />
                            </Grid>
                        )
                        )}
                        <Grid sx={{ display: 'flex' }}>
                            <IconButton size='large' sx={{ borderRadius: 0, flexGrow: 1 }} onClick={() => addEvent()}>
                                <AddCircle />
                            </IconButton>
                        </Grid>
                    </>) : (
                    <Typography variant='h6' color='gray'>
                        Choose workspace to continue...
                    </Typography>
                )
                }
            </Box>
        </>
    );
}

export default Dashboard;
