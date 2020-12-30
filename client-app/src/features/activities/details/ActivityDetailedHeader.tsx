import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Button, Header, Item, Segment, Image } from 'semantic-ui-react';
import { IActivity } from '../../../app/models/activity';
import { rootStoreContext } from '../../../app/stores/rootStore';

const activityImageStyle = {
    filter: 'brightness(30%)'
};

const activityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface IProps {
    activity: IActivity
};

const ActivityDetailedHeader: React.FC<IProps> = ({ activity: { id, category, title, date, isHost, isGoing } }) => {
    const { activityStore: { attendActivity, unattendActivity, loading } } = useContext(rootStoreContext);
    return (
        <Segment.Group>
            <Segment basic attached='top' style={{ padding: '0' }}>
                <Image src={`/assets/categoryImages/${category}.jpg`} fluid style={activityImageStyle} />
                <Segment basic style={activityImageTextStyle}>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={title}
                                    style={{ color: 'white' }}
                                />
                                <p>{format(date, 'eeee do MMMM')}</p>
                                <p>
                                    Hosted by <strong>Bob</strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                {isHost ?
                    (
                        <Button as={Link} to={`/manage/${id}`} color='orange' floated='right'>
                            Manage Event
                        </Button>
                    ) :
                    isGoing ?
                    (
                        <Button onClick={unattendActivity} loading={loading}>
                            Cancel attendance
                        </Button>
                    ) :
                    (
                        <Button color='teal' onClick={attendActivity} loading={loading}>
                            Join Activity
                        </Button>
                    )}
            </Segment>
        </Segment.Group>
    );
};

export default observer(ActivityDetailedHeader);
