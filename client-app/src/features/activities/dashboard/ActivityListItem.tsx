import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Item, Segment } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';

interface IProps {
    activity: IActivity
};

const ActivityListItem: React.FC<IProps> = ({ activity }) => {
    const { id, title, date, description, city, venue } = activity;
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item key={id}>
                        <Item.Image size='tiny' circular src='/assets/user.png' />
                        <Item.Content>
                            <Item.Header as='a'>{title}</Item.Header>
                            <Item.Description>
                                Hosted by Bob
                            </Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <Icon name='clock' /> {date}
                <Icon name='marker' /> {venue}, {city}
            </Segment>
            <Segment secondary>
                Attendees will go here
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
    );
};

export default observer(ActivityListItem);
