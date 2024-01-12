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
        <LinkComponent to="/artist" className={styles.footer__brand}>
          Художник Ангелина Хижняк
        </LinkComponent>
        <div className={styles.footer__brand}>
          Все права защищены © {new Date().getFullYear()}
        </div>
        <div className={styles.footer__brand}>
          <LinkComponent
            to={{ pathname: telegramLink }}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.telegramLink}
          >
            Телеграм
          </LinkComponent>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
