import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Autoplay, Navigation } from "swiper";

type ImageSliderProps = {
  images: string[] | []
}

type ImgProps = {
  img: string
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  if (images.length > 0) {
    return (
      <>
        <div className='w-full'>
          <Swiper
            pagination={true}
            navigation={true}
            modules={[Pagination, Navigation, Autoplay]}
            className="mySwiper"
            slidesPerGroup={1}
            loop={true}
            autoplay={{
              delay: 10000,
              disableOnInteraction: false,
            }}
          >
            {images.map((img, i) => {
              return <SwiperSlide key={i}><Img img={img} /></SwiperSlide>
            })}
          </Swiper>
        </div>
        <br></br><br></br>
      </>
    )
  } else {
    return <></>
  }
};

const Img: React.FC<ImgProps> = ({ img }) => {
  return (
    <div className='container'>
      <span className='w-full relative inline-block'>
        <img src={img} className='pic relative inline-block'></img>
      </span>
      <img src={img} className='bg'></img>
    </div>

  // <SwiperSlide><img src={img} /></SwiperSlide>
  )
}

export default ImageSlider;
