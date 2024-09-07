import React from 'react';
import { Validation } from 'pages/profile/Information';
import NumberInput from 'components/NumberInput';

type MinimumCostProps = {
  minimumCost: string
  setMinimumCost: React.Dispatch<React.SetStateAction<string>>
  minimumCostStatusMsg: Validation
  setMinimumCostStatusMsg: React.Dispatch<React.SetStateAction<Validation>>
  disabled?: boolean
}

const MinimumCost: React.FC<MinimumCostProps> = ({ disabled, minimumCost, setMinimumCost, minimumCostStatusMsg }) => {
  return (
    <NumberInput disabled={disabled} name='Price of Each Ticket' placeholder='How much is each ticket?' onChange={(v) => setMinimumCost(v)} value={minimumCost} addonBefore='$' validation={minimumCostStatusMsg}></NumberInput>
  )
};

export default MinimumCost;
