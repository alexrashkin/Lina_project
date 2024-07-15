import React, { useEffect, useState } from 'react';
import { Container } from '../index';
import telegram_logo from '../../pages/artist/telegram.png';
import styles from './style.module.css';
import { Link } from 'react-router-dom'
import cn from 'classnames'

const Footer = () => {
  const [telegramLink, setTelegramLink] = useState('');

  useEffect(() => {
    const isMobile = window.matchMedia('only screen and (max-width: 600px)').matches;
    const linkValue = isMobile ? 'https://t.me/angelinasvs777' : 'https://web.telegram.org/k/#@angelinasvs777';
    
    setTelegramLink(linkValue);
  }, []); 

const handleTelegramClick = () => {
  window.open(telegramLink, '_blank');
}

  return (
    <footer className={styles.footer}>
      <Container className={styles.footer__container}>
        <Link exact
              to={{ pathname: telegramLink }} 
              target="_blank"
              className={cn(styles.link,styles.footer__brand)}
              >
                Художник Ангелина Игоревна
        </Link>
        {telegramLink && (
          <div className={styles.footer__brand} onClick={handleTelegramClick} style={{ fontFamily: 'Arial' }}>
            <img src={telegram_logo} alt="Logo Telegram" className={styles.footer__icon} />
            <span
              title='Telegram'
            >
              Telegram
            </span>
        </div>
        )}
        <p className={styles.footer__brand}>
          Все права защищены © {new Date().getFullYear()}
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
