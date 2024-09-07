import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LoadingPage from "system/LoadingPage";
import apiRequest from "utils/api";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import ShortUniqueId from "short-unique-id";

import { ModalForm, ProForm, ProFormText } from "@ant-design/pro-components";
import { Button, Col, Form, Input, Modal, Row } from "antd";
import ReferralCodeCard from "components/host/cards/ReferralCodeCard";

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

type CreateCodeFormProps = {
  fetchReferralCodes: () => void;
}

const CreateCodeForm: React.FC<CreateCodeFormProps> = ({ fetchReferralCodes }) => {
  const [form] = Form.useForm<{ name: string; company: string }>();
  const [referralCode, setReferralCode] = useState("");

  const handleOnFinish = async (values: any) => {
    await waitTime(2000);
    let requestData: any = {
      referralCode: referralCode,
      percentageOff: parseFloat(values?.percentageOff) / 100,
      referrerCut: parseFloat(values?.referrerCut) / 100,
      name: values?.name,
      payIdPhone: values?.payIdPhone,
    };
    if (referralCode === '' || values?.percentageOff === undefined || values.referrerCut === undefined || values?.name === undefined || values?.name === '' || values.payIdPhone === undefined || values?.payIdPhone === '') {
      toast.error('You must complete all inputs')
    } else {
      const response = await apiRequest("POST", "/referral", requestData);
      if (response.ok) {
        toast.success("Submit successfully");
        fetchReferralCodes();
      }
    }
  };

  const handleGenerateCode = () => {
    const generatedCode = new ShortUniqueId().randomUUID(6);
    setReferralCode(generatedCode);
  };

  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      submitter={{
        searchConfig: { submitText: "Submit", resetText: "Cancel" },
      }}
      onOpenChange={(open) => {
        if (!open) {
          setReferralCode("");
        }
      }}
      title="Create Code"
      trigger={
        <Button type="primary" className="mb-4" icon={<PlusOutlined />}>
          Create Code
        </Button>
      }
      form={form}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => {},
      }}
      submitTimeout={2000}
      onFinish={handleOnFinish}
    >
      <ProForm.Group>
        <Input
          width="md"
          name="referralCode"
          placeholder="Referral Code"
          value={referralCode}
          disabled
        />
        <Button type="primary" onClick={handleGenerateCode} className="mb-6">
          Generate Code
        </Button>
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="percentageOff"
          label="Ticket Discount (%)"
          placeholder="Enter Percentage Off"
          required
        />
        <ProFormText
          width="md"
          name="referrerCut"
          label="Referral Cut (%)"
          placeholder="Enter Percentage Off"
          required
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="name"
          label="Name"
          placeholder="Enter Referral Name"
          required
        />
        <ProFormText
          width="md"
          name="payIdPhone"
          label="Phone Number"
          placeholder="Enter PayID Phone Number"
          required
        />
      </ProForm.Group>
    </ModalForm>
  );
};

const Referrals: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [activatedReferralCodes, setActivatedReferralCodes] = useState<any[]>(
    []
  );
  const [deactivatedReferralCodes, setDeactivatedReferralCodes] = useState<
    any[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deactivateCode, setDeactivateCode] = useState("");

  const fetchReferralCodes = async () => {
    setLoading(true);
    const response = await apiRequest("GET", "/referral");
    if (response.ok) {
      setActivatedReferralCodes(response.activeReferrals);
      setDeactivatedReferralCodes(response.inactiveReferrals);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReferralCodes();
  }, []);

  const handleOpen = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    setIsModalOpen(false);
    const response = await apiRequest('DELETE', `/referral/${deactivateCode}`);
    if (response.ok) {
      toast.success("Deactivated referral code");
      fetchReferralCodes();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return <LoadingPage />;
  } else {
    return (
      <div className="pt-[30px]">
        <p className="text-h1 md:text-h1-md text-primary mb-6">Referrals</p>
        <CreateCodeForm fetchReferralCodes={fetchReferralCodes} />
        <Button
          type="default"
          className="ml-4"
          onClick={handleOpen}
          icon={<MinusOutlined />}
        >
          Deactivate Code
        </Button>
        <Modal
          title="Deactivate Code"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          okText="Confirm"
        >
          <Input
            placeholder="Enter referral code"
            className="mx-auto w-[300px] my-6 block"
            onChange={(e) => setDeactivateCode(e.target.value)}
          />
        </Modal>
        <p className="text-h3 md:text-h3-md mt-8 mb-6">
          Activated Referral Codes
        </p>
        <Row gutter={[16, 16]}>
          {activatedReferralCodes.length === 0 && <p className='pl-[10px] text-h5 md:text-h5-md text-gray-500'>No active referral codes!</p>}
          {activatedReferralCodes.map((card, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <ReferralCodeCard {...card} />
            </Col>
          ))}
        </Row>
        <p className="text-h3 md:text-h3-md mt-8 mb-6">
          Deactivated Referral Codes
        </p>
        <Row gutter={[16, 16]} className="mb-8">
        {deactivatedReferralCodes.length === 0 && <p className='pl-[10px] text-h5 md:text-h5-md text-gray-500'>No deactivated referral codes!</p>}
          {deactivatedReferralCodes.map((card, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={index}>
              <ReferralCodeCard {...card} />
            </Col>
          ))}
        </Row>
      </div>
    );
  }
};

export default Referrals;
