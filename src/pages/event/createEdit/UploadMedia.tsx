import React, { useEffect } from 'react';
import { Button, Form, Upload } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import { Validation } from 'pages/profile/Information';

// New interface to encode images to base64
export interface UploadFile2 extends UploadFile {
  base64?: string;
}

type UploadMediaProps = {
  images: string[]
  setImages: React.Dispatch<React.SetStateAction<string[]>>
  fileList: UploadFile2[]
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>
  imagesStatusMsg: Validation
  setImagesStatusMsg: React.Dispatch<React.SetStateAction<Validation>>
}

const UploadMedia: React.FC<UploadMediaProps> = ({ images, fileList, setFileList, imagesStatusMsg }) => {
  // Images
  useEffect(() => {
    setFileList(() => {
      const newFileList = []
      for (let i = 0; i < images.length; i++) {
        newFileList.push({
          uid: i.toString(),
          url: images[i],
          name: `Image ${i}`,
        })
      }
      return newFileList
    })
  }, [images])

  const newUpload = (info: any) => {
    let fileList = [...info.fileList];
    fileList.forEach(function (file) {
      if (file.originFileObj !== undefined) {
        let reader = new FileReader();
        reader.onload = (e) => {
          file.base64 = e.target.result;
        };
        reader.readAsDataURL(file.originFileObj);
      }
    });
    setFileList(fileList);
  };

  return (
    <>
      <p className='text-h5 md:text-h5-md pt-2 pl-[3px] text-primary-light'>Upload Media</p>
      <p className='text-h6 md:text-h6-md pl-[3px] mb-2'>The first image uploaded will be the thumbnail of your listing. Only 3 images can be uploaded.</p>
      <Form.Item
        className='!text-h5 !md:text-h5-md'
        name="fileList"
        validateStatus={imagesStatusMsg.status}
        help={imagesStatusMsg.msg}
        hasFeedback
      >
        <Upload
          customRequest={({ onSuccess }) =>
            onSuccess('ok')
          }
          listType="picture"
          onChange={newUpload}
          fileList={fileList}
          accept="image/png, image/jpeg"
        >
          <Button disabled={fileList.length >= 3}><p className='text-h5 md:text-h5-md '>Upload</p></Button>
        </Upload>
      </Form.Item>
    </>
  )
};

export default UploadMedia;
