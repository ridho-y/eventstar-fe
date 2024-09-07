import React, { useContext, useState } from 'react';
import DangerousIcon from '@mui/icons-material/Dangerous';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Context } from 'Router';
import LoadingPage from 'system/LoadingPage';
import DangerButton from 'components/DangerButton';
import DangerModal from 'components/DangerModal';
import apiRequest from 'utils/api';

type DeleteAccountProps = {
  setPage: React.Dispatch<React.SetStateAction<string>>
}

const DeleteAccount: React.FC<DeleteAccountProps> = ({ setPage }) => {
  const { setters } = useContext(Context);
  const [modal2Open, setModal2Open] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const deleteAccount = async () => {
    setLoading(true);
    const res = await apiRequest('DELETE', '/profile')
    if (res.ok) {
      setModal2Open(false);
      localStorage.removeItem('token');
      navigate('/');
      setters.setIsLoggedIn(false);
      toast.success('You have permanently deleted your account');
    }
    setLoading(false)
  }

  if (loading) {
    return <LoadingPage />
  } else {
    return (
      <div className='pt-[22px]'>
          <span className='rounded bg-gray-200 hover:cursor-pointer px-3 py-1 text-h4 md:text-h4' onClick={() => setPage('')}>
            Back
          </span>
          <span className='flex flex-row items-center mt-6'>
              <DangerousIcon fontSize='large' className='text-red-700'/>
              <p className='text-h1 md:text-h1-md pl-2 text-red-600'> Delete Your Account</p>
          </span>
          <br></br>
          <main className='w-2/3'>
              <p className='text-h5 md:text-h5-md pt-2 pl-[3px]'>Are you sure you want to proceed with deleting your account? We want to ensure that you understand the consequences of this action before you make a final decision.</p>
              <br></br>
              <div className='pl-5'>
                  <ul className='list-decimal ml-5'>
                      <li><span className='text-h5 md:text-h5-md'>Deleting your account will result in the permanent loss of all your account data, including your profile information, favourites, likes, and any associated content. This data cannot be recovered once the deletion process is complete.</span></li>
                      <li><p className='text-h5 md:text-h5-md'>If you have event tickets or purchased items associated with your account, they will be forfeited upon account deletion. Any remaining credits, balances, or virtual goods will be lost.</p></li>
                      <li><p className='text-h5 md:text-h5-md'>Deleting your account is an irreversible action. Once the deletion process is initiated, there is no way to undo or recover your account. All access to your account, services, and benefits will be permanently revoked.</p></li>
                  </ul>
              </div>
              <br></br>
              <p className='text-h5 md:text-h5-md pt-2 pl-[3px]'>Please take the time to review your decision and consider alternative options before proceeding with the deletion of your account. If you have any concerns or require assistance, our support team is here to help.</p>
              <br></br>
              <span className='float-right'>
                  <DangerButton onClick={() => setModal2Open(true)}>Delete My Account</DangerButton>
                  <DangerModal title='Confirm Delete My Account' open={modal2Open} onOk={deleteAccount} onCancel={() => setModal2Open(false)}>
                    Deleting your account is permanent. All data and benefits will be lost irreversibly. Confirm decision carefully.
                  </DangerModal>
              </span>
          </main>
      </div>
    )
  }
}

export default DeleteAccount;
