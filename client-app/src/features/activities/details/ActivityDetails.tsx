import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';
import { rootStoreContext } from '../../../app/stores/rootStore';
import ActivityDetailedChat from './ActivityDetailedChat';
import ActivityDetailedHeader from './ActivityDetailedHeader';
import ActivityDetailedInfo from './ActivityDetailedInfo';
import ActivityDetailedSidebar from './ActivityDetailedSidebar';

interface IDetailParams {
    id: string
};

const ActivityDetails: React.FC<RouteComponentProps<IDetailParams>> = ({ match, history }) => {
    const { activityStore: { activity, loadActivity, loadingInitial } } = useContext(rootStoreContext);

    useEffect(() => {
        loadActivity(match.params.id);
    }, [loadActivity, match.params.id, history]);

    if (loadingInitial) return <LoadingComponent content='Loading activity...' />;

    if (!activity) return <h2>Activity not found</h2>;

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={activity} />
                <ActivityDetailedInfo activity={activity} />
                <ActivityDetailedChat />
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar attendees={activity?.attendees} />
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityDetails);
