import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Space, Input, Tag, Tooltip, theme, Form } from 'antd';
import { Validation } from 'pages/profile/Information';

type TagsProps = {
  tags: string[]
  setTags: React.Dispatch<React.SetStateAction<string[]>>
  tagsStatusMsg: Validation
  setTagsStatusMsg: React.Dispatch<React.SetStateAction<Validation>>
}

const TagsAntd: React.FC<TagsProps> = ({ tags, setTags, tagsStatusMsg }) => {
  const { token } = theme.useToken();
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [inputValue]);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setInputValue('');
  };

  const tagInputStyle: React.CSSProperties = {
    width: 78,
    verticalAlign: 'top',
    justifyContent: 'center',
  };

  const tagPlusStyle: React.CSSProperties = {
    background: token.colorBgContainer,
    borderStyle: 'dashed',
    fontSize: '14px',
  };

  return (
    <>
      <p className='text-h5 md:text-h5-md pt-2 pl-[3px] text-primary-light'>Tags</p>
      <Form.Item
        className='!text-h5 !md:text-h5-md'
        validateStatus={tagsStatusMsg.status}
        help={tagsStatusMsg.msg}
      >
        <Space size={[0, 8]} wrap>
          <Space size={[0, 8]} wrap>
            {tags.map((tag, index) => {
              if (editInputIndex === index) {
                return (
                  <Input
                    ref={editInputRef}
                    key={tag}
                    size="small"
                    style={tagInputStyle}
                    value={editInputValue}
                    onChange={handleEditInputChange}
                    onBlur={handleEditInputConfirm}
                    onPressEnter={handleEditInputConfirm}
                  />
                );
              }
              const isLongTag = tag.length > 20;
              const tagElem = (
                <Tag
                  key={tag}
                  closable={true}
                  className='text-h3 md:text-h3 flex flex-row justify-center items-center px-3 py-1'
                  style={{ userSelect: 'none' }}
                  onClose={() => handleClose(tag)}
                >
                  <span className='flex-1 justify-center items-center font-normal'
                    onDoubleClick={(e) => {
                      if (index !== 0) {
                        setEditInputIndex(index);
                        setEditInputValue(tag);
                        e.preventDefault();
                      }
                    }}
                  >
                    {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                  </span>
                </Tag>
              );
              return isLongTag
                ? (
                <Tooltip title={tag} key={tag}>
                  {tagElem}
                </Tooltip>
                  )
                : (
                    tagElem
                  );
            })}
          </Space>
          {inputVisible
            ? (
            <Input
              ref={inputRef}
              type="text"
              size="small"
              style={tagInputStyle}
              className='text-h4 md:text-h4-md'
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
              )
            : (
            <Tag style={tagPlusStyle} onClick={showInput} className='px-3 py-1 flex flex-row justify-center items-center hover:cursor-pointer'>
              <PlusOutlined className='mr-1' /> New Tag
            </Tag>
              )}
        </Space>
      </Form.Item>
    </>
  );
};

export default TagsAntd;
