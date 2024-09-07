import React from 'react';
import { Validation } from 'pages/profile/Information';
import NumberInput from 'components/NumberInput';

type TicketsAvailableProps = {
  ticketsAvailable: string
  setTicketsAvailable: React.Dispatch<React.SetStateAction<string>>
  ticketsAvailableStatusMsg: Validation
  setTicketsAvailableStatusMsg: React.Dispatch<React.SetStateAction<Validation>>
  disabled?: boolean
}

const TicketsAvailable: React.FC<TicketsAvailableProps> = ({ disabled, ticketsAvailable, setTicketsAvailable, ticketsAvailableStatusMsg }) => {
  return (
    <NumberInput disabled={disabled} name='Tickets Available' placeholder='How many tickets are available?' onChange={(v) => setTicketsAvailable(v)} value={ticketsAvailable} validation={ticketsAvailableStatusMsg}></NumberInput>
  )
};

export default TicketsAvailable;
