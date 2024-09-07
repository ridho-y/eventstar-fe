import React, { useEffect, useState } from 'react';
import { Collapse, CollapseProps, Form, Input, Modal } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import TextArea from 'antd/es/input/TextArea';
import { Validation } from 'pages/profile/Information';
import DefaultButton from 'components/DefaultButton';

type FaqProps = {
  faqs: Faq[]
  setFaqs: React.Dispatch<React.SetStateAction<Faq[]>>
  faqItems: CollapseProps['items']
  setFaqItems: React.Dispatch<React.SetStateAction<CollapseProps['items']>>
}

type Faq = {
  faqId?: number
  question: string
  answer: string
}

const Faq: React.FC<FaqProps> = ({ faqs, faqItems, setFaqItems }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [faqModal, setFaqModal] = useState(null);
  const [newQ, setNewQ] = useState('');
  const [newQStatusMsg, setNewQStatusMsg] = useState<Validation>({ status: '', msg: '' })
  const [newA, setNewA] = useState('');
  const [newAStatusMsg, setNewAStatusMsg] = useState<Validation>({ status: '', msg: '' })
  const [newAQStatusMsg, setNewAQStatusMsg] = useState<Validation>({ status: '', msg: '' })
  const [modalQ, setModalQ] = useState('');
  const [modalAQStatusMsg, setModalAQStatusMsg] = useState<Validation>({ status: '', msg: '' })
  const [modalQStatusMsg, setModalQStatusMsg] = useState<Validation>({ status: '', msg: '' })
  const [modalA, setModalA] = useState('');
  const [modalAStatusMsg, setModalAStatusMsg] = useState<Validation>({ status: '', msg: '' })

  useEffect(() => {
    setFaqItems(() => {
      const newFaqItems: CollapseProps['items'] = []
      faqs.forEach((fq) => {
        newFaqItems.push({
          key: newFaqItems.length === 0 ? 0 : +newFaqItems[newFaqItems.length - 1].key + 1,
          label: fq.question,
          children: fq.answer,
          extra: deleteFaq(newFaqItems.length === 0 ? 0 : +newFaqItems[newFaqItems.length - 1].key + 1)
        })
      })
      return newFaqItems;
    })
  }, [faqs])

  const deleteFaq = (key: number) => (
    <>
      <EditOutlined
        onClick={(event) => {
          event.stopPropagation();
          setFaqModal(key);
          setIsModalOpen(true);
        }}
        className='hover:bg-gray-300 rounded p-1 transition text-h4 md:text-h4-md mr-3'
      />
      <DeleteOutlined
        onClick={(event) => {
          event.stopPropagation();
          setFaqItems((faqItems) => {
            const newFaqItems = [...faqItems]
            return newFaqItems.filter((f: { key: number; }) => f.key !== key)
          })
        }}
        className='hover:bg-gray-300 rounded p-1 transition text-h4 md:text-h4-md'
      />
    </>
  );

  useEffect(() => {
    setModalQ(getFaqItem(faqModal) === null ? '' : getFaqItem(faqModal).label.toString());
    setModalA(getFaqItem(faqModal) === null ? '' : getFaqItem(faqModal).children.toString());
  }, [faqModal, isModalOpen])

  const addNewQ = () => {
    if (newQ === '' && newA === '') {
      setNewAStatusMsg({ status: 'error', msg: 'Question and answer cannot be empty' })
      setNewQStatusMsg({ status: 'error', msg: 'Question and answer cannot be empty' })
      setNewAQStatusMsg({ status: 'error', msg: 'Question and answer cannot be empty' })
    } else if (newQ === '') {
      setNewQStatusMsg({ status: 'error', msg: 'Question cannot be empty' })
      setNewAQStatusMsg({ status: 'error', msg: 'Question cannot be empty' })
      setNewAStatusMsg({ status: '', msg: '' })
    } else if (newA === '') {
      setNewAStatusMsg({ status: 'error', msg: 'Answer cannot be empty' })
      setNewAQStatusMsg({ status: 'error', msg: 'Answer cannot be empty' })
      setNewQStatusMsg({ status: '', msg: '' })
    } else {
      setNewAStatusMsg({ status: '', msg: '' })
      setNewQStatusMsg({ status: '', msg: '' })
      setNewAQStatusMsg({ status: '', msg: '' })
    }

    if (newQ !== '' && newA !== '') {
      setFaqItems((faqItems) => {
        const newFaqItems = [...faqItems]
        newFaqItems.push({
          key: newFaqItems.length === 0 ? 0 : +newFaqItems[newFaqItems.length - 1].key + 1,
          label: newQ,
          children: newA,
          extra: deleteFaq(newFaqItems.length === 0 ? 0 : +newFaqItems[newFaqItems.length - 1].key + 1)
        })
        return newFaqItems
      })
      setNewQ('');
      setNewA('');
    }
  }

  const getFaqItem = (x: number) => {
    for (let i = 0; i < faqItems.length; i++) {
      if (faqItems[i].key === x) {
        return faqItems[i]
      }
    }
    return null
  }

  return (
    <>
      <p className='text-h5 md:text-h5-md pt-2 pl-[3px] text-primary-light'>FAQ</p>
      <Form.Item
        className='!text-h5 !md:text-h5-md'
      >
        {faqItems.length !== 0 &&
          <>
            <Collapse
              className='mt-2'
              defaultActiveKey={['1']}
              items={faqItems}
              size="small"
            />
            <br></br>
          </>}
        <Form.Item
          className='!text-h5 !md:text-h5-md'
          validateStatus={newAQStatusMsg.status}
          help={newAQStatusMsg.msg}
        >
          <Form.Item
            className='!text-h5 !md:text-h5-md !m-0'
            validateStatus={newQStatusMsg.status}
          >
            <Input size="large" placeholder="New Question" className='mt-2 text-h4 md:text-h4-md' onChange={(e) => setNewQ(e.target.value)} value={newQ} />
          </Form.Item>
          <Form.Item
            className='!text-h5 !md:text-h5-md !m-0 !mt-2'
            validateStatus={newAStatusMsg.status}
          >
            <TextArea rows={4} placeholder='New Answer' className='whitespace-pre-wrap text-h4 md:text-h4-md' onChange={(e) => setNewA(e.target.value)} value={newA} />
          </Form.Item>
        </Form.Item>

        <DefaultButton onClick={addNewQ}>Add Question and Answer</DefaultButton>
        <Modal okText="Save" cancelText="Cancel" title="Edit FAQ" open={isModalOpen} onCancel={() => {
          setModalA('')
          setModalQ('')
          setIsModalOpen(false)
        }}
          onOk={() => {
            if (modalQ === '' && modalA === '') {
              setModalAStatusMsg({ status: 'error', msg: 'Question and answer cannot be empty' })
              setModalQStatusMsg({ status: 'error', msg: 'Question and answer cannot be empty' })
              setModalAQStatusMsg({ status: 'error', msg: 'Question and answer cannot be empty' })
            } else if (modalQ === '') {
              setModalQStatusMsg({ status: 'error', msg: 'Question cannot be empty' })
              setModalAQStatusMsg({ status: 'error', msg: 'Question cannot be empty' })
              setModalAStatusMsg({ status: '', msg: '' })
            } else if (modalA === '') {
              setModalAStatusMsg({ status: 'error', msg: 'Answer cannot be empty' })
              setModalAQStatusMsg({ status: 'error', msg: 'Answer cannot be empty' })
              setModalQStatusMsg({ status: '', msg: '' })
            } else {
              setModalAStatusMsg({ status: '', msg: '' })
              setModalQStatusMsg({ status: '', msg: '' })
              setModalAQStatusMsg({ status: '', msg: '' })
            }

            if (modalA !== '' && modalQ !== '') {
              setFaqItems((faqItems) => {
                const newFaqItems = [...faqItems]
                for (let i = 0; i < newFaqItems.length; i++) {
                  if (newFaqItems[i].key === faqModal) {
                    newFaqItems[i].label = modalQ;
                    newFaqItems[i].children = modalA;
                  }
                }
                return newFaqItems
              })
              setModalA('')
              setModalQ('')
              setIsModalOpen(false)
            }
          }}>
          <>
            <Form.Item
              className='!text-h5 !md:text-h5-md'
              validateStatus={modalAQStatusMsg.status}
              help={modalAQStatusMsg.msg}
            >
              <Form.Item
                className='!text-h5 !md:text-h5-md !m-0'
                validateStatus={modalQStatusMsg.status}
              >
                <Input size="large" placeholder="New Question" className='mt-2 text-h4 md:text-h4-md' onChange={(e) => setModalQ(e.target.value)} value={modalQ} />
              </Form.Item>
              <Form.Item
                className='!text-h5 !md:text-h5-md !m-0 !mt-2'
                validateStatus={modalAStatusMsg.status}
              >
                <TextArea rows={4} placeholder='New Answer' className='whitespace-pre-wrap text-h4 md:text-h4-md' onChange={(e) => setModalA(e.target.value)} value={modalA} />
              </Form.Item>
            </Form.Item>
          </>
        </Modal>

      </Form.Item>
    </>
  )
};

export default Faq;
