import {
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Grid,
    IconButton,
    Toolbar,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import NoteList from './NoteList';
import { Add } from '@mui/icons-material';
import { Event } from './Types';

const API_URL = 'http://localhost:8080';

const EventCard = (props: {
    workspaceId: number,
    event: Event,
    renderTrigger: boolean,
    setRenderTrigger: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [edit, setEdit] = useState(false);
    const [oldTitle, setOldTitle] = useState(props.event.title);
    const [newTitle, setNewTitle] = useState(props.event.title);

    const [saveTrigger, setSaveTrigger] = useState(false);
    const [cancelTrigger, setCancelTrigger] = useState(false);

    const [isDeleted, setIsDeleted] = useState(false);

    const saveChanges = () => {
        setSaveTrigger(true);

        const URI = '/entity-management/events/' + props.event.id
        axios.put(API_URL + URI, {
            'title': newTitle,
            'workspaceId': props.workspaceId
        }).then(res => {
            setOldTitle(newTitle);
        }).catch(res => console.log(res))

        setEdit(false);
        setSaveTrigger(false)
    };

    const cancelChanges = () => {
        setCancelTrigger(true)

        setNewTitle(oldTitle);
        setEdit(false);

        setCancelTrigger(false);
    };

    const deleteCard = () => {
        const URI = '/entity-management/events/' + props.event.id;

        axios.delete(API_URL + URI)
            .then(res => {
                if (res.status == 200) {
                    setIsDeleted(true)
                    props.setRenderTrigger(!props.renderTrigger)
                }
            }).catch(res => console.log(res));
    };

    const addNote = () => {
        const URI = '/entity-management/notes/';

        axios.post(API_URL + URI, {
            'description': 'new note',
            'eventId': props.event.id
        }).then(res => {
            props.setRenderTrigger(!props.renderTrigger)
        }).catch(res => console.log(res));
    }

    return isDeleted ? (
        <></>
    ) : (
        <div style={{ padding: 4 }}>
            <Card elevation={4}>
                <CardContent>
                    <Grid container alignItems='center'>
                        <Grid flexGrow={1}>
                            <Typography color="primary" />
                            <input
                                className="MuiTypography-root MuiTypography-body1 css-vkc4v8-MuiTypography-root"
                                readOnly={!edit}
                                style={{
                                    ...(!edit && { border: 'none', borderWidth: 0,
                                    outline: 'none', outlineWidth: 0 }),
                                    width: '100%',
                                }}
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                        </Grid>
                        <Grid>
                            <IconButton onClick={() => addNote()}>
                                <Add />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <NoteList
                        eventId={props.event.id}
                        notes={props.event.notes}
                        edit={edit}
                        saveTrigger={saveTrigger}
                        cancelTrigger={cancelTrigger}
                        renderTrigger={props.renderTrigger}
                        setRenderTrigger={props.setRenderTrigger}
                    />
                </CardContent>
                <Divider />
                <CardActions>
                    {edit ? (
                        <>
                            <Button onClick={() => saveChanges()}>Save</Button>
                            <Button onClick={() => cancelChanges()}>
                                Cancel
                            </Button>
                            <Typography sx={{ flexGrow: 1 }}></Typography>
                            <Button onClick={() => deleteCard()}>Delete</Button>
                        </>
                    ) : (
                        <Button onClick={() => setEdit(true)}>Edit</Button>
                    )}
                </CardActions>
            </Card>
        </div>
    );
};

export default EventCard;
