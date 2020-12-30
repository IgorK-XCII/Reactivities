import React from 'react';
import { List, Image, Popup } from 'semantic-ui-react';
import { IAttendee } from '../../../app/models/activity';

interface IProps {
    attendees: IAttendee[];
}

const ActivityListItemAttendees: React.FC<IProps> = ({ attendees }) => {
    return (
        <List horizontal>
            {attendees.map(({ username, displayName, image }) => (
                <List.Item key={username}>
                    <Popup
                        header={displayName}
                        trigger={<Image size='mini' circular src={image || `/assets/user.png`} />}
                    />
                </List.Item>
            ))}
        </List>
    )
}

export default ActivityListItemAttendees;
