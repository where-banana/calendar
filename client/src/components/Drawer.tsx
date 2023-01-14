import { ChevronLeft, AddCircle, Delete } from '@mui/icons-material';
import {
    AppBar,
    Divider,
    Drawer as MuiDrawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

import { Workspace } from './Types';

const API_URL = 'http://localhost:8080'

function Drawer(props: {
    width: number;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    workspaces: { id: number, name: string, events: any[] }[];
    setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>;
    setSelectedWorkspace: React.Dispatch<React.SetStateAction<Workspace | undefined>>;
    renderTrigger: boolean,
    setRenderTrigger: React.Dispatch<React.SetStateAction<boolean>>
}) {

    const addWorkspace = () => {
        const URI = '/entity-management/workspaces'

        axios.post(API_URL + URI, {
            'name': 'new workspace',
            'events': []
        }).then(res => {
            props.setRenderTrigger(!props.renderTrigger)
            console.log(res)
        })
        .catch(res => console.log(res))
    }

    return (
        <MuiDrawer
            sx={{ width: props.width }}
            open={props.open}
            anchor="left"
            variant="persistent"
        >
            <AppBar position="static" sx={{ width: props.width }}>
                <Toolbar>
                    <Typography
                        variant="h6"
                        color={'inherit'}
                        sx={{ width: props.width }}
                    >
                        Workspaces
                    </Typography>
                    <IconButton
                        color="inherit"
                        onClick={() => props.setOpen(false)}
                    >
                        <ChevronLeft />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <List>
                {props.workspaces.map(w => (
                    <ListItem key={w.id} sx={{ padding: 0 }}>
                        <ListItemButton onClick={() => props.setSelectedWorkspace(w)}>
                            <ListItemText>{w.name}</ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider />
            <IconButton size="large" color="inherit" sx={{ borderRadius: 0 }} onClick={() => addWorkspace()}>
                <AddCircle />
            </IconButton>
        </MuiDrawer>
    );
}

export default Drawer;
