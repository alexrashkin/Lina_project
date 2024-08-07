import React, { useEffect, useState } from 'react';
import { Container, Main } from '../../components';
import artist_photo from '../../pages/artist/artist.jpg';
import telegram_logo from '../../pages/artist/telegram.png';
import './Artist.css'; // Импортируйте CSS файл

const Artist = () => {
  const [telegramLink, setTelegramLink] = useState('');

  useEffect(() => {
    const isMobile = window.matchMedia('only screen and (max-width: 600px)').matches;
    setTelegramLink(isMobile ? 'https://t.me/angelinasvs777' : 'https://web.telegram.org/k/#@angelinasvs777');
  }, []);

  return (
    <Main>
      <Container>
        <div className="wrapper">
          <img src={artist_photo} alt="Фото художника" className="image" />
          <h3 className="heading">Ангелина Игоревна Хижняк - профессиональный художник</h3>
          <p>Здравствуйте! Добро пожаловать на мой сайт-портфолио. Здесь Вы можете ознакомиться с информацией обо мне и увидеть мои работы. Приятного просмотра!</p>
          <section className="about">
            <strong className="strong">Коротко обо мне:</strong>
            <p>Мой опыт работы составляет более 10 лет.</p>
            <p>Работаю в разных стилях: от простой абстракции до гиперреализма. В работе использую технику аэрографии.</p>
            <p>Пишу неповторимые картины любого размера под Ваш интерьер, в единственном экземпляре. Также выполню индивидуальную работу по Вашему заказу (например, художественная роспись стен, мебели, предметов интерьера).</p>
            <p>В работе использую только качественные материалы.</p>
            <p>Все представленные на сайте работы выполнены мной и находятся в частных коллекциях как в России, так и зарубежом.</p>
            <strong className="strong">Образование:</strong>
            <p>Художественная школа г. Ставрополь (2003 - 2013 гг.)</p>
            <p>Санкт-Петербургский государственный университет промышленных технологий и дизайна (2013 - 2019 гг.)</p>
            <p>Первый Центр Аэрографии г. Санкт-Петербург (2016 - 2017 гг.)</p>
          </section>
          <section className="contact">
            <strong className="strong">Контакты:</strong>
            <p>Оформить индивидуальный заказ, задать вопрос или оставить отзыв на работу можно тут:</p>
            <a className="telegramLink" href={telegramLink} target="_blank" rel="noopener noreferrer" aria-label="Связаться через Telegram">
              <img src={telegram_logo} alt="Логотип Telegram" />
              Telegram
            </a>
            <p className="contactInfo">Или по электронной почте: <a href="mailto:linasvs@mail.ru">linasvs@mail.ru</a></p>
          </section>
        </div>
      </Container>
    </Main>
  );
};

export default Artist;