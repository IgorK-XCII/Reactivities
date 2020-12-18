import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';

interface DetailParams {
    id: string
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {
    const { createActivity, editActivity, submitting, loadActivity, loadingInitial, activity: initialFromState, selectActivity } = useContext(ActivityStore);

    const [activity, setActivity] = useState<IActivity>({
        id: '',
        title: '',
        description: '',
        category: '',
        date: '',
        city: '',
        venue: ''
    });

    useEffect(() => {
        const { id } = match.params;
        if (id) loadActivity(id).then(() => initialFromState && setActivity(initialFromState));
        return () => {
            selectActivity(null);
        };
    }, [match.params, loadActivity, initialFromState, selectActivity]);

    if (loadingInitial) return <LoadingComponent content='Loading...' />

    const { id, title, description, category, date, city, venue } = activity;

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;

        setActivity({
            ...activity,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        if (id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            await createActivity(newActivity);
            history.push(`/activities/${id}`);
        } else {
            await editActivity(activity);
            history.push(`/activities/${id}`);
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
                    onClick={() => history.push(`/activities/${id}`)} />
            </Form>
        </Segment>
    );
};

export default observer(ActivityForm);