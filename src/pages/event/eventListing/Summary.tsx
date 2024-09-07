import React from 'react';

type SummaryProps = {
  summary: string
}

const Summary: React.FC<SummaryProps> = ({ summary }) => {
  if (summary.length > 0) {
    return (
      <>
        <p className='text-h4 md:text-h4-md mb-2'>{summary}</p>
        <br></br><br></br>
      </>
    )
  } else {
    return <></>
  }
};

export default Summary;
