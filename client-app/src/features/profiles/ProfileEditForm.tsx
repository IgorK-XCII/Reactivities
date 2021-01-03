import { observer } from 'mobx-react-lite';
import { Form as FinalForm, Field } from 'react-final-form';
import React, { useContext } from 'react';
import { combineValidators, isRequired } from 'revalidate';
import TextInput from '../../app/common/form/TextInput';
import { IDescription, IProfile } from '../../app/models/profile';
import TextAreaInput from '../../app/common/form/TextAreaInput';
import { Button, Form } from 'semantic-ui-react';
import { rootStoreContext } from '../../app/stores/rootStore';

const validate = combineValidators({
    displayName: isRequired('display name'),
    bio: isRequired('bio')
});

interface IProps {
    profile: IProfile;
};

const ProfileEditForm: React.FC<IProps> = ({ profile }) => {
    const { profileStore: { editDescription, editingDescription } } = useContext(rootStoreContext);

    const { username, image, photos, ...description } = profile;

    return (
        <FinalForm
            validate={validate}
            initialValues={description}
            onSubmit={(values: IDescription) => editDescription(values)}
            render={({ handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                    <Field
                        name='displayName'
                        placeholder='Display Name'
                        component={TextInput}
                    />
                    <Field
                        name='bio'
                        placeholder='Biography'
                        row={1}
                        component={TextAreaInput}
                    />
                    <Button
                        loading={editingDescription}
                        floated='right'
                        positive
                        type='submit'
                        content='Submit'
                    />
                </Form>
            )}
        />
    );
};

export default observer(ProfileEditForm);
