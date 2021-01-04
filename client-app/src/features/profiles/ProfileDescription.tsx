import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react';
import { Button, Grid, Header, Tab } from 'semantic-ui-react';
import { rootStoreContext } from '../../app/stores/rootStore';
import ProfileEditForm from './ProfileEditForm';

const ProfileDescription: React.FC = () => {
    const { profileStore: { isCurrentUser, profile }, } = useContext(rootStoreContext);

    const [editDescriptionMode, setEditDescriptionMode] = useState(false);
    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16}>
                    <Header floated='left' icon='settings' content={`About ${profile?.displayName}`} />
                    {isCurrentUser &&
                        <Button
                            floated='right'
                            basic
                            content={editDescriptionMode ? 'Cancel' : 'Edit description'}
                            onClick={() => setEditDescriptionMode(!editDescriptionMode)}
                        />}
                </Grid.Column>
                <Grid.Column width={16}>
                    {editDescriptionMode ?
                        isCurrentUser && <ProfileEditForm profile={profile!} /> :
                        <span>{profile?.bio}</span>}
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
};

export default observer(ProfileDescription);
