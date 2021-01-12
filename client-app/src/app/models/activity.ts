export interface IActivity {
    id: string;
    title: string;
    description: string;
    category: string;
    date: Date;
    city: string;
    venue: string;
    isGoing: boolean;
    isHost: boolean;
    attendees: IAttendee[];
    comments: IComment[];
}

export interface IActivityFormValues extends Partial<IActivity> { }

export class ActivityFormValues implements IActivityFormValues {
    id?: string;
    title: string = '';
    description: string = '';
    category: string = '';
    date?: Date;
    city: string = '';
    venue: string = '';

    constructor(init?: IActivityFormValues) {
        Object.assign(this, init);
    }
}

export interface IAttendee {
    username: string;
    displayName: string;
    image: string;
    isHost: boolean;
    following?: boolean;
}

export interface IComment {
    id: string;
    createdAt: Date;
    body: string;
    username: string;
    displayName: string;
    image: string;
}