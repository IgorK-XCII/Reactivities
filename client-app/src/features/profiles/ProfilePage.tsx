import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { LoadingComponent } from '../../app/layout/LoadingComponent';
import { rootStoreContext } from '../../app/stores/rootStore';
import ProfileContet from './ProfileContet';
import ProfileHeader from './ProfileHeader';

interface IDetailParams {
    username: string;
}

const ProfilePage: React.FC<RouteComponentProps<IDetailParams>> = ({
    match: { params: { username } }
}) => {
    const {
        profileStore: {
            profile, loadProfile, loadingProfile, follow, unfollow, isCurrentUser, loading, setActiveTab
        }
    } = useContext(rootStoreContext);

    useEffect(() => {
        loadProfile(username);
    }, [loadProfile, username])

    return loadingProfile ?
        <LoadingComponent content='Profile loading...' /> :
        profile && (
            <Grid>
                <Grid.Column width={16}>
                    <ProfileHeader
                        profile={profile}
                        isCurrentUser={isCurrentUser}
                        loading={loading}
                        follow={follow}
                        unfollow={unfollow}
                    />
                    <ProfileContet setActiveTab={setActiveTab} />
                </Grid.Column>
            </Grid>
        );
};

export default observer(ProfilePage);
