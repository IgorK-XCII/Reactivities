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
    username: isRequired('username'),
    displayName: isRequired('display name'),
    password: isRequired('password')
});

const RegisterForm: React.FC = () => {
    const { userStore: { register } } = useContext(rootStoreContext);
    return (
        <FinalForm
            validate={validate}
            onSubmit={async (values: IUserFormValues) => {
                try {
                    await register(values);
                    history.push(`/activities`);
                } catch (error) {
                    return {
                        [FORM_ERROR]: error
                    }
                }
            }}
            render={({ handleSubmit, submitting, submitError, dirtySinceLastSubmit }) => (
                <Form onSubmit={handleSubmit} error>
                    <Header as='h2' content='Sign up to Reactivities' color='teal' textAlign='center' />
                    <Field
                        name='username'
                        placeholder='Username'
                        component={TextInput}
                    />
                    <Field
                        name='displayName'
                        placeholder='Display Name'
                        component={TextInput}
                    />
                    <Field
                        name='email'
                        placeholder='Email'
                        component={TextInput}
                    />
                    <Field
                        name='password'
                        placeholder='password'
                        component={TextInput}
                        type='password'
                    />
                    {submitError && !dirtySinceLastSubmit && (<ErrorMessage error={submitError} />)}
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

export default RegisterForm;
