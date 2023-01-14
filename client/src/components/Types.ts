type Note = {
    id: number;
    description: string;
    checked: boolean;
};

type Event = {
    id: number;
    title: string;
    notes: Note[];
};

type Workspace = {
    id: number;
    name: string;
    events: Event[];
}

export type { Note };
export type { Event };
export type { Workspace };
