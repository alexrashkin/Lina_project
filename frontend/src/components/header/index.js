import styles from './style.module.css'
import { Nav, AccountMenu } from '../index.js'
import Container from '../container'

const Header = ({ loggedIn, isSuperuser, onSignOut, orders }) => {
  return <header
    className={styles.header}
  >
    <Container>
      <div className={styles.headerContent}>
        <Nav loggedIn={loggedIn} orders={orders} isSuperuser={isSuperuser} />
        <AccountMenu onSignOut={onSignOut} />
      </div>
    </Container>
  </header>
}

export default Header
