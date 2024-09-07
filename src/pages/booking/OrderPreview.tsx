import React, { useState } from "react";
import { Card, Divider, Checkbox, Collapse, Input, Button, Space } from "antd";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import PrimaryButton from "components/PrimaryButton";
import DefaultModal from "components/DefaultModal";
import ConfirmPurchaseModal from "./ConfirmPurchaseModal";
import apiRequest from "utils/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoadingPage from "system/LoadingPage";

export type PromoCodeInputProps = {
  order: Order[];
  setPercentageOff: React.Dispatch<React.SetStateAction<number>>;
  referralCode: string;
  setReferralCode: React.Dispatch<React.SetStateAction<string>>;
};

const PromoCodeInput: React.FC<PromoCodeInputProps> = ({
  order,
  setPercentageOff,
  referralCode,
  setReferralCode,
}) => {

  const handelApplyPromoCode = async () => {
    const res = await apiRequest("GET", `/referral/${referralCode}`);
    if (res.ok) {
      toast.success("Promo code applied");
      setPercentageOff(res.data);
    }
  };

  return (
    <Space.Compact style={{ width: "100%" }}>
      <Input
        placeholder="Enter your code"
        onChange={(e) => setReferralCode(e.target.value)}
      />
      <Button
        type="primary"
        onClick={handelApplyPromoCode}
        disabled={order.length === 0}
      >
        Apply
      </Button>
    </Space.Compact>
  );
};

export type OrderPreviewProps = {
  order: Order[];
  checkout: boolean;
  balance?: number;
  eventListingId: number;
  percentageOff: number;
  setPercentageOff?: React.Dispatch<React.SetStateAction<number>>;
  isConfirmPage: boolean;
  referralCode?: string;
  setReferralCode?: React.Dispatch<React.SetStateAction<string>>;
};

export type Order = {
  reserveName: string;
  quantity: number;
  priceEach: number;
  section?: string;
};

type ReserveBody = {
  reserveName: string;
  quantity: number;
  section?: string;
};

const OrderPreview: React.FC<OrderPreviewProps> = ({
  order,
  checkout,
  balance,
  eventListingId,
  percentageOff,
  setPercentageOff,
  isConfirmPage,
  referralCode,
  setReferralCode,
}) => {
  const [openModal, setModalOpen] = useState(false);
  const [checkbox, setCheckbox] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const placeOrder = async () => {
    setLoading(true);
    const reservesBody = order.map((o) => {
      let reserve: ReserveBody = {
        reserveName: o.reserveName,
        quantity: o.quantity,
      };
      if (o.section) {
        reserve = { ...reserve, section: o.section };
      }
      return reserve;
    });
    const res = await apiRequest("POST", `/book`, {
      reserves: reservesBody,
      referralCode: referralCode,
      eventListingId,
    });
    if (res.ok) {
      toast.success("Successfully purchased tickets");
      navigate("/profile/bookings");
    }
    setLoading(false);
  };

  if (loading) {
    return <LoadingPage />;
  } else {
    return (
      <>
        <ConfirmPurchaseModal
          order={order}
          openModal={openModal}
          setOpenModal={setModalOpen}
          eventListingId={eventListingId}
          percentageOff={percentageOff}
          referralCode={referralCode}
        />
        <Card bordered={true} className="w-full shadow-sm p-1">
          <p className="text-h3 md:text-h3-md text-secondary-dark">
            Order Summary
          </p>
          <br></br>
          {order.length === 0 && (
            <p className="text-h5 md:text-h5-md text-gray-400">No items</p>
          )}
          {order.map((o, i) => (
            <div key={i} className="flex flex-row justify-between">
              <p className="text-h5 md:text-h5-md">
                {o.quantity} x {o.reserveName}
                {o.section && ` @ Section ${o.section}`}
              </p>
              <p className="text-h5 md:text-h5-md text-primary-light">
                <b>
                  {Number(
                    o.quantity * o.priceEach * (1 - percentageOff)
                  ).toFixed(2)}
                </b>
              </p>
            </div>
          ))}
          <Divider />
          {!isConfirmPage && (
            <>
              <Collapse
                bordered={false}
                items={[
                  {
                    key: "1",
                    label: "Enter a Referral Code",
                    children: (
                      <PromoCodeInput
                        order={order}
                        setPercentageOff={setPercentageOff}
                        referralCode={referralCode}
                        setReferralCode={setReferralCode}
                      />
                    ),
                  },
                ]}
              />
              <Divider />
            </>
          )}
          { percentageOff !== 0 &&
            <div className="flex flex-row justify-end ">
              <s className="text-h5 md:text-h5-md text-red-500">
                {Number(
                  order.reduce(
                    (_, c) =>
                      c.quantity * c.priceEach,
                    0
                  )
                ).toFixed(2)}
              </s>
            </div>
          }
          <div className="flex flex-row justify-between">
            <p className="text-h4 md:text-h4-md">
              <b>Total</b>
            </p>
            <p className="text-h4 md:text-h4-md text-primary">
              <b>
                {Number(
                  order.reduce(
                    (a, c) =>
                      c.quantity * c.priceEach * (1 - percentageOff) + a,
                    0
                  )
                ).toFixed(2)}
              </b>
            </p>
          </div>
          <br></br>
          {checkout ? (
            <PrimaryButton
              disabled={order.length === 0}
              className="w-full"
              onClick={() => setModalOpen(true)}
            >
              Checkout
            </PrimaryButton>
          ) : (
            <>
              <br></br>
              <Checkbox
                className="mb-3"
                onChange={(b) => setCheckbox(b.target.checked)}
                value={checkbox}
              >
                <p className="text-h5 md:text-h5-md">
                  I agree to EventStar's Terms & Conditions
                </p>
              </Checkbox>
              <PrimaryButton
                disabled={
                  !checkbox ||
                  balance <
                  order.reduce(
                    (a, c) =>
                      c.quantity * c.priceEach * (1 - percentageOff) + a,
                    0
                  )
                }
                onClick={placeOrder}
                className="w-full"
              >
                Place Order
              </PrimaryButton>
            </>
          )}
        </Card>
      </>
    );
  }
};

export default OrderPreview;
