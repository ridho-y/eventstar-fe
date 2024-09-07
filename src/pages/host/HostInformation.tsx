import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Upload } from 'antd';
import LoadingPage from 'system/LoadingPage';
import { toast } from 'react-toastify';
import apiRequest, { cancelAllRequests } from 'utils/api';
import TextInput from 'components/TextInput';
import TextAreaInput from 'components/TextAreaInput';
import PrimaryButton from 'components/PrimaryButton';
import { uploadFiles } from 'utils/helpers';
import { useNavigate } from 'react-router-dom';
import { Context } from 'Router';

const HostInformation: React.FC = () => {
  const { getters } = useContext(Context)
  const [loading, setLoading] = useState(true)
  const [form] = Form.useForm();
  const [orgName, setOrgName] = useState(' ')
  const [description, setDescription] = useState('')
  const [orgEmail, setOrgEmail] = useState('')
  const [images, setImages] = useState<string[]>([]);
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();
  // Retrieve host information
  useEffect(() => {
    setLoading(true)
    const getHostInformation = async () => {
      cancelAllRequests();
      const res = await apiRequest('GET', '/profile')
      if (res.ok) {
        setOrgName(res.orgName);
        setDescription(res.description);
        setOrgEmail(res.orgEmail)
        setImages(res.banner === null ? [] : [res.banner])
      }
      setLoading(false)
    }
    getHostInformation();
  }, [])

  // Submission
  const submit = async () => {
    const uploadedBanner = (await uploadFiles(fileList))[0];
    console.log(uploadedBanner);
    const res = await apiRequest('POST', '/profile', { orgName, description, orgEmail, banner: fileList.length === 0 ? null : uploadedBanner })
    if (res.ok) {
      toast.success('Successfully updated host profile');
    }
  }

  // On Initial load, populate banner
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

  // New banner uplaode
  const newUpload = (info: any) => {
    let fileList = [...info.fileList];
    fileList.forEach(function (file) {
      let reader = new FileReader();
      reader.onload = (e) => {
        file.base64 = e.target.result;
      };
      reader.readAsDataURL(file.originFileObj);
    });
    setFileList(fileList);
  };

  if (loading) {
    return (
      <div className='w-full min-h-full flex justify-center items-center'>
        <LoadingPage />
      </div>)
  } else {
    return (
      <div className='pt-[30px]'>
        <div className='flex flex-row justify-between items-center'>
          <p className='text-h1 md:text-h1-md text-primary'>Host Profile</p>
          <PrimaryButton onClick={() => navigate(`/host/${getters.memberId}`)}>View Public Profile</PrimaryButton>
        </div>
        <p className='text-h5 md:text-h5-md pt-2 pl-[3px]'>You can view and update your host profile here</p>
        <br />
        <Form className='md:mr-48' form={form}>
          <TextInput name='Organisation Name' placeholder='Organisation Name' onChange={(e) => setOrgName(e.target.value)} value={orgName}></TextInput>
          <TextInput name='Organisation Email' placeholder='Organisation Email' onChange={(e) => setOrgEmail(e.target.value)} value={orgEmail}></TextInput>
          <TextAreaInput name='Description' placeholder='Describe your organisation' onChange={(e) => setDescription(e.target.value)} value={description} rows={4}></TextAreaInput>
          <p className='text-h5 md:text-h5-md pt-2 pl-[3px] text-primary-light'>Upload Banner</p>
          <p className='text-h6 md:text-h6-md mb-2 pl-[3px]'>EventStar recommends a banner size of 2560 x 1440 pixels</p>
          <Upload
            customRequest={({ onSuccess }) =>
              onSuccess("ok")
            }
            listType="picture"
            onChange={newUpload}
            fileList={fileList}
            accept="image/png, image/jpeg"
          >
            <Button disabled={fileList.length >= 1}><p className='text-h5 md:text-h5-md'>Upload</p></Button>
          </Upload>
          <br />
          <PrimaryButton onClick={submit}>Save Information</PrimaryButton>
          <br></br><br></br><br></br>
        </Form>
      </div>
    )
  }
}

export default HostInformation;
