import React from 'react'
import { ToastContainer, Slide } from 'react-toastify';

function ToastError () {
  return (
        <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        transition={Slide}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ width: '400px' }}
        toastClassName={'text-h5 md:text-h5-md'}
        />
  );
}

export default ToastError;
