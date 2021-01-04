import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext, useEffect } from 'react';
import { Segment, Header, Form, Button, Comment } from 'semantic-ui-react';
import { rootStoreContext } from '../../../app/stores/rootStore';
import { Form as FinalForm, Field } from 'react-final-form';
import { IComment } from '../../../app/models/activity';
import { Link } from 'react-router-dom';
import TextAreaInput from '../../../app/common/form/TextAreaInput';
import { formatDistance } from 'date-fns';

const ActivityDetailedChat = () => {
  const { activityStore: {
    createHubConnection,
    stopHubConnection,
    addComment,
    activity
  } } = useContext(rootStoreContext);

  useEffect(() => {
    createHubConnection(activity!.id);
    return stopHubConnection;
  }, [createHubConnection, stopHubConnection, activity])

  return (
    <Fragment>
      <Segment
        textAlign='center'
        attached='top'
        inverted
        color='teal'
        style={{ border: 'none' }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached>
        <Comment.Group>
          {activity?.comments?.map((comment: IComment) => {
            const { displayName, body, image, username, createdAt, id } = comment;
            return (
              <Comment key={id}>
                <Comment.Avatar src={image || '/assets/user.png'} />
                <Comment.Content>
                  <Comment.Author as={Link} to={`/profile/${username}`}>{displayName}</Comment.Author>
                  <Comment.Metadata>
                    <div>{formatDistance(createdAt, new Date())}</div>
                  </Comment.Metadata>
                  <Comment.Text>{body}</Comment.Text>
                </Comment.Content>
              </Comment>
            );
          })}
          <FinalForm
            onSubmit={addComment}
            render={({ handleSubmit, submitting, form }) => (
              <Form onSubmit={() => handleSubmit()?.then(() => form.reset())}>
                <Field
                  name='body'
                  component={TextAreaInput}
                  rows={2}
                  placeholder='Add you comment'
                />
                <Button
                  content='Add Reply'
                  labelPosition='left'
                  icon='edit'
                  primary
                  loading={submitting}
                />
              </Form>
            )}
          />
        </Comment.Group>
      </Segment>
    </Fragment>
  );
};

export default observer(ActivityDetailedChat);
