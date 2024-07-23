import React, { useEffect } from 'react';
import { Container, Main } from '../../components';

import artist_photo from '../../pages/artist/artist.jpg';
import telegram_logo from '../../pages/artist/telegram.png';

const Artist = () => {
  const headingStyle = {
    color: 'beige',
    marginBottom: '40px',
    textAlign: 'center',
  };

  const sectionStyle = {
    marginBottom: '60px',
  };

  const imageStyle = {
    maxWidth: '40%',
    height: 'auto',
    borderRadius: '8px',
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
        <div style={{ textAlign: 'center' }}>
          <img src={artist_photo} alt="Фото художника" style={imageStyle} />
          <h2 style={headingStyle}>Ангелина Игоревна Хижняк - профессиональный художник</h2>
          <p>Здравствуйте! Добро пожаловать на мой сайт-портфолио. Здесь Вы можете ознакомиться с информацией обо мне и увидеть мои работы. Приятного просмотра!</p>
          <div style={{sectionStyle, marginBottom: '40px', marginTop: '35px'}}>
            <strong>Коротко обо мне:</strong>
          <p>Мой опыт работы составляет более 10 лет.</p>
          <p>Работаю в разных стилях: от простой абстракции до гиперреализма. В работе использую технику аэрография.</p>
          </div>
          <p>Пишу неповторимые картины любого размера под Ваш интерьер, в единственном экземпляре. А так же, с удовольствием выполню другую индивидуальную работу по Вашему заказу (например, художественная роспись стен, мебели, предметов интерьера).</p>
          <p>В работе использую только качественные материалы.</p>
          <p>Все представленные на сайте работы выполнены мной и находятся в частных коллекциях как в России, так и зарубежом.</p>
            <strong>Образование:</strong>
            <p>Художественная школа г. Ставрополь (2003 - 2013 гг.)</p>
            <p>Санкт-Петербургский государственный университет промышленных технологий и дизайна (2013 - 2019 гг.)</p>
            <p>Первый Центр Аэрографии г. Санкт-Петербург (2016 - 2017 гг.)</p>
          <div style={sectionStyle}>
            <strong>Контакты:</strong>
              <p><strong>Оформить индивидуальный заказ, задать вопрос или оставить отзыв на работу можно тут:</strong></p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <a style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial' }} id="telegramLink" target="_blank" rel="noopener noreferrer">
              <img src={telegram_logo} alt="Logo Telegram" style={{ marginRight: '5px', marginBottom: '15px' }} />
                <p>Telegram</p>
              </a>
            </div>
            <p>Или по электронной почте: <a href="mailto:linasvs@mail.ru">linasvs@mail.ru</a></p>
          </div>
        </div>
      </Container>
    </Main>
  );
};

export default Artist;
