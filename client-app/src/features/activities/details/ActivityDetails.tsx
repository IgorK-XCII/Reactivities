import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Button, Card, Image } from 'semantic-ui-react';
import ActivityStore from '../../../app/stores/activityStore';

const ActivityDetails: React.FC = () => {
    const { selectedActivity: activity, setEditMode, selectActivity } = useContext(ActivityStore)
    const { category, title, date, description } = activity!;
    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${category}.jpg`} wrapped ui={false} />
            <Card.Content>
                <Card.Header>{title}</Card.Header>
                <Card.Meta>
                    <span>{date}</span>
                </Card.Meta>
                <Card.Description>
                    {description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths={2}>
                    <Button basic color='blue' content='Edit' onClick={() => setEditMode(true)} />
                    <Button basic color='grey' content='Cancel' onClick={() => selectActivity(null)} />
                </Button.Group>
            </Card.Content>
        </Card>
    )
};

export default observer(ActivityDetails);
