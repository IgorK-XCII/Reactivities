import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Item, Segment, Label } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import ActivityListItemAttendees from './ActivityListItemAttendees';

interface IProps {
    activity: IActivity
};

const ActivityListItem: React.FC<IProps> = ({
    activity: { id, title, date, description, city, venue, attendees, isHost, isGoing }
}) => {
    const { displayName, image } = attendees.find(a => a.isHost)!;

    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item key={id}>
                        <Item.Image size='tiny' circular src={image || '/assets/user.png'} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${id}`} >{title}</Item.Header>
                            <Item.Description>
                                {`Hosted by ${displayName}`}
                            </Item.Description>
                            {isHost &&
                                <Item.Description>
                                    <Label color='orange' content='You are hosting this activity' />
                                </Item.Description>}
                            {isGoing && !isHost &&
                                <Item.Description>
                                    <Label color='green' content='You are going to this activity' />
                                </Item.Description>}
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <Icon name='clock' /> {format(date, 'hh:mm a')}
                <Icon name='marker' /> {venue}, {city}
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendees attendees={attendees} />
            </Segment>
            <Segment clearing>
                <span>{description}</span>
                <Button
                    floated='right'
                    content='view'
                    color='blue'
                    as={Link} to={`/activities/${id}`} />
            </Segment>
        </Segment.Group>
    )
};

export default observer(ActivityListItem);
