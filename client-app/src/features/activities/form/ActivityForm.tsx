import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Grid, Segment } from 'semantic-ui-react';
import { ActivityFormValues, IActivity, IActivityFormValues } from '../../../app/models/activity';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import { Field, Form as FinalForm } from 'react-final-form';
import TextInput from '../../../app/common/form/TextInput';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import SelectInput from '../../../app/common/form/SelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import DateInput from '../../../app/common/form/DateInput';
import { v4 as uuid } from 'uuid';
import { combineValidators, composeValidators, hasLengthGreaterThan, isRequired } from 'revalidate';

const validate = combineValidators({
    title: isRequired({message: 'The event title is required'}),
    category: isRequired('Category'),
    description: composeValidators(
        isRequired('Description'),
        hasLengthGreaterThan(4)({message: 'Description needs to be at least 5 characters'}),
    )(),
    city: isRequired('City'),
    venue: isRequired('Venue'),
    date: isRequired('Date')
})

interface DetailParams {
    id: string
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {
    const {
        submitting,
        loadActivity,
        loadingInitial,
        createActivity,
        editActivity
    } = useContext(ActivityStore);

    const [activity, setActivity] = useState<IActivityFormValues>(new ActivityFormValues());

    useEffect(() => {
        const { id } = match.params;
        if (id) loadActivity(id).then((activity) => activity && setActivity(new ActivityFormValues(activity)));
    }, [match.params, loadActivity]);

    if (loadingInitial) return <LoadingComponent content='Loading...' />;

    const { id, title, description, category, date, city, venue } = activity;

    const handleFinalFormSubnit = async (act: IActivity) => {
        if (!act.id) {
            let newActivity = {
                ...act,
                id: uuid()
            };
            const succsess = await createActivity(newActivity);
            if (succsess) history.push(`/activities/${newActivity.id}`);
        } else {
            const succsess = await editActivity(act);
            if (succsess) history.push(`/activities/${id}`);
        };
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing>
                    <FinalForm
                        validate={validate}
                        initialValues={activity}
                        onSubmit={handleFinalFormSubnit}
                        render={({ handleSubmit }) => (
                            <Form onSubmit={handleSubmit}>
                                <Field
                                    name='title'
                                    placeholder={'Title'}
                                    value={title}
                                    component={TextInput}
                                />
                                <Field
                                    name='description'
                                    placeholder='Description'
                                    row={1}
                                    value={description}
                                    component={TextAreaInput}
                                />
                                <Field
                                    name='category'
                                    placeholder='Category'
                                    value={category}
                                    options={categoryOptions}
                                    component={SelectInput}
                                />
                                <Field<Date>
                                    name='date'
                                    placeholder='Date'
                                    value={date}
                                    component={DateInput}
                                />
                                <Field
                                    name='city'
                                    placeholder='City'
                                    value={city}
                                    component={TextInput}
                                />
                                <Field
                                    name='venue'
                                    placeholder='Venue'
                                    value={venue}
                                    component={TextInput}
                                />
                                <Button
                                    loading={submitting}
                                    floated='right'
                                    positive type='submit'
                                    content='Submit'
                                />
                                <Button
                                    floated='right'
                                    type='button'
                                    content='Cancel'
                                    onClick={id ? () => history.push(`/activities/${id}`) : () => history.push(`/activities`)}
                                />
                            </Form>
                        )}
                    />
                </Segment>
            </Grid.Column>
        </Grid>

    );
};

export default observer(ActivityForm);