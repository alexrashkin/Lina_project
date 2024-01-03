import styles from './style.module.css'
import { Container, LinkComponent } from '../index'

const Footer = () => {
  return <footer className={styles.footer}>
      <Container className={styles.footer__container}>
        <LinkComponent href='#' title='Художник Ангелина Хижняк' className={styles.footer__brand} />
        <p className={styles.footer__brand}>
          Все права защищены © {new Date().getFullYear()}
        </p>
      </Container>
  </footer>
}

export default Footer
