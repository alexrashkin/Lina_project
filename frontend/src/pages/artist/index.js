import React, { useEffect } from 'react';
import { Container, Main } from '../../components';

import artist_photo from '../../pages/artist/artist.jpg';
import telegram_logo from '../../pages/artist/telegram.png';

const Artist = () => {
  const styles = {
    heading: {
      color: 'rgb(232, 240, 201)',
      marginBottom: '20px',
    },
    section: {
      marginBottom: '60px',
    },
    image: {
      maxWidth: '40%',
      height: 'auto',
      borderRadius: '8px',
      marginRight: '20px',
    },
    content: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'left',
      marginBottom: '40px',
    },
    mobileContent: {
      flexDirection: 'column', // Размещение элементов в колонку для мобильной версии
      alignItems: 'center', // Центрирование элементов
      textAlign: 'center', // Центрирование текста
    }
  };

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
    <Main>
      <Container>
        <div style={{...styles.content, ...(window.innerWidth <= 600 ? styles.mobileContent : {})}}>
          <img src={artist_photo} alt="Фото художника" className="artist-image" />
          <div>
            <h2 style={styles.heading}>Ангелина Игоревна Хижняк - профессиональный художник</h2>
            <p>Здравствуйте! Добро пожаловать на мой сайт-портфолио. Здесь Вы можете ознакомиться с информацией обо мне и увидеть мои работы. Приятного просмотра!</p>
          </div>
        </div>
        <div style={{ ...styles.section, marginBottom: '40px', marginTop: '35px' }}>
          <strong>Коротко обо мне:</strong>
          <p>Мой опыт работы составляет более 10 лет.</p>
          <p>Работаю в разных стилях: от простой абстракции до гиперреализма. В работе использую технику аэрографии.</p>
        </div>
        <p>Пишу неповторимые картины любого размера под Ваш интерьер, в единственном экземпляре. А так же, с удовольствием выполню другую индивидуальную работу по Вашему заказу (например, художественная роспись стен, мебели, предметов интерьера).</p>
        <p>В работе использую только качественные материалы.</p>
        <div style={{ ...styles.section, marginBottom: '40px', marginTop: '35px' }}>
          <p>Все представленные на сайте работы выполнены мной и находятся в частных коллекциях как в России, так и зарубежом.</p>
          <strong>Образование:</strong>
          <p>Художественная школа г. Ставрополь (2003 - 2013 гг.)</p>
          <p>Санкт-Петербургский государственный университет промышленных технологий и дизайна (2013 - 2019 гг.)</p>
          <p>Первый Центр Аэрографии г. Санкт-Петербург (2016 - 2017 гг.)</p>
        </div>
        <div style={styles.section}>
          <strong>Контакты:</strong>
          <p><strong>Оформить индивидуальный заказ, задать вопрос или оставить отзыв на работу можно тут:</strong></p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <a style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'blue', fontFamily: 'Arial', fontWeight: 500, fontSize: '16px' }} id="telegramLink" target="_blank" rel="noopener noreferrer">
              <img src={telegram_logo} alt="Лого Телеграм" style={{ marginRight: '5px', marginBottom: '15px' }} />
              <p>Telegram</p>
            </a>
          </div>
          <p>Или по электронной почте: <a href="mailto:linasvs@mail.ru">linasvs@mail.ru</a></p>
        </div>
      </Container>
    </Main>
  );
};

export default Artist;