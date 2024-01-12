import React, { useEffect } from 'react';
import { Container, LinkComponent } from 'react-router-dom';

import styles from './style.module.css';
import telegramLogo from '../../pages/artist/telegram.png';

const Footer = () => {
  useEffect(() => {
    const isMobile = window.matchMedia('only screen and (max-width: 600px)').matches;
    const telegramLink = document.getElementById('telegramLink');

    if (isMobile) {
      telegramLink.href = 'https://t.me/angelinasvs777';
    } else {
      telegramLink.href = 'https://web.telegram.org/k/#@angelinasvs777';
    }
  }, []);

  return (
    <footer className={styles.footer}>
      <Container className={styles.footer__container}>
        <LinkComponent to="#" title="Художник Ангелина Хижняк" className={styles.footer__brand} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={telegramLogo} alt="Лого Телеграм" style={{ marginRight: '5px' }} />
          <a id="telegramLink" target="_blank" rel="noopener noreferrer">
            Телеграм
          </a>
        </div>
        <p className={styles.footer__brand}>
          Все права защищены © {new Date().getFullYear()}
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
