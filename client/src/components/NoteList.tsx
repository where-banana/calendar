import {
    Checkbox,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Note as NoteType } from './Types';

const API_URL = 'http://localhost:8080'

const Note = (props: {
    eventId: number
    note: NoteType;
    edit: boolean;
    saveTrigger: boolean;
    cancelTrigger: boolean;
    renderTrigger: boolean;
    setRenderTrigger: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [checked, setChecked] = useState(props.note.checked);
    const [isDeleted, setIsDeleted] = useState(false);

    const [oldDesc, setOldDesc] = useState(props.note.description);
    const [newDesc, setNewDesc] = useState(props.note.description);

    useEffect(() => {
        if (props.saveTrigger)
        {
            if (isDeleted) {
                deleteNote();
            } else {
                const URI = '/entity-management/notes/' + props.note.id
                axios.put(API_URL + URI, {
                    'description': newDesc,
                    'checked': checked,
                    'eventId': props.eventId
                }).then(res => {
                    setOldDesc(newDesc)
                    console.log(res)
                })
            }
        }
    }, [props.saveTrigger])

    useEffect(() => {
        if (props.cancelTrigger) {
            setIsDeleted(false)
            setNewDesc(oldDesc)
        }
    }, [props.cancelTrigger])

    const deleteNote = () => {
        const URI = '/entity-management/notes/' + props.note.id
        axios.delete(API_URL + URI)
            .then(res => {
                if (res.status == 200) {
                    props.setRenderTrigger(!props.renderTrigger)
                }
            })
            .catch(res => {
                setIsDeleted(false)
                console.log(res)
            })
    };

    const checkNote = () => {

        const URI = '/entity-management/notes/' + props.note.id;

        axios.put(API_URL + URI, {
            'id': props.note.id,
            'description': props.note.description,
            'checked': !checked,
            'eventId': props.eventId
        }).then(res => {
            if (res.status == 200) {
                setChecked(!checked)
            }
        }).catch(res => console.log(res))
    }

    return isDeleted ? (
        <></>
    ) : (
        <ListItem key={props.note.id}>
            <ListItemIcon>
                <Checkbox
                    edge="start"
                    checked={checked}
                    onClick={() => checkNote()}
                />
            </ListItemIcon>
            <ListItemText>
                <Typography />
                <input
                    className="MuiTypography-root MuiTypography-body1 css-ahj2mt-MuiTypography-root"
                    readOnly={!props.edit}
                    style={{
                        ...(!props.edit && { border: 'none', borderWidth: 0,
                        outline: 'none', outlineWidth: 0 }),
                        width: '100%',
                        ...(checked && {
                            textDecoration: 'line-through',
                            // color: 'gray'
                        }),
                    }}
                    onChange={(e) => setNewDesc(e.target.value)}
                    value={newDesc}
                />
            </ListItemText>
            {props.edit && (
                <ListItemSecondaryAction>
                    <IconButton edge="end" onClick={() => setIsDeleted(true)}>
                        <DeleteIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            )}
        </ListItem>
    );
};

const NoteList = (props: {
    eventId: number;
    notes: NoteType[];
    edit: boolean;
    saveTrigger: boolean;
    cancelTrigger: boolean;
    renderTrigger: boolean;
    setRenderTrigger: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    return (
        <List>
            {props.notes.map((n) => (
                <Note
                    eventId={props.eventId}
                    key={n.id}
                    note={n}
                    edit={props.edit}
                    saveTrigger={props.saveTrigger}
                    cancelTrigger={props.cancelTrigger}
                    renderTrigger={props.renderTrigger}
                    setRenderTrigger={props.setRenderTrigger}
                />
            ))}
        </List>
    );
};

export default NoteList;
