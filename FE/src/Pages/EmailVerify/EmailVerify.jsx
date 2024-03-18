import loading from '../../asset/loading.gif';
import success from '../../asset/success.png';
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
// import success from "../assets/img/success.png";
// import styles from "./styles.module.css";
// import { verifyEmailApi } from "../Api/Service";
import { toast } from "react-toastify";
// import Loading from "../assets/img/loading.gif";
import { useAxios } from '../../Api/http.service'
import { useQuery } from 'react-query'
const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(false);
  const [header, setHeader] = useState(false);
  const param = useParams();
  console.log(param)
  const { get, } = useAxios()
  const fetchData = async () => {
    let endpoint = `/${param.id}/verify/${param.token}`
    const response = await get(endpoint)

    return response?.data
  }

  const { data: courseData, isLoading } = useQuery(
    ['verify', param],
    fetchData,
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false
    }
  )

  return (
    <>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center', // Center the text
        backgroundColor: '#fbfbfb'
        // Optional: background color for the whole screen
      }}>
        {isLoading ? <img src={loading} alt="Loader" /> :
          <>
            <img src={success} alt="Success" style={{ maxWidth: '300px', marginBottom: '20px' }} />
            <h1>Email verified successfully</h1>
            <a href="/login" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50', // Button color
                color: 'white', // Text color
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}>Login</button>
            </a>
          </>}
      </div>
      {/* {validUrl ? (
       
      ) : (
        <div>
          {header ? (
            <h1
              style={{
                fontSize: "25px",
                marginLeft: "30px",
                marginTop: "30px",
              }}
            >
              {header}
            </h1>
          ) : (
            <div className="fulla">
          
            </div>
          )}
        </div>
      )}{" "} */}
    </>
  );
};

export default EmailVerify;