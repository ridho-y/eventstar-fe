import React, { useContext, useEffect, useState } from 'react';
import { isMobileWidth } from 'utils/media';
import TopEvents from 'components/home/TopEvents';
import MoreEvents from 'components/home/MoreEvents';
import { Context } from 'Router';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Pagination, Autoplay, Navigation } from "swiper";

const HomePage: React.FC = () => {
  const [deviceType, setDeviceType] = useState('');
  const { setters } = useContext(Context);

  useEffect(() => {
    setters.setIsSearchPage(false);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (isMobileWidth()) setDeviceType('mobile');
      else setDeviceType('desktop');
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <section className="content">
        <br></br>
        <div className="flex flex-col w-full max-w-screen-xl 2xl:max-w-screen-2xl mx-auto px-5">
          <br></br>
          <div className='w-full h-[150px] md:h-[300px]'>
            <Swiper
              modules={[Pagination, Autoplay]}
              className="mySwiper h-full m-0 !w-full"
              slidesPerGroup={1}
              loop={true}
              autoplay={{
                delay: 10000,
                disableOnInteraction: false,
              }}
            >
              <SwiperSlide className='!w-full'><img src={require('../../assets/banner.png')} className=' w-full h-[150px] md:h-[300px] object-cover rounded-lg border-[1px] border-gray-300'></img></SwiperSlide>
              <SwiperSlide className='!w-full'><img src={require('../../assets/gaming.png')} className=' w-full h-[150px] md:h-[300px] object-cover rounded-lg border-[1px] border-gray-300'></img></SwiperSlide>
              <SwiperSlide className='!w-full'><img src={require('../../assets/discover.png')} className=' w-full h-[150px] md:h-[300px] object-cover rounded-lg border-[1px] border-gray-300'></img></SwiperSlide>
              <SwiperSlide className='!w-full'><img src={require('../../assets/foodie.png')} className=' w-full h-[150px] md:h-[300px] object-cover rounded-lg border-[1px] border-gray-300'></img></SwiperSlide>
            </Swiper>
          </div>


          <br></br>
          <TopEvents />
          <br></br>
          <div className='w-full h-[100px] md:h-[200px]'>
            <Swiper
              modules={[Pagination, Autoplay]}
              className="mySwiper h-full m-0 !w-full"
              slidesPerGroup={1}
              loop={true}
              autoplay={{
                delay: 10000,
                disableOnInteraction: false,
              }}
            >
              <SwiperSlide className='!w-full'><img src={require('../../assets/explore_enjoy.png')} className='w-full h-[100px] md:h-[200px] object-cover rounded-lg border-[1px] border-gray-300'></img></SwiperSlide>
              <SwiperSlide className='!w-full'><img src={require('../../assets/summer.png')} className='w-full h-[100px] md:h-[200px] object-cover rounded-lg border-[1px] border-gray-300'></img></SwiperSlide>
              <SwiperSlide className='!w-full'><img src={require('../../assets/travel.png')} className='w-full h-[100px] md:h-[200px] object-cover rounded-lg border-[1px] border-gray-300'></img></SwiperSlide>
            </Swiper>
          </div>
          <br></br>
          <br></br>
          <MoreEvents />
          <br></br><br></br>
        </div>
      </section>
    </>
  );
};

export default HomePage;
