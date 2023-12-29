import React from 'react';
import { Container, Main } from '../../components';

import artist_photo from '../../pages/artist/artist.jpg';

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
          <h2 style={headingStyle}>Ангелина Хижняк - профессиональный художник &#127912;</h2>
          <br></br>
          <div style={sectionStyle}>
            <strong>Образование:</strong>
            <p>Санкт-Петербургский государственный университет промышленных технологий и дизайна (2013 - 2019)</p>
            <p>Художественная школа г. Ставрополь (2003 - 2013)</p>
          </div>
          <div style={sectionStyle}>
            <strong>Мои услуги:</strong>
            <p>Роспись стен</p>
            <p>Картины любой сложности и размера</p>
            <p>Кастомизация наушников и не только</p>
          </div>
          <div style={sectionStyle}>
            <strong>Контакты:</strong>
            <p>Задать вопрос, оставить отзыв на работу или оформить индивидуальный заказ можно в Telegram &#128073; @angelinasvs777</p>
            <p>А также в WhatsApp или по телефону 📞 +7(981)126-46-77</p>
          </div>
        </div>
      </Container>
    </Main>
  );
};

export default Artist;