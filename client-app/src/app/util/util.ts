import { IActivity, IAttendee } from "../models/activity";
import { IUser } from "../models/user";

export const setActivityProps = (act: IActivity, user: IUser) => {
    act.date = new Date(act.date);
    act.isGoing = act.attendees.some(a => a.username === user.username);
    act.isHost = act.attendees.some(({ isHost, username }) => isHost && username === user.username);
}

export const createAttendee = (user: IUser) : IAttendee => {
    const {displayName, username, image} = user;
    return {
        displayName: displayName,
        isHost: false,
        username: username,
        image: image!
    }
}