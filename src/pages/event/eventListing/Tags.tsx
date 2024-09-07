import React from 'react';

type TagsProps = {
  tags: string[]
}

const Tags: React.FC<TagsProps> = ({ tags }) => {
  return (
    <div className='flex flex-row flex-wrap gap-3 justify-start'>
        {tags.map((t, i) => <span key={i} className='bg-gray-200 rounded-xl px-3 text-center text-h4 md:text-h4'>{t}</span>)}
    </div>
  )
};

export default Tags;
