import React from 'react';
import { Header, Icon, List } from 'semantic-ui-react';

function App() {
  return (
    <div>
      <Header as='h2'>
        <Icon name='plug' />
        <Header.Content>Uptime Guarantee</Header.Content>
      </Header>

      <List>
        <List.Item>Apples</List.Item>
        <List.Item>Pears</List.Item>
        <List.Item>Oranges</List.Item>
      </List>
    </div>
  );
}

export default App;
