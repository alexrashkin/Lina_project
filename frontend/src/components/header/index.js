import { Particles } from 'react-tsparticles';

import styles from './style.module.css';
import { Nav, AccountMenu } from '../index.js';
import Container from '../container';

const Header = ({ loggedIn, isSuperuser, onSignOut, orders }) => {
  console.log('Rendering Header with Particles');
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.headerContent}>
          <Nav loggedIn={loggedIn} orders={orders} isSuperuser={isSuperuser} />
          <AccountMenu onSignOut={onSignOut} />
        </div>
        <Particles
          params={{
            particles: {
              number: {
                value: 80,
              },
              size: {
                value: 3,
              },
            },
            interactivity: {
              events: {
                onhover: {
                  enable: true,
                  mode: 'repulse',
                },
              },
            },
          }}
        />
      </Container>
    </header>
  );
};

export default Header
