import React from "react";
import { Card, Button } from "@nextui-org/react";
import { CopyAllOutlined } from "@mui/icons-material";
import { toast } from "react-toastify";

type ReferralCodeCardProps = {
  referralCode: string;
  percentageOff: number;
  referrerCut: number;
  name: string;
  payIdPhone: string;
  noUsed: number;
  amountPaid: number;
};

const ReferralCodeCard: React.FC<ReferralCodeCardProps> = ({
  referralCode,
  percentageOff,
  referrerCut,
  name,
  payIdPhone,
  noUsed,
  amountPaid,
}) => {
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success("Code copied to clipboard!");
  };

  return (
    <Card
      variant="bordered"
      isHoverable
      css={{
        p: "$6",
        mw: "400px",
        color: "#94f9f0",
        bg: "#94f9f026",
      }}
    >
      <Card.Header>
        <Button
          iconRight={<CopyAllOutlined />}
          color="success"
          flat
          size="md"
          className="mx-auto"
          onClick={handleCopyToClipboard}
        >
          {referralCode}
        </Button>
      </Card.Header>
      <Card.Body css={{ py: "$2", color: "inherit", transform: "uppercase" }}>
        <div className="flex flex-row justify-between">
          <div className="flex flex-col">
            <p className="text-h6 md:text-h6-md text-secondary-dark">
              <strong>Percentage Off: </strong> {percentageOff * 100}%
            </p>
            <p className="text-h6 md:text-h6-md text-secondary-dark">
              <strong> Name: </strong> {name}
            </p>
            <p className="text-h6 md:text-h6-md text-secondary-dark">
              <strong>Number Used: </strong> {noUsed}
            </p>

          </div>
          <div className="flex flex-col">
            <p className="text-h6 md:text-h6-md text-secondary-dark">
              <strong>Referral Cut: </strong> {referrerCut * 100}%
            </p>

            <p className="text-h6 md:text-h6-md text-secondary-dark">
              <strong> Phone: </strong> {payIdPhone}
            </p>
            <p className="text-h6 md:text-h6-md text-secondary-dark">
              <strong> Amount Paid: </strong> ${amountPaid}
            </p>
          </div>
        </div>
      </Card.Body>
      <Card.Footer></Card.Footer>
    </Card>
  );
};

export default ReferralCodeCard;
