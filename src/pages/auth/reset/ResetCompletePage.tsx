import React from 'react';
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'antd';

const ResetCompletePage: React.FC = () => {
  const navigate = useNavigate();
  const { email } = useParams();
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="py-8 px-24 bg-white shadow-md rounded-lg">
        <div className="flex items-center justify-center mb-8 pt-8">
          <AssignmentTurnedInRoundedIcon
            sx={{ fontSize: 96, color: '#1E6091' }}
          />
        </div>
        <p className="text-h2 md:text-h2-md font-semibold mb-4 text-center">
          OTP Code Sent
        </p>
        <p className="text-h4 md:text-h4 text-center mb-10">
          Email has been sent to your registered email
        </p>
        <div className="pb-10">
            <Button
              type="primary"
              className="w-full h-10 flex items-center justify-center"
              onClick={() => navigate(`/reset/password/edit/${email}`)}
            >
              Continue
            </Button>
          </div>
      </div>
    </div>
  );
};

export default ResetCompletePage;
