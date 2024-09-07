import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

type Reserve = {
  reserveName: string
  ticketsLeft: number
  cost: number
  description: number
  
}

type ReservesCardProps = {
  reserves: Reserve[]
  setOrderInfo: React.Dispatch<React.SetStateAction<any[]>>
}

const ReservesCard: React.FC<ReservesCardProps> = ({ reserves, setOrderInfo }) => {

  return (
    <>
      <Card bordered={true} className='w-full shadow-sm p-2'>
        <div className='flex flex-col gap-5'>
          {reserves.map((r, i) => <Reserve setOrderInfo={setOrderInfo} reserve={r} key={i} />)}
        </div>
      </Card>
    </>

  )
};

type ReserveProps = {
  reserve: Reserve
  setOrderInfo: React.Dispatch<React.SetStateAction<any[]>>
}

const Reserve: React.FC<ReserveProps> = ({ reserve, setOrderInfo }) => {

  const [ticketsAdded, setTicketsAdded] = useState(0);
  const [ticketsLeft, setTicketsLeft] = useState(reserve.ticketsLeft);

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
    setOrderInfo((oi) => {
      let allOi = [...oi]
      allOi = allOi.filter((oi) => oi.reserveName !== reserve.reserveName)
      if (ticketsAdded !== 0) {
        allOi.push({reserveName: reserve.reserveName, quantity: ticketsAdded, priceEach: reserve.cost})
      }
      return allOi
    })
  }, [ticketsAdded])

  return (
    <>
      <div className='rounded border-[1px] border-gray-300 px-5 py-3 flex flex-row'>
        <div className='w-10/12'>
          <p className='text-h3 md:text-h3-md text-secondary-dark'>{reserve.reserveName}</p>
          <p className='text-h5 md:text-h5-md mb-2'>${reserve.cost}</p>
          <p className='text-h6 md:text-h6-md'>{reserve.description}</p>
        </div>
        <div className='w-1/3 flex flex-row justify-end items-center'>
          <RemoveCircleIcon onClick={subtractTicket} className={`mr-3 ${ticketsAdded <= 0 ? 'text-gray-500' : 'text-secondary-dark hover:cursor-pointer'}`} />
          <p className='text-h4 md:text-h4-md'>{ticketsAdded}</p>
          <AddCircleIcon onClick={addTicket} className={`ml-3 ${ticketsAdded >= ticketsLeft ? 'text-gray-500' : 'text-secondary-dark hover:cursor-pointer'}`} />
        </div>
      </div>
    </>
  )

}

export default ReservesCard;
