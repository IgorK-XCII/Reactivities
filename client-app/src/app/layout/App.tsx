import React, { SyntheticEvent, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import { useEffect } from 'react';
import { NavBar } from '../../features/nav/NavBar';
import { ActivityDashboard } from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';
import { LoadingComponent } from './LoadingComponent';

const App: React.FC = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState('');

  useEffect(() => {
    handleGetActivities();
  }, []);

  const handleGetActivities = async (): Promise<void> => {
    const response = await agent.Activities.list();
    const acts = response.map((act: IActivity): IActivity => {
      act.date = act.date.split('.')[0];
      return act;
    });
    setActivities(acts);
    setLoading(false);
  };

  const handleSelectAcitvity = (id: string): void => {
    setSelectedActivity(activities.filter((activity: IActivity) => activity.id === id)[0]);
    setEditMode(false);
  };

  const handleOpenCreateForm = (): void => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCreateActivity = async (activity: IActivity) => {
    setSubmitting(true);
    await agent.Activities.create(activity);
    setActivities([...activities, activity]);
    setSelectedActivity(activity);
    setEditMode(false);
    setSubmitting(false);
  };

  const handleEditActivity = async (activity: IActivity) => {
    setSubmitting(true);
    await agent.Activities.edit(activity);
    setActivities([...activities.filter((act: IActivity) => act.id !== activity.id), activity]);
    setSelectedActivity(activity);
    setEditMode(false);
    setSubmitting(false);
  };

  const handleDeleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    await agent.Activities.remove(id);
    setActivities([...activities.filter((act: IActivity) => act.id !== id)]);
    setSelectedActivity(null);
    setEditMode(false);
    setSubmitting(false);
  };

  if (loading) return <LoadingComponent content='Loading activities...' />;

  return (
    <>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectAcitvity}
          selectedActivity={selectedActivity}
          editMOde={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
          target={target} />
      </Container>
    </>
  )
};

export default App;
