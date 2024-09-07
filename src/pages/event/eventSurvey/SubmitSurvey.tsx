import React, { useContext, useEffect, useState } from 'react';
import { Form } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingPage from 'system/LoadingPage';
import Page403 from 'system/Page403';
import { Context } from 'Router';
import apiRequest from 'utils/api';
import TextInput from 'components/TextInput';
import TextAreaInput from 'components/TextAreaInput';
import PrimaryButton from 'components/PrimaryButton';
import { toast } from 'react-toastify';

type Answers = {
  [key: number]: string
}

type EventInfo = {
  title: string
  orgName: string
}

const SubmitSurvey: React.FC = () => {

  const { getters } = useContext(Context);
  const { eventListingId } = useParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [surveyData, setSurveyData] = useState([]);
  const [answers, setAnswers] = useState<Answers>({});
  const [eventInfo, setEventInfo] = useState<EventInfo>(null);

  useEffect(() => {
    const getSurveyData = async () => {
      setLoading(true)
      const res = await apiRequest('GET', `/survey/${eventListingId}`)
      if (res.ok) {
        setSurveyData(res.survey);
        setEventInfo({ title: res.title, orgName: res.orgName });
        let answers = {}
        res.survey.forEach((q: { questionId: any; }) => {
          answers = { ...answers, [q.questionId]: '' }
        })
        setAnswers(answers)
        setLoading(false);
      }
    }
    getSurveyData();
  }, [])

  const submitSurvey = async () => {
    setLoading(true)
    const surveyData = { eventListingId: +eventListingId, survey: Object.keys(answers).map((k) => { return { questionId: +k, answer: answers[+k] } }) }
    const res = await apiRequest('POST', '/survey/submit', surveyData)
    if (res.ok) {
      navigate(`/event/${eventListingId}`)
      toast.success('Survey Submitted!')
    }
    setLoading(false)
  }

  if (loading) {
    return <LoadingPage />
  } else if (!getters.isLoggedIn) {
    return <Page403 />
  } else {
    return (
      <>
        <main className='flex flex-col items-center'>
          <div className='pt-[70px] w-[90%] md:w-[75%]'>
            <p className='text-h1 md:text-h1-md text-primary'>Survey for {eventInfo.title}</p>
            <p className='text-h4 md:text-h4-md pt-2 pl-[3px]'>{eventInfo.orgName} appreciates your time for completing this survey.</p>
            <br />
            <Form className='' form={form} >
              {surveyData.map((s, i) => {
                if (s.shortInput) {
                  return <TextInput key={i} name={s.question} placeholder={s.question} onChange={(e) => {
                    setAnswers(a => { return { ...a, [s.questionId]: e.target.value } })
                  }} value={answers[s.questionId]} />
                } else {
                  return <TextAreaInput key={i} name={s.question} placeholder={s.question} onChange={(e) => {
                    setAnswers(a => { return { ...a, [s.questionId]: e.target.value } })
                  }} value={answers[s.questionId]} rows={4} />
                }
              })}
            </Form>
            <br></br>
            <PrimaryButton onClick={submitSurvey}>Submit Survey</PrimaryButton>
          </div>
          <br></br><br></br><br></br><br></br><br></br>
        </main>
      </>
    )

  };
}

export default SubmitSurvey;