import React, { useEffect, useState } from "react";
import { Table, Form, Select } from "antd";
import { CloseOutlined } from '@ant-design/icons';
import type { ColumnsType } from "antd/es/table";
import DefaultButton from "components/DefaultButton";
import type { SelectProps } from "antd";
import TextInput from "components/TextInput";
import { Validation } from "pages/profile/Information";
import DefaultModal from "components/DefaultModal";
import NumberInput from "components/NumberInput";
import TextAreaInput from "components/TextAreaInput";

type Reserve = {
  name: string;
  sections?: string[];
  tickets?: number;
  cost: number;
  description: string;
}

type ReserveItem = {
  key: number;
  reserve: string;
  sections?: string[];
  tickets?: number
  cost: number;
  description: string;
}

const originalOptions: SelectProps["options"] = [
  {
    label: "GA",
    value: "GA"
  }
];

for (let i = 1; i <= 15; i++) {
  originalOptions.push({
    label: i.toString(),
    value: i.toString()
  });
}


type ReservesProps = {
  venue: string
  reserves: Reserve[]
  setReserves: React.Dispatch<React.SetStateAction<Reserve[]>>
  reserveItems: ReserveItem[]
  setReserveItems: React.Dispatch<React.SetStateAction<ReserveItem[]>>
  reservesStatusMsg: Validation
  setReservesStatusMsg: React.Dispatch<React.SetStateAction<Validation>>
  type: string
  createMode: boolean
}

const Reserves: React.FC<ReservesProps> = ({ createMode, reserves, reserveItems, setReserveItems, reservesStatusMsg, type }) => {

  const [reserveName, setReserveName] = useState('');
  const [reserveNameSV, setReserveNameSV] = useState<Validation>({ status: '', msg: '' });
  const [cost, setCost] = useState(null);
  const [costSV, setCostSV] = useState<Validation>({ status: '', msg: '' });
  const [sections, setSections] = useState([]);
  const [sectionsSV, setSectionsSV] = useState<Validation>({ status: '', msg: '' });
  const [description, setDescription] = useState('');
  const [descriptionSV, setDescriptionSV] = useState<Validation>({ status: '', msg: '' });
  const [quantity, setQuantity] = useState(null);
  const [quantitySV, setQuantitySV] = useState<Validation>({ status: '', msg: '' });
  const [options, setOptions] = useState(originalOptions)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    setReserveName('');
    setReserveNameSV({ status: '', msg: '' });
    setCost(null);
    setCostSV({ status: '', msg: '' });
    setSections([]);
    setSectionsSV({ status: '', msg: '' });
    setDescription('');
    setDescriptionSV({ status: '', msg: '' });
    setQuantity(null);
    setQuantitySV({ status: '', msg: '' });
    setOptions(originalOptions);
    setModalOpen(false);
    setReserveItems([])
  }, [type])

  const columns: ColumnsType<ReserveItem> = [
    {
      title: <p className="text-h5 md:text-h5-md">Reserve</p>,
      dataIndex: "reserve",
      key: "reserve",
      width: 150,
      render: (text) => <p className="text-h5 md:text-h5-md">{text}</p>
    },
    {
      title: <p className="text-h5 md:text-h5-md">Price ($)</p>,
      dataIndex: "cost",
      key: "cost",
      width: 150,
      render: (text) => <p className="text-h5 md:text-h5-md">{text}</p>
    },
    {
      title: <p className="text-h5 md:text-h5-md">{type === 'inpersonSeated' ? 'Sections' : 'Quantity'}</p>,
      dataIndex: type === 'inpersonSeated' ? 'sections' : 'tickets',
      key: type === 'inpersonSeated' ? 'sections' : 'tickets',
      width: type === 'inpersonSeated' ? 300 : 150,
      render: (arr) => {
        if (type === 'inpersonSeated') {
          return <p className="text-h5 md:text-h5-md">{arr.join(", ")}</p>
        } else {
          return <p className="text-h5 md:text-h5-md">{arr}</p>
        }
      }
    },
    {
      title: <p className="text-h5 md:text-h5-md">Description</p>,
      dataIndex: "description",
      key: "description",
      width: 400,
      render: (text) => <p className="text-h5 md:text-h5-md">{text}</p>
    },
    {
      title: <p className="text-h5 md:text-h5-md">Delete</p>,
      key: "actions",
      width: 40,
      render: (_, record) => (
        createMode ?
          <span className="flex flex-row justify-center">
            <CloseOutlined
              onClick={() => {
                if (createMode) {
                  setReserveItems((reserveItems) => {
                    const newReserveItems = [...reserveItems]
                    return newReserveItems.filter((r) => r.key != record.key);
                  });
                }
              }}
              className='hover:cursor-pointer text-h5 md:text-h5-md'
            />
          </span>
          :
          <></>
      )
    }
  ];

  useEffect(() => {
    setReserveItems(() => {
      const newReserveItems: ReserveItem[] = []
      reserves.forEach((r) => {
        newReserveItems.push({
          key: newReserveItems.length === 0 ? 0 : +newReserveItems[newReserveItems.length - 1].key + 1,
          reserve: r.name,
          sections: r?.sections,
          tickets: r?.tickets,
          cost: r.cost,
          description: r.description
        })
      })
      return newReserveItems;
    })
  }, [reserves])

  useEffect(() => {
    if (type === 'inpersonSeated') {
      setOptions(() => {
        let newOptions = originalOptions
        reserveItems.forEach((r) => {
          newOptions = newOptions.filter((o) => !r.sections.includes(o.value.toString()))
        })
        return newOptions
      })
    }
  }, [reserveItems])

  const isReserveNameTaken = (name: string) => {
    for (let i = 0; i < reserveItems.length; i++) {
      if (reserveItems[i].reserve === name) {
        return true
      }
    }
    return false
  }

  const inputReserve = () => {
    new Promise((res, rej) => {
      if (reserveName === '') {
        setReserveNameSV({ status: 'error', msg: 'Reserve name cannot be empty' })
        rej();
      } else if (isReserveNameTaken(reserveName)) {
        setReserveNameSV({ status: 'error', msg: `Already have a reserve named ${reserveName}` })
      } else {
        setReserveNameSV({ status: '', msg: '' })
      }

      if (description === '') {
        setDescriptionSV({ status: 'error', msg: 'Description cannot be empty' })
        rej();
      } else {
        setDescriptionSV({ status: '', msg: '' })
      }

      if (cost === null) {
        setCostSV({ status: 'error', msg: 'Cost cannot be empty' })
        rej();
      } else {
        setCostSV({ status: '', msg: '' })
      }

      if (type === 'inpersonSeated') {
        if (sections.length === 0) {
          setSectionsSV({ status: 'error', msg: 'Must allocate at least one section for this reserve' })
          rej();
        } else {
          setSectionsSV({ status: '', msg: '' })
        }
      } else {
        if (quantity === null || quantity === 0 || !/^\d+$/g.test(quantity)) {
          setQuantitySV({ status: 'error', msg: 'Quantity cannot be 0 and must be an integer' })
          rej();
        } else {
          setQuantitySV({ status: '', msg: '' })
        }
      }
      res('');
    })
      .then(() => {
        if (reserveNameSV.status === '' && descriptionSV.status === '' && costSV.status === '' && sectionsSV.status === '' && quantitySV.status === '') {
          setReserveItems((reserveItems) => {
            let newReserveItems = [...reserveItems]
            newReserveItems.push({
              key: newReserveItems.length === 0 ? 0 : +newReserveItems[newReserveItems.length - 1].key + 1,
              reserve: reserveName,
              sections: sections,
              tickets: quantity,
              cost: cost,
              description: description,
            })
            return newReserveItems
          })
          setModalOpen(false)
          setReserveName('')
          setDescription('')
          setQuantity(null);
          setCost(null)
          setSections([])
        }
      })
  }

  return (
    <>
      <p className='text-h5 md:text-h5-md pt-2 pl-[3px] text-primary-light'>Reserves</p>
      <Form.Item
        validateStatus={reservesStatusMsg.status}
        help={reservesStatusMsg.msg}
        className='!text-h5 !md:text-h5-md'
        hasFeedback
      >
        <Table className='border-gray-300 border-[1px] rounded !text-h4 !md:text-h4-md ' columns={columns} dataSource={reserveItems} pagination={false} />
      </Form.Item>
      <DefaultButton disabled={!createMode} onClick={() => setModalOpen(true)}>Add New Reserve</DefaultButton>
      <DefaultModal width={1000} title='Add New Reserve' open={modalOpen} onOk={inputReserve} okText='Add Reserve' onCancel={() => setModalOpen(false)}>
        <br></br>
        <TextInput name='Reserve Name' placeholder='Reserve Name' onChange={(e) => setReserveName(e.target.value)} value={reserveName} validation={reserveNameSV} />
        <NumberInput name='Price ($)' placeholder='$' addonBefore="$" onChange={(v) => setCost(v)} value={cost} validation={costSV} />
        {type === 'inpersonSeated' ?
          <>

            <p className='text-h5 md:text-h5-md pl-[3px] text-primary-light'>Sections</p>
            <Form.Item
              validateStatus={sectionsSV.status}
              help={sectionsSV.msg}
              className='!text-h5 !md:text-h5-md'
              hasFeedback
            >
              <Select
                size="large"
                mode="multiple"
                placeholder="Reserve sections"
                className='!text-h4 !md:text-h4-md w-full'
                value={sections}
                onChange={(v) => setSections(v)}
                options={options}
              />
            </Form.Item>
          </>
          :
          <NumberInput name='Quantity' placeholder='Quantity' onChange={(v) => setQuantity(v)} value={quantity} validation={quantitySV} />
        }
        <TextAreaInput name='Description' placeholder='Describe the reserve' onChange={(e) => setDescription(e.target.value)} value={description} rows={5} validation={descriptionSV} />
      </DefaultModal>
      <br></br><br></br><br></br>
    </>
  )
};
export default Reserves;