import React, { useState } from 'react';
import { Container } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import { useEffect } from 'react';
import { NavBar } from '../../features/nav/NavBar';
import { ActivityDashboard } from '../../features/activities/dashboard/ActivityDashboard';
import axios from 'axios';

const App: React.FC = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    handleGetActivities();
  }, []);

  const handleGetActivities = async (): Promise<void> => {
    const { data } = await axios.get<IActivity[]>('http://localhost:5000/api/activities');
    const acts = data.map((act: IActivity): IActivity => {
      act.date = act.date.split('.')[0];
      return act;
    });
    setActivities(acts);
  };

  const handleSelectAcitvity = (id: string): void => {
    setSelectedActivity(activities.filter((activity: IActivity) => activity.id === id)[0]);
    setEditMode(false);
  };

  const handleOpenCreateForm = (): void => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCreateActivity = (activity: IActivity) => {
    setActivities([...activities, activity]);
    setSelectedActivity(activity);
    setEditMode(false);
  };

  const handleEditActivity = (activity: IActivity) => {
    setActivities([...activities.filter((act: IActivity) => act.id !== activity.id), activity]);
    setSelectedActivity(activity);
    setEditMode(false);
  };

  const handleDeleteActivity = (id: string) => {
    setActivities([...activities.filter((act: IActivity) => act.id !== id)]);
    setSelectedActivity(null);
    setEditMode(false);
  };

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
          deleteActivity={handleDeleteActivity} />
      </Container>
    </>
  )
};

export default App;
