import React from 'react'
import { Button, Card, Image } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';

interface IProps {
    activity: IActivity;
    setActivity: (activity: IActivity | null) => void;
    setEditMOde: (editMode: boolean) => void;
};

export const ActivityDetails: React.FC<IProps> = ({ activity, setActivity, setEditMOde }) => {
    const { category, title, date, description } = activity;
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
                    <Button basic color='blue' content='Edit' onClick={() => setEditMOde(true)} />
                    <Button basic color='grey' content='Cancel' onClick={() => setActivity(null)} />
                </Button.Group>
            </Card.Content>
        </Card>
    )
};
