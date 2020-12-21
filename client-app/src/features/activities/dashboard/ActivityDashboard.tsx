import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Grid } from 'semantic-ui-react';
import ActivityList from './ActivityList';
import ActivityStore from '../../../app/stores/activityStore';
import { LoadingComponent } from '../../../app/layout/LoadingComponent';

const ActivityDashboard: React.FC = () => {

    const { loadingInitial } = useContext(ActivityStore);

    if (loadingInitial) return <LoadingComponent content='Loading activities...' />;

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width={6}>
                <h2>Activity filters</h2>
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityDashboard);
