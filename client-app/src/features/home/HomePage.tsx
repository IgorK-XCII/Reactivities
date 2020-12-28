import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Button, Container, Header, Segment, Image } from 'semantic-ui-react'
import { rootStoreContext } from '../../app/stores/rootStore';
import LoginForm from '../user/LoginForm';
import RegisterForm from '../user/RegisterForm';

const HomePage: React.FC = () => {
    const {
        userStore: { isLogIn, user },
        modalStore: { openModal }
    } = useContext(rootStoreContext);
    return (
        <Segment inverted textAlign='center' vertical className='masthead' >
            <Container text>
                <Header as='h1' inverted>
                    <Image size='massive' src='/assets/logo.png' alt='logo' style={{ marginBottom: 12 }} />
                        Reactivities
                    </Header>
                {isLogIn ? (
                    <>
                        <Header
                            as='h2'
                            inverted
                            content={`Welcome back ${user?.displayName}`}
                        />
                        <Button
                            as={Link}
                            to='/activities'
                            size='huge'
                            inverted>
                            Go to activities!
                        </Button>
                    </>

                ) : (
                    <>
                        <Header
                            as='h2'
                            inverted
                            content='Welcome to Reactivities'
                        />
                        <Button
                            onClick={() => openModal(<LoginForm />)}
                            size='huge'
                            inverted>
                            Login
                        </Button>
                        <Button
                            onClick={() => openModal(<RegisterForm />)}
                            size='huge'
                            inverted>
                            Register
                        </Button>
                    </>
                )}
            </Container>
        </Segment >
    );
};

export default HomePage
