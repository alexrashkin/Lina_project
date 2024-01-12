import React, { useEffect, useState } from 'react';
import { Container, LinkComponent } from '../index';
import telegram_logo from '../../pages/artist/telegram.png';
import styles from './style.module.css';


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
        <LinkComponent href={telegramLink} title='Художник Ангелина Хижняк' className={styles.footer__brand} />
        <p className={styles.footer__brand}>
          Все права защищены © {new Date().getFullYear()}
        </p>
        <div className={styles.footer__brand}>
          <img src={telegram_logo} alt="Лого Телеграм" style={{ marginRight: '5px' }} />
          <a id="telegramLink" target="_blank" rel="noopener noreferrer">
                Телеграм
          </a>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
