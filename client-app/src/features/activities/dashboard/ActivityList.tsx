import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Item, Button, Label, Segment } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity';
import ActivityStore from '../../../app/stores/activityStore';

const ActivityList: React.FC = () => {
    const { activitiesByDate, submitting, deleteActivity, target } = useContext(ActivityStore);
    return (
        <Segment clearing>
            <Item.Group divided>
                {activitiesByDate.map(({ id, title, date, description, city, venue }: IActivity) => (
                    <Item key={id}>
                        <Item.Content>
                            <Item.Header as='a'>{title}</Item.Header>
                            <Item.Meta>{date}</Item.Meta>
                            <Item.Description>
                                <div>{description}</div>
                                <div>{city}, {venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button
                                    floated='right'
                                    content='view'
                                    color='blue'
                                    as={Link} to={`/activities/${id}`} />
                                <Button
                                    name={id}
                                    loading={target === id && submitting}
                                    floated='right'
                                    content='delete'
                                    color='red'
                                    onClick={(e) => deleteActivity(e, id)} />
                                <Label basic content='Category' />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
};

export default observer(ActivityList);
