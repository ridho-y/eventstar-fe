import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import PrimaryButton from 'components/PrimaryButton';
import DropDown from 'components/DropDown';
import SelectInput from 'components/SelectInput';
import { Order } from './OrderPreview';

type Reserve = {
  reserveName: string
  sections: {
    sectionName: string
    quantity: number
  }[]
  cost: number
  description: string
}

type ReservesCardSeatedProps = {
  reserves: {
    [key: string]: {
      sections: {
        sectionName: string
        quantity: number
      }[]
      cost: number
      description: string
    }
  }
  setOrderInfo: React.Dispatch<React.SetStateAction<Order[]>>
  orderInfo: Order[]
  sections: {
    ticketsLeft: number
  }[]
}

type ReserveView = {
  [key: string]: {
    sections: {
      sectionName: string
      quantity: number
    }[]
    cost: number
    description: string
  }
}

const ReservesCardSeated: React.FC<ReservesCardSeatedProps> = ({ orderInfo, reserves, setOrderInfo, sections }) => {

  const [viewReserve, setViewReserve] = useState(null);

  return (
    <>
      <Card bordered={true} className='w-full shadow-sm p-2'>
        <div className='flex flex-col gap-5'>
          {viewReserve === null ?
            <>
              {Object.keys(reserves).map((r, i) => <Reserve setViewReserve={setViewReserve} reserve={{ reserveName: r, sections: reserves[r].sections, cost: reserves[r].cost, description: reserves[r].description }} key={i} />)}
            </>
            :
            <>{<ReserveView orderInfo={orderInfo} setViewReserve={setViewReserve} reserve={{ reserveName: viewReserve, ...reserves[viewReserve] }} setOrderInfo={setOrderInfo} sections={sections} />}</>
          }
        </div>

      </Card>
    </>
  )
};

type ReserveProps = {
  reserve: Reserve
  setViewReserve: React.Dispatch<any>
}

const Reserve: React.FC<ReserveProps> = ({ reserve, setViewReserve }) => {

  return (
    <>
      <div className='rounded border-[1px] border-gray-300 px-4 py-2 flex flex-row'>
        <div className='w-10/12'>
          <p className='text-h4 md:text-h4-md text-secondary-dark'>{reserve.reserveName}</p>
          <p className='text-h5 md:text-h5-md mb-1'>${reserve.cost}</p>
          <p className='text-h6 md:text-h6-md'>{reserve.description}</p>
        </div>
        <div className='w-1/3 flex flex-row justify-end items-center'>
          <PrimaryButton onClick={() => setViewReserve(reserve.reserveName)}>Select</PrimaryButton>
        </div>
      </div>
    </>
  )

}

type ReserveViewProps = {
  reserve: Reserve
  orderInfo: Order[]
  setOrderInfo: React.Dispatch<React.SetStateAction<Order[]>>
  setViewReserve: React.Dispatch<any>
  sections: {
    ticketsLeft: number
  }[]
}

const ReserveView: React.FC<ReserveViewProps> = ({ reserve, setOrderInfo, orderInfo, setViewReserve, sections }) => {

  const [section, setSection] = useState(reserve.sections[0].sectionName)
  const [ticketsAdded, setTicketsAdded] = useState(0);
  const [ticketsLeft, setTicketsLeft] = useState(0);

  const addTicket = () => {
    if (ticketsAdded < ticketsLeft) {
      setTicketsAdded((t) => t += 1)
    }
  }

  const subtractTicket = () => {
    if (ticketsAdded > 0) {
      setTicketsAdded((t) => t -= 1)
    }
  }

  useEffect(() => {
    if (section !== null) {
      for (let i = 0; i < orderInfo.length; i++) {
        if (orderInfo[i].section === section) {
          setTicketsAdded(orderInfo[i].quantity)
          setTicketsLeft(sections[section === 'GA' ? 0 : +section].ticketsLeft)
          return
        }
      }
      setTicketsAdded(0)
      setTicketsLeft(sections[section === 'GA' ? 0 : +section].ticketsLeft)
    }
  }, [section])

  useEffect(() => {
    setOrderInfo((oi) => {
      let allOi = [...oi]
      allOi = allOi.filter((oi) => (oi.section !== section))
      if (ticketsAdded !== 0) {
        allOi.push({ reserveName: reserve.reserveName, quantity: ticketsAdded, priceEach: reserve.cost, section: section })
      }
      return allOi
    })
  }, [ticketsAdded])

  return (
    <main className='flex flex-col gap-10'>
      <section className='rounded border-[1px] border-gray-300 px-4 py-2 flex flex-row'>
        <div className='w-10/12'>
          <p className='text-h4 md:text-h4-md text-secondary-dark'>{reserve.reserveName}</p>
          <p className='text-h5 md:text-h5-md mb-1'>${reserve.cost}</p>
          <p className='text-h6 md:text-h6-md'>{reserve.description}</p>
        </div>
        <div className='w-1/3 flex flex-row justify-end items-center'>
          <PrimaryButton onClick={() => setViewReserve(null)}>Change</PrimaryButton>
        </div>
      </section>
      <section className='flex flex-row justify-between'>
        <span>
          <SelectInput name='Select Section' placeholder='Section' onChange={(v: string) => setSection(v)} value={section} options={reserve.sections.map((s) => { return { value: s.sectionName, label: s.sectionName } })}></SelectInput>
        </span>
        {section !== null &&
          <div className='w-1/3 flex flex-row justify-end items-center'>
            <RemoveCircleIcon onClick={subtractTicket} className={`mr-3 ${ticketsAdded <= 0 ? 'text-gray-500' : 'text-secondary-dark hover:cursor-pointer'}`} />
            <p className='text-h4 md:text-h4-md'>{ticketsAdded}</p>
            <AddCircleIcon onClick={addTicket} className={`ml-3 ${ticketsAdded >= ticketsLeft ? 'text-gray-500' : 'text-secondary-dark hover:cursor-pointer'}`} />
          </div>}
      </section>
    </main>
  )
}

export default ReservesCardSeated;
