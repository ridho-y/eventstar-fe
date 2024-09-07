import React from 'react';
import { Dropdown, Space } from 'antd';
import type { MenuProps } from 'antd';

type DropDownProps = {
  items: MenuProps['items'];
  content: React.ReactNode;
}

const DropDown: React.FC<DropDownProps> = ({ items, content }) => {
  return (
    <Dropdown menu={{ items }} trigger={['click']} className='right-2'>
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          {content}
        </Space>
      </a>
    </Dropdown>
  );
}

export default DropDown;
