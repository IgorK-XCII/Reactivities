import React, { ChangeEvent, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';

interface IProps {
    setEditMode: (editMode: boolean) => void;
    activity: IActivity,
    createActivity: (activity: IActivity) => void;
    editActivity: (activity: IActivity) => void;
    submitting: boolean;
    target: string;
};

export const ActivityForm: React.FC<IProps> = ({ setEditMode, activity: initialFromState, createActivity, editActivity, submitting, target }) => {
    const initializeForm = () => (
        initialFromState ?
            initialFromState :
            {
                id: '',
                title: '',
                description: '',
                category: '',
                date: '',
                city: '',
                venue: ''
            }
    );

    const [activity, setActivity] = useState<IActivity>(initializeForm);

    const { id, title, description, category, date, city, venue } = activity;

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        setActivity({
            ...activity,
            [name]: value
        });
    };

    const handleSubmit = () => {
        if (id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    };

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input
                    onChange={handleInputChange}
                    name='title'
                    placeholder={'Title'}
                    value={title} />
                <Form.TextArea
                    rows={2}
                    onChange={handleInputChange}
                    name='description'
                    placeholder='Description'
                    value={description} />
                <Form.Input
                    onChange={handleInputChange}
                    name='category'
                    placeholder='Category'
                    value={category} />
                <Form.Input
                    onChange={handleInputChange}
                    name='date'
                    type='datetime-local'
                    placeholder='Date'
                    value={date} />
                <Form.Input
                    onChange={handleInputChange}
                    name='city'
                    placeholder='City'
                    value={city} />
                <Form.Input
                    onChange={handleInputChange}
                    name='venue'
                    placeholder='Venue'
                    value={venue} />
                <Button
                    loading={submitting}
                    floated='right'
                    positive type='submit'
                    content='Submit' />
                <Button
                    floated='right'
                    type='button'
                    content='Cancel'
                    onClick={() => setEditMode(false)} />
            </Form>
        </Segment>
    )
};