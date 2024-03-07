import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import {useAxios} from '../../Api/http.service'
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';

const QuizForm = ({quizData,id}) => {
  const [isLoading, setIsLoading] = React.useState(false);
    const initialValues = {};
    const {  post,setBearerToken} = useAxios()

    const {token} = useSelector(state => state.authReducer)
   const navigator= useNavigate()
quizData.forEach((question, index) => {
  initialValues[`question_${index + 1}`] = '';
});

const validationSchema = Yup.object().shape(
  quizData.reduce((schema, question, index) => {
    return {
      ...schema,
      [`question_${index + 1}`]: Yup.string().required('Please select an option'),
    };
  }, {})
);
const handleSubmit = async (values) => {
  
  setIsLoading(true);
  try {
    const valuesArray = Object.values(values);
  
    setBearerToken(token);
   
    const result = await post(`/enroll/quiz/${id}`, { ans: valuesArray });
    console.log('API Call Result:', result);
    if (result) {
      setIsLoading(false);
      toast.success('Successfully submitted');
      navigator('/profile');
    }
  } catch (error) {
    setIsLoading(false);
   
    toast.error(`Submission failed. Error: ${error.message}`);
  }
};


  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <Form>
        {quizData.map((question, index) => (
          <div key={index} className="question">
            <label style={{fontWeight:"bolder"}}>{`Question ${index + 1}: ${question.question}`}</label>
            {question.options.map((opt, idx) => (
              <div key={idx} className="radio-option">
                <Field
                  type="radio"
                  id={`question_${index + 1}_${idx}`}
                  name={`question_${index + 1}`}
                  value={opt}
                />
                <label style={{marginInlineStart:"8px"}} htmlFor={`question_${index + 1}_${idx}`}>{opt}</label>
              </div>
            ))}
            <ErrorMessage
              name={`question_${index + 1}`}
              component="div"
              style={{ color: 'red' }}
              className="error-message"
            />
          </div>
        ))}

        <button className="bisylms-btn" style={{marginTop:"12px",marginBottom:"12px",width:'120px'}} type="submit"> {isLoading ? <CircularProgress  size={18} color="inherit" /> : "Submit"} </button>
      </Form>
    </Formik>
  );
};

export default QuizForm;
