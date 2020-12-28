import { FORM_ERROR } from 'final-form';
import React, { useContext } from 'react';
import { Form as FinalForm, Field } from 'react-final-form';
import { combineValidators, isRequired } from 'revalidate';
import { Button, Form, Header } from 'semantic-ui-react';
import { history } from '../..';
import ErrorMessage from '../../app/common/form/ErrorMessage';
import TextInput from '../../app/common/form/TextInput';
import { IUserFormValues } from '../../app/models/user';
import { rootStoreContext } from '../../app/stores/rootStore';

const validate = combineValidators({
    email: isRequired('email'),
    password: isRequired('password')
});

const LoginForm: React.FC = () => {
    const { userStore: { login } } = useContext(rootStoreContext);
    return (
        <FinalForm
            validate={validate}
            onSubmit={async (values: IUserFormValues) => {
                try {
                    await login(values);
                    history.push(`/activities`);
                } catch (error) {
                    return {
                        [FORM_ERROR]: error
                    }
                }
            }}
            render={({ handleSubmit, submitting, submitError, dirtySinceLastSubmit }) => (
                <Form onSubmit={handleSubmit} error>
                    <Header as='h2' content='Login to Reactivities' color='teal' textAlign='center' />
                    <Field
                        name='email'
                        placeholder='email'
                        component={TextInput}
                    />
                    <Field
                        name='password'
                        placeholder='password'
                        component={TextInput}
                        type='password'
                    />
                    {submitError && !dirtySinceLastSubmit && (<ErrorMessage error={submitError} text='Invalid username or password' />)}
                    <br />
                    <Button
                        loading={submitting}
                        positive
                        content='Login'
                        fluid
                    />
                </Form>
            )}
        />
    );
};

export default LoginForm;
