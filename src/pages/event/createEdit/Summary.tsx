import React from 'react';
import TextAreaInput from 'components/TextAreaInput';

type SummaryProps = {
  summary: string
  setSummary: React.Dispatch<React.SetStateAction<string>>
}

const Summary: React.FC<SummaryProps> = ({ summary, setSummary }) => {
  return (
    <TextAreaInput name='Event Summary' placeholder='Give your event a quick short summary' onChange={(e) => setSummary(e.target.value)} value={summary} rows={4}></TextAreaInput>
  )
};

export default Summary;
