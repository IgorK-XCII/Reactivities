import React, { useContext } from 'react';
import { Container } from 'semantic-ui-react';
import { useEffect } from 'react';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import NotFound from './NotFound';
import { ToastContainer } from 'react-toastify';
import { rootStoreContext } from '../stores/rootStore';
import LoginForm from '../../features/user/LoginForm';
import { LoadingComponent } from './LoadingComponent';
import ModalContainet from '../common/modals/ModalContainet';

const App: React.FC<RouteComponentProps> = ({ location }) => {
  const {
    commonStore: { setAppLoaded, token, appLoaded },
    userStore: { getUser }
  } = useContext(rootStoreContext);

  useEffect(() => {
    if (token) {
      getUser().finally(() => setAppLoaded())
    } else {
      setAppLoaded();
    }
  }, [token, setAppLoaded, getUser]);

  if (!appLoaded) return <LoadingComponent content='Loading app...' />

  return (
    <>
      <ModalContainet />
      <ToastContainer position='bottom-right' />
      <Route exact path='/' component={HomePage} />
      <Route path={'/(.+)'} render={() => (
        <>
          <NavBar />
          <Container style={{ marginTop: '7em' }}>
            <Switch>
              <Route
                exact
                path='/activities'
                component={ActivityDashboard}
              />
              <Route
                path='/activities/:id'
                component={ActivityDetails}
              />
              <Route
                key={location.key}
                path={['/createActivity', '/manage/:id']}
                component={ActivityForm}
              />
              <Route
                path='/login'
                component={LoginForm}
              />
              <Route component={NotFound} />
            </Switch>
          </Container>
        </>
      )} />
    </>
  );
};

export default withRouter(observer(App));