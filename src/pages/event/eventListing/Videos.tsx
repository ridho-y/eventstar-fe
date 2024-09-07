import React, { useEffect, useState } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

type VideoSliderProps = {
  videos: string[]
}

const Videos: React.FC<VideoSliderProps> = ({ videos }) => {
  const [embededLinks, setEmbededLinks] = useState<string[]>([]);
  useEffect(() => {
    setEmbededLinks(() => {
      return videos.map((v) => v.match(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?/)[6])
    })
  }, [])
  return (
    <>
    {embededLinks.map((v, i) => {
      return <><iframe key={i} className='aspect-video w-full' src={`https://www.youtube.com/embed/${v}`} title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"></iframe><br></br></>
    })}
    <br></br><br></br>
    </>
  )
};

export default Videos;
