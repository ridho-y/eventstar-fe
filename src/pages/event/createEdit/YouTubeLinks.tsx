import React, { useState } from 'react';
import { Form, Input } from 'antd';
import { Validation } from 'pages/profile/Information';
import CloseIcon from '@mui/icons-material/Close';
import DefaultButton from 'components/DefaultButton';

type YouTubeLinksProps = {
  youTubeLinks: string[]
  setYouTubeLinks: React.Dispatch<React.SetStateAction<string[]>>
}

const YouTubeLinks: React.FC<YouTubeLinksProps> = ({ youTubeLinks, setYouTubeLinks }) => {
  const [youTubeLinksStatusMsg, setYouTubeLinksStatusMsg] = useState<Validation>({ status: '', msg: '' });
  const [youtubeInput, setYoutubeInput] = useState('');
  const inputYoutube = () => {
    if (youtubeInput === '') {
    } else if (youTubeLinks.includes(youtubeInput)) {
      setYouTubeLinksStatusMsg({ status: 'error', msg: 'This link has already been added' });
    } else if (!(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/g.test(youtubeInput))) {
      setYouTubeLinksStatusMsg({ status: 'error', msg: 'Invalid YouTube link' });
    } else {
      setYouTubeLinks((y) => [...y, youtubeInput])
      setYoutubeInput('');
      setYouTubeLinksStatusMsg({ status: '', msg: '' });
    }
  }

  return (
    <>
      <p className='text-h5 md:text-h5-md pt-2 pl-[3px] text-primary-light'>Youtube Links</p>
      <Form.Item
        validateStatus={`${youTubeLinksStatusMsg.status}`}
        help={youTubeLinksStatusMsg.msg}
        className='!text-h5 !md:text-h5-md'
        hasFeedback
      >
        {youTubeLinks.map((y, i) => (
          <div key={i} className='rounded bg-gray-200 py-2 px-3 flex flex-row w-full mb-2 items-center justify-between'>
            <a className='inline-block' target='__blank' href={y}><p className='text-blue-600 underline flex-1 text-h4 md:text-h4-md' key={i}>{y}</p></a>
            <CloseIcon className='cursor-pointer' onClick={() => {
              setYouTubeLinks(youTubeLinks.filter((x) => x !== y))
            }} fontSize='small' />
          </div>
        ))}
        <span className='flex flex-row md:justify-between items-center'>
          <Input size="large" placeholder="Youtube link" className='text-h4 md:text-h4-md pb-2 w-full mr-5' onPressEnter={inputYoutube} onChange={(e) => setYoutubeInput(e.target.value)} value={youtubeInput} />
          <DefaultButton onClick={inputYoutube}>Add YouTube Link</DefaultButton>
        </span>
       </Form.Item>
    </>
  )
};

export default YouTubeLinks;
