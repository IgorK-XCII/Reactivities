import { observer } from 'mobx-react-lite';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Segment, List, Item, Label, Image } from 'semantic-ui-react';
import { IAttendee } from '../../../app/models/activity';

interface IProps {
  attendees: IAttendee[]
}

const ActivityDetailedSidebar: React.FC<IProps> = ({ attendees }) => {
  return (
    <Fragment>
      <Segment
        textAlign='center'
        style={{ border: 'none' }}
        attached='top'
        secondary
        inverted
        color='teal'
      >
        {`${attendees.length} People Going`}
      </Segment>
      <Segment attached>
        <List relaxed divided>
          {attendees.map(({ username, displayName, image, isHost, following }) => (
            <Item
              key={username}
              style={{ position: 'relative' }}
            >
              {isHost &&
                (<Label
                  style={{ position: 'absolute' }}
                  color='orange'
                  ribbon='right'
                >
                  Host
                </Label>)}
              <Image size='tiny' src={image || '/assets/user.png'} />
              <Item.Content verticalAlign='middle'>
                <Item.Header as='h3'>
                  <Link to={`/profile/${username}`}>{displayName}</Link>
                </Item.Header>
                {following &&
                  <Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>}
              </Item.Content>
            </Item>
          ))}
        </List>
      </Segment>
    </Fragment>
  );
};

export default observer(ActivityDetailedSidebar);
