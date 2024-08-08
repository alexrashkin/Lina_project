import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';

const ImageCarousel = ({ images }) => {
    if (!images || images.length === 0) return null;

    return (
        <Carousel>
            {images.map((imgObj, index) => (
                <Carousel.Item key={index}>
                    <img
                        className="d-block w-100"
                        src={imgObj.image}
                        alt={`Slide ${index}`}
                        style={{ objectFit: 'cover', imageRendering: 'auto' }}
                        loading="lazy"
                    />
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export default ImageCarousel;