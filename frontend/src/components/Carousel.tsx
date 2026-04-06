import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Carousel: React.FC = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 700,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        arrows: true,
    };

    const images = [
        `${import.meta.env.VITE_IMAGE_URL}/Carousel/slide1.jpg`,
        `${import.meta.env.VITE_IMAGE_URL}/Carousel/slide2.jpg`,
        `${import.meta.env.VITE_IMAGE_URL}/Carousel/slide3.jpg`,
        `${import.meta.env.VITE_IMAGE_URL}/Carousel/slide4.jpg`,
        `${import.meta.env.VITE_IMAGE_URL}/Carousel/slide5.jpg`,
    ];

    return (
        <div className="relative w-full shadow-lg">
            <Slider {...settings}>
                {images.map((image, index) => (
                    <div key={index} className="relative h-56 md:h-96">
                        <img
                            src={image}
                            alt={`Slide ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Carousel;
