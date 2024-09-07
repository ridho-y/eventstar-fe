import React, { useState } from "react";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Radio, Space } from "antd";
import type { RadioChangeEvent } from "antd";
import apiRequest from "utils/api";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingPage from "system/LoadingPage";

const EventSurveyForm: React.FC = () => {
  const MAX_QUESTIONS = 5;
  const [form] = Form.useForm();
  const [answerTypes, setAnswerTypes] = React.useState<boolean[]>([true]);
  const { eventListingId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const onSelectionTypeChange = (
    questionIndex: number,
    { target: { value } }: RadioChangeEvent
  ) => {
    setAnswerTypes((prevAnswerTypes) => {
      const updatedAnswerTypes = [...prevAnswerTypes];
      updatedAnswerTypes[questionIndex] = value; // Convert value to number
      return updatedAnswerTypes;
    });
  };

  const onFinish = async (values: any) => {
    setLoading(true);
    // Get the survey data from the form and map it to question objects
    let surveyData = values.survey.map((item: any, _index: number) => ({
      question: item.question,
      shortInput: item.answerType,
    }));
    
    surveyData = {eventListingId, survey: [...surveyData]}
    const res = await apiRequest('POST', `/survey`, surveyData);
    if (res.ok) {
      toast.success('Successfully created survey.')
      navigate(`/event/${eventListingId}`)
    }
    setLoading(false)
  };

  if (loading) {
    return <LoadingPage />
  } else {
    return (
      <>
        <Form
          form={form} // Set the form instance
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.List name="survey" initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <div className="w-full mb-10">
                    <p className='text-h5 md:text-h5-md pl-[3px] text-primary-light'>Question</p>
                    <div className="flex flex-row justify-between items-baseline w-full">
                      <Form.Item
                        style={{ marginBottom: "6px", width: '100%' }}
                        {...restField}
                        name={[name, "question"]}
                        rules={[{ required: true, message: "Missing Question" }]}
                      >
                        <Input
                          size="large"
                          className="text-h5 md:text-h5-md !min-w-full"
                          placeholder="Enter question"
                        />
                      </Form.Item>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          className="ml-2"
                          onClick={() => remove(name)}
                        />
                      ) : null}
                    </div>
                    <p className='mt-2 text-h5 md:text-h5-md pl-[3px] text-primary-light'>Answer Type</p>
                    <Form.Item
                      style={{ marginBottom: "6px", width: '100%' }}
                      {...restField}
                      name={[name, "answerType"]}
                      rules={[{ required: true, message: "Missing Answer Type" }]}
                    >
                      <Radio.Group
                        options={[
                          { value: true, label: "Short Answer" },
                          { value: false, label: "Long Answer" },
                        ]}
                        onChange={(e) => onSelectionTypeChange(index, e)}
                        value={answerTypes[index]}
                        optionType="button"
                        buttonStyle="solid"
                      />
                    </Form.Item>
                  </div>
                ))}
                <br></br>
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => {
                      if (fields.length < MAX_QUESTIONS) {
                        setAnswerTypes((prevAnswerTypes) => [
                          ...prevAnswerTypes,
                          true,
                        ]);
                        add();
                      }
                    }}
                    disabled={fields.length === MAX_QUESTIONS}
                    icon={<PlusOutlined />}
                  >
                    Add Question
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Form.Item>
            <br></br>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </>
    );
  }
};

const EventSurvey: React.FC = () => {
  return (
    <main className='flex flex-col items-center'>
      <div className='pt-[70px] w-[90%] md:w-[75%]'>
        <p className='text-h1 md:text-h1-md text-primary'>Create Survey</p>
        <br></br>
        <EventSurveyForm />
      </div>
      <br></br><br></br><br></br><br></br><br></br>
    </main>
  );
};

export default EventSurvey;
