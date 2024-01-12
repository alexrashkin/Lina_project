import React, { useEffect, useState } from 'react';
import { Container, LinkComponent } from '../index';
import styles from './style.module.css';

const Footer = () => {
  const [telegramLink, setTelegramLink] = useState('');

  useEffect(() => {
    const isMobile = window.matchMedia('only screen and (max-width: 600px)').matches;
    const telegramUsername = 'angelinasvs777';

    if (isMobile) {
      setTelegramLink(`https://t.me/${telegramUsername}`);
    } else {
      setTelegramLink(`https://web.telegram.org/k/#@${telegramUsername}`);
    }
  }, []);

  return (
    <footer className={styles.footer}>
      <Container className={styles.footer__container}>
        <LinkComponent href='#' title='Художник Ангелина Хижняк'
          className={styles.footer__brand} />
        <p className={styles.footer__brand}>
          Все права защищены © {new Date().getFullYear()}
        </p>
        <p>
          <div className={styles.footer__brand}>
            <LinkComponent
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Телеграм
            </LinkComponent>
          </div>
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
