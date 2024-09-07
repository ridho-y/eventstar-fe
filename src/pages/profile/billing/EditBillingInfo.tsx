import { Form } from 'antd';
import React, { useEffect, useState } from 'react';
import LoadingPage from 'system/LoadingPage';
import { toast } from 'react-toastify';
import TextInput from 'components/TextInput';
import PrimaryButton from 'components/PrimaryButton';
import DangerButton from 'components/DangerButton';
import DangerModal from 'components/DangerModal';
import apiRequest, { cancelAllRequests } from 'utils/api';

type EditBillingInfoProps = {
  billingId: number,
  billingNumDisplayed: number,
  setEditBillingId: React.Dispatch<React.SetStateAction<number[]>>,
  isHost: boolean
}

type Validation = {
  status: '' | 'error' | 'success' | 'warning' | 'validating',
  msg: string
}

const EditBillingInfo: React.FC<EditBillingInfoProps> = ({ billingId, billingNumDisplayed, setEditBillingId, isHost }) => {
  const [loading, setLoading] = useState(true)
  const [createMode, setCreateMode] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (billingId === null && billingNumDisplayed === null) {
      setCreateMode(true);
    } else {
      setCreateMode(false);
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    if (!createMode) {
      const getBillingInfo = async () => {
        cancelAllRequests();
        const res = await apiRequest('GET', `/profile/billingInformation/${billingId}`)
        if (res.ok) {
          setCardNumber(res.cardNumber);
          setExpiryMonth(`${res.expiryMonth}`);
          setExpiryYear(`${res.expiryYear}`);
          setFirstName(res.billingAddress.firstName);
          setLastName(res.billingAddress.lastName);
          setCountry(res.billingAddress.country);
          setStreetLine1(res.billingAddress.streetLine1);
          setStreetLine2(res.billingAddress.streetLine2);
          setSuburb(res.billingAddress.suburb);
          setState(res.billingAddress.state);
          setPostcode(`${res.billingAddress.postcode}`);
          setEmail(res.billingAddress.email);
          setPhone(res.billingAddress.phone);
          setLoading(false)
        }
      }
      getBillingInfo();
    } else {
      setLoading(false);
    }
  }, [createMode])

  const [form] = Form.useForm();

  // Card Number validation
  const [cardNumber, setCardNumber] = useState('');

  // Expiry Month validation
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryMonthStatusMsg, setExpiryMonthStatusMsg] = useState<Validation>({ status: '', msg: '' });

  // Expiry Year validation
  const [expiryYear, setExpiryYear] = useState('');
  const [expiryYearStatusMsg, setExpiryYearStatusMsg] = useState<Validation>({ status: '', msg: '' });

  // First Name validation
  const [firstName, setFirstName] = useState('');
  const [firstNameStatusMsg, setFirstNameStatusMsg] = useState<Validation>({ status: '', msg: '' });

  // Last Name validation
  const [lastName, setLastName] = useState('');
  const [lastNameStatusMsg, setLastNameStatusMsg] = useState<Validation>({ status: '', msg: '' });

  // Country validation
  const [country, setCountry] = useState('');
  const [countryStatusMsg, setCountryStatusMsg] = useState<Validation>({ status: '', msg: '' });

  // Street Line 1 validation
  const [streetLine1, setStreetLine1] = useState('');
  const [streetLine1StatusMsg, setStreetLine1StatusMsg] = useState<Validation>({ status: '', msg: '' });

  // Street Line 2 validation
  const [streetLine2, setStreetLine2] = useState('');

  // Suburb validation
  const [suburb, setSuburb] = useState('');
  const [suburbStatusMsg, setSuburbStatusMsg] = useState<Validation>({ status: '', msg: '' });

  // State validation
  const [state, setState] = useState('');
  const [stateStatusMsg, setStateStatusMsg] = useState<Validation>({ status: '', msg: '' });

  // Postcode validation
  const [postcode, setPostcode] = useState('');
  const [postcodeStatusMsg, setPostcodeStatusMsg] = useState<Validation>({ status: '', msg: '' });

  // Email validation
  const [email, setEmail] = useState('');
  const [emailStatusMsg, setEmailStatusMsg] = useState<Validation>({ status: '', msg: '' });

  // Phone validation
  const [phone, setPhone] = useState('');
  const [phoneStatusMsg, setPhoneStatusMsg] = useState<Validation>({ status: '', msg: '' });

  // Delete billing address
  const deleteBillingAddress = async () => {
    setLoading(true)
    const res = await apiRequest('DELETE', `/profile/billingInformation/${billingId}`)
    if (res.ok) {
      toast.success(`Successfully deleted ${isHost ? 'Payment' : 'Billing'} Information ${billingNumDisplayed}`);
      setEditBillingId(null);
    }
    setLoading(false)

  }

  const addBillingInfo = async () => {
    setLoading(true)
    const res = await apiRequest('POST', '/profile/billingInformation', { cardNumber, expiryMonth, expiryYear, billingAddress: { firstName, lastName, country, streetLine1, streetLine2, suburb, state, postcode, email, phone } })
    if (res.ok) {
      toast.success(`Successfully updated ${isHost ? 'Payment' : 'Billing'} Information`);
      setEditBillingId(null)
      setLoading(false)
    }
    setLoading(false)
  }

  const updateBillingInfoApi = async () => {
    setLoading(true)
    const res = await apiRequest('PUT', `/profile/billingInformation/${billingId}`, { cardNumber, expiryMonth, expiryYear, billingAddress: { firstName, lastName, country, streetLine1, streetLine2, suburb, state, postcode, email, phone } })
    if (res.ok) {
      toast.success(`Successfully updated ${isHost ? 'Payment' : 'Billing'} Information`);
      setEditBillingId(null);
      setLoading(false)
    }
  }

  const [modal2Open, setModal2Open] = useState(false);

  // When to reveal form
  useEffect(() => {
    if (!createMode && firstName !== '') {
      setLoading(false)
    }
  }, [firstName])

  const updateBillingInfo = () => {
    new Promise<void>((res, rej) => {
      if (/^\d{1,2}$/g.test(expiryMonth) && (+expiryMonth >= 1 && +expiryMonth <= 12)) {
        setExpiryMonthStatusMsg({ status: '', msg: '' });
      } else {
        rej();
        setExpiryMonthStatusMsg({ status: 'error', msg: 'Invalid expiry month' });
      }
      if (/^\d{4}$/g.test(expiryYear) && +expiryYear >= 2023) {
        setExpiryYearStatusMsg({ status: '', msg: '' });
      } else {
        rej();
        setExpiryYearStatusMsg({ status: 'error', msg: 'Invalid expiry year' });
      }
      if (firstName.length > 0) {
        setFirstNameStatusMsg({ status: '', msg: '' });
      } else {
        rej();
        setFirstNameStatusMsg({ status: 'error', msg: 'First name cannot be empty' });
      }
      if (lastName.length > 0) {
        setLastNameStatusMsg({ status: '', msg: '' });
      } else {
        rej();
        setLastNameStatusMsg({ status: 'error', msg: 'Last name cannot be empty' });
      }
      if (country.length > 0) {
        setCountryStatusMsg({ status: '', msg: '' });
      } else {
        rej();
        setCountryStatusMsg({ status: 'error', msg: 'Country cannot be empty' });
      }
      if (streetLine1.length > 0) {
        setStreetLine1StatusMsg({ status: '', msg: '' });
      } else {
        rej();
        setStreetLine1StatusMsg({ status: 'error', msg: 'Street line 1 cannot be empty' });
      }
      if (suburb.length > 0) {
        setSuburbStatusMsg({ status: '', msg: '' });
      } else {
        rej();
        setSuburbStatusMsg({ status: 'error', msg: 'Suburb cannot be empty' });
      }
      if (state.length > 0) {
        setStateStatusMsg({ status: '', msg: '' });
      } else {
        rej();
        setStateStatusMsg({ status: 'error', msg: 'State cannot be empty' });
      }
      if (/^\d{4}$/g.test(postcode)) {
        setPostcodeStatusMsg({ status: '', msg: '' });
      } else {
        rej();
        setPostcodeStatusMsg({ status: 'error', msg: 'Invalid postcode' });
      }
      if (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        setEmailStatusMsg({ status: '', msg: '' });
      } else {
        rej();
        setEmailStatusMsg({ status: 'error', msg: 'Invalid email' });
      }
      if (phone.length > 0) {
        setPhoneStatusMsg({ status: '', msg: '' });
      } else {
        rej();
        setPhoneStatusMsg({ status: 'error', msg: 'Phone cannot be empty' });
      }
      res();
    })
      .then(() => {
        if (
          expiryMonthStatusMsg.status === '' &&
          expiryYearStatusMsg.status === '' &&
          firstNameStatusMsg.status === '' &&
          lastNameStatusMsg.status === '' &&
          countryStatusMsg.status === '' &&
          streetLine1StatusMsg.status === '' &&
          suburbStatusMsg.status === '' &&
          stateStatusMsg.status === '' &&
          postcodeStatusMsg.status === '' &&
          emailStatusMsg.status === '' &&
          phoneStatusMsg.status === ''
        ) {
          if (createMode) {
            addBillingInfo();
          } else {
            updateBillingInfoApi();
          }
        }
      })
      .catch(() => {});
  }

  if (loading) {
    return (
      <div className='w-full min-h-full flex justify-center items-center'>
        <LoadingPage />
      </div>)
  } else {
    return (
      <>
        <div className='pt-[22px]'>
          <span className='rounded bg-gray-200 hover:cursor-pointer px-3 py-1 text-h4 md:text-h4' onClick={() => setEditBillingId(null)}>
            Back
          </span>

          <p className='text-h1 md:text-h1-md text-primary mt-6'>{isHost ? 'Payment Information' : 'Billing Information'} {billingNumDisplayed}</p>
          <p className='text-h5 md:text-h5-md pt-2 pl-[3px]'>Update or remove {isHost ? 'Payment Information' : 'Billing Information'} {billingNumDisplayed} here</p>
          <br />
          <Form className='md:mr-48' form={form}>
            <p className='text-h3 md:text-h3-md'>Card Information</p>
            <section className='flex mt-2 flex-row gap-3 md:gap-3'>
              <div className='basis-1/2'>
                <TextInput name='Card Number' placeholder='Card Number' onChange={(e) => setCardNumber(e.target.value)} value={cardNumber}></TextInput>
              </div>
              <div className='basis-1/3'>
                <TextInput name='Expiry Month' placeholder='Expiry Month' onChange={(e) => setExpiryMonth(e.target.value)} value={expiryMonth} validation={expiryMonthStatusMsg}></TextInput>
              </div>
              <div className='basis-1/3'>
                <TextInput name='Expiry Year' placeholder='Expiry Year' onChange={(e) => setExpiryYear(e.target.value)} value={expiryYear} validation={expiryYearStatusMsg}></TextInput>
              </div>
            </section>
            <hr></hr>
            <br></br>
            <p className='text-h3 md:text-h3-md'>{isHost ? '' : 'Billing '}Address</p>
            <section className='flex mt-2 flex-row gap-3 md:gap-3'>
              <div className='w-full'>
                <TextInput name='First Name' placeholder='First Name' onChange={(e) => setFirstName(e.target.value)} value={firstName} validation={firstNameStatusMsg}></TextInput>
              </div>
              <div className='w-full'>
                <TextInput name='Last Name' placeholder='Last Name' onChange={(e) => setLastName(e.target.value)} value={lastName} validation={lastNameStatusMsg}></TextInput>
              </div>
            </section>
            <div className='w-full'>
              <TextInput name='Street Line 1' placeholder='Street Line 1' onChange={(e) => setStreetLine1(e.target.value)} value={streetLine1} validation={streetLine1StatusMsg}></TextInput>
            </div>
            <div className='w-full'>
              <TextInput name='Street Line 2' placeholder='Street Line 2' onChange={(e) => setStreetLine2(e.target.value)} value={streetLine2}></TextInput>
            </div>
            <section className='flex flex-row gap-3 md:gap-3'>
              <div className='w-full'>
                <TextInput name='Suburb' placeholder='Suburb' onChange={(e) => setSuburb(e.target.value)} value={suburb} validation={suburbStatusMsg}></TextInput>
              </div>
              <div className='w-full'>
                <TextInput name='State' placeholder='State' onChange={(e) => setState(e.target.value)} value={state} validation={stateStatusMsg}></TextInput>
              </div>
              <div className='w-full'>
                <TextInput name='Postcode' placeholder='Postcode' onChange={(e) => setPostcode(e.target.value)} value={postcode} validation={postcodeStatusMsg}></TextInput>
              </div>
            </section>
            <div className='w-full'>
              <TextInput name='Country' placeholder='Country' onChange={(e) => setCountry(e.target.value)} value={country} validation={countryStatusMsg}></TextInput>
            </div>
            <hr></hr>
            <br></br>
            <p className='text-h3 md:text-h3-md'>Contact Information</p>
            <section className='mt-2'>
              <TextInput name='Email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} value={email} validation={emailStatusMsg}></TextInput>
              <TextInput name='Phone' placeholder='Phone' onChange={(e) => setPhone(e.target.value)} value={phone} validation={phoneStatusMsg}></TextInput>
            </section>
            <br />
            <section className='flex flex-row justify-between'>
              <PrimaryButton onClick={updateBillingInfo}>Save Information</PrimaryButton>
              {!createMode &&
                <>
                  <DangerButton onClick={() => setModal2Open(true)}>Delete {isHost ? 'Payment' : 'Billing'} Information</DangerButton>
                  <DangerModal title={`Confirm Delete ${isHost ? 'Payment' : 'Billing'} Information ${billingNumDisplayed}`} open={modal2Open} onOk={deleteBillingAddress} onCancel={() => setModal2Open(false)}>
                    You will not be able to recover this {isHost ? 'payment' : 'billing'} information. Confirm decision carefully.
                  </DangerModal>
                </>
              }
            </section>
          </Form>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      </>
    )
  }
}

export default EditBillingInfo;
