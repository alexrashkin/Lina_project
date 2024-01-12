import React, { useEffect, useState } from 'react';
import { Container, LinkComponent } from '../index';
import telegram_logo from '../../pages/artist/telegram.png';
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
        <LinkComponent href={telegramLink} title='Художник Ангелина Хижняк' className={styles.footer__brand} />
        <p className={styles.footer__brand}>
          Все права защищены © {new Date().getFullYear()}
        </p>
        <div className={styles.footer__brand}>
          <img src={telegram_logo} alt="Лого Телеграм" style={{ marginRight: '5px' }} />
            <LinkComponent
              href={telegramLink}
              title='Телеграм'
              target="_blank"
              rel="noopener noreferrer"
            >
              Телеграм
            </LinkComponent>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
