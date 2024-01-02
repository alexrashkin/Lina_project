import React from 'react';
import { Container, Main } from '../../components';

import artist_photo from '../../pages/artist/artist.jpg';
import telegram_logo from '../../pages/artist/telegram.png';

const Artist = () => {
  const headingStyle = {
    color: '#3e3e3e',
    marginBottom: '20px',
    textAlign: 'center',
  };

  const sectionStyle = {
    marginBottom: '20px',
  };

  const imageStyle = {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px',
  }

  return (
    <Main>
      <Container>
        <div style={{ textAlign: 'center' }}>
          <img src={artist_photo} alt="Фото художника" style={imageStyle} />
          <h2 style={headingStyle}>Ангелина Хижняк - профессиональный художник</h2>
          <p>Выполню художественную роспись на стенах, мебели, рамах и предметах интерьера только материалами высшего качества.</p>
          <p>Мой опыт работы составляет более 15 лет, за это время неоднократно принимала участие и становилась победителем в творческих конкурсах.</p>
          <p>Работаю в разных стилях: от простой абстракции до гиперреализма.</p>
          <p>Напишу неповторимую картину под Ваш интерьер любого размера в единственном экземпляре.</p>
          <p>Так же кастомизирую разнообразные предметы и технику, например, наушники AirPods, консоли PlayStation, джойстики, статуэтки, шлемы и др.</p>
          <div style={sectionStyle}>
            <strong>Образование:</strong>
            <p>Санкт-Петербургский государственный университет промышленных технологий и дизайна (2013 - 2019)</p>
            <p>Художественная школа г. Ставрополь (2003 - 2013)</p>
            <p>Первый Центр Аэрографии г. Санкт-Петербург (2016 - 2017)</p>
          </div>
          <div style={sectionStyle}>
            <strong>Контакты:</strong>
            <p>Задать вопрос, оставить отзыв на работу или оформить индивидуальный заказ можно в Telegram</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={telegram_logo} alt="Лого Телеграм" style={{ marginRight: '5px' }} />
              <span>@angelinasvs777</span>
            </div>
          </div>
        </div>
      </Container>
    </Main>
  );
};

export default Artist;