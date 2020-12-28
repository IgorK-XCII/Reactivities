import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext } from 'react';
import { Item, Label } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { rootStoreContext } from '../../../app/stores/rootStore';
import ActivityListItem from './ActivityListItem';

const ActivityList: React.FC = () => {
    const { activityStore: { activitiesByDate } } = useContext(rootStoreContext);
    return (
        <>
            {activitiesByDate.map(([group, activities]) => (
                <Fragment key={group}>
                    <Label size='large' color='blue'>
                        {group}
                    </Label>
                    <Item.Group divided>
                        {activities.map((activity: IActivity) => (
                            <ActivityListItem key={activity.id} activity={activity} />
                        ))}
                    </Item.Group>
                </Fragment>
            ))}
        </>
    );
};

export default observer(ActivityList);
