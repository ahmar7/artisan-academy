import { useEffect, useState } from "react";
import Preloader from "../../Component/Preloader";
import Header from "../../Component/Headers";
import Footer from "../../Component/Footer/Footer";
import BlogBanner from "../../Component/Banner/BlogBanner";
import DetailsSideBar from "../../Component/Blogs/DetailsSideBar";
import CommentForm from "../../Component/Form/CommentForm";
import Comment from "../../Component/Comment/Comment";
import GotoTop from "../../Component/GotoTop";
import VideoDetailSideBar from "../../Component/Blogs/VideoDetailSideBar";
import Player from "../../Component/Video/Player";
import { useLocation } from 'react-router-dom';
import { useAxios } from '../../Api/http.service'
import { useQuery } from 'react-query'
import { useSelector } from "react-redux";
import CircularProgress from '@mui/material/CircularProgress';
import { useMutation, useQueryClient } from 'react-query';
import QuizModal from "../../Component/Model/Quiz";
import QuizForm from "../../Component/Model/QuizForm";
function Videos() {
  const [isLoading, setIsLoading] = useState(true);
  const [vidoesData, setVideosData] = useState({});
  const [courseVideos, setCourseVideos] = useState({});
  const [quizView, setQuizView] = useState(false);
  const { get, post, setBearerToken } = useAxios()
  const { token } = useSelector(state => state.authReducer)
  const location = useLocation();
  const queryClient = useQueryClient()
  
  const { id } = location.state || {};

  const fetchData = async () => {

    setBearerToken(token)

    let endpoint = `/enroll/course/${id}`


    const response = await get(endpoint)

    if (response.data) {
      const { videosWithCompletionStatus } = response.data
      const videosFilter = videosWithCompletionStatus.find(e => e.isNextUnlocked && !e.completed)
      setVideosData(videosFilter)
      const quizCheck=videosWithCompletionStatus.length==videosWithCompletionStatus.filter((e)=>e.completed).length
        if(quizCheck)
        {
          setQuizView(true)
        
        }

    }

    return response?.data
  }

  const { data: courseData, } = useQuery(
    ['viewcourse', id],
    fetchData,
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false
    }
  )

  let content = undefined;
  useEffect(() => {
    setIsLoading(false);
    setCourseVideos(vidoesData)
  }, [isLoading,vidoesData]);

  const handleEnrollment = async () => {
    setBearerToken(token)
    const result = await post(`/enroll/${id}/video/${vidoesData?._id}`, {})
   
    return result.data
  }
  const enrollmentMutation = useMutation(
    handleEnrollment,
    {
      onSuccess: (data) => {
        // navigation('/profile')
        queryClient.invalidateQueries('viewcourse')
      },
      onError: (error) => {

        alert(error);
      },
    }
  );
  const handleComplete = () => {
    if (vidoesData) {
      enrollmentMutation.mutate()
    }

  }
  return (


    <>
      <Header logo="assets/images/logo4.png" joinBtn={true} />
      <BlogBanner course={courseData?.course} />

      <div className="maina" style={{ display: "flex", flexDirection: "row", width: "100%", paddingTop: '60px' }}>
        <div className="title-ra" style={{ width: '20%', margin: '10px', paddingInline: "20px" }} >
          <div>
            <h3>Videos Title</h3>
          </div>
          {courseData?.videosWithCompletionStatus.map((e, i) => <div onClick={() => { 
            if(e.isNextUnlocked)
            {
              setVideosData(e)
              setQuizView(false); 
            }  }} key={i} style={{ display: 'flex', flexDirection: "column", }} >
            <div style={{ display: 'flex', flexDirection: "row", justifyContent: "space-between", cursor:"pointer", alignItems: "center", paddingBlockStart: "10px", fontWeight:e._id==vidoesData?._id?'bolder':''}}>
              <p>{e.title} </p>



              {(e.completed || i == 0) ? <p style={{ color: "green" }}> <i className="fa-solid fa-circle-check"></i></p> : e.isNextUnlocked ? <i class="fa-regular fa-circle"></i> : <p> <i className="fa-solid fa-lock"></i></p>}
            </div>
            <div style={{ borderBlockEnd: "1px solid", marginInline: "10px" }} />
          </div>
          )}
          <div style={{ paddingBlockStart: "20px" }}>
            <h3>Quiz</h3>
          </div>
          <div onClick={() => {
            if (courseData?.enroldata?.quizTaken) {
              setQuizView(true)
            }
          }} style={{ display: 'flex', flexDirection: "row",cursor:"pointer", justifyContent: "space-between", alignItems: "center", paddingBlockStart: "10px" }}>
            <p>Final Test</p>
            {(courseData?.enroldata?.quizTaken && courseData?.enroldata?.quizPoints > 0) ? <p style={{ color: "green" }}> <i className="fa-solid fa-circle-check"></i></p> : courseData?.enroldata?.quizTaken ? <i class="fa-regular fa-circle"></i> : <p> <i className="fa-solid fa-lock"></i></p>}
          </div>
          <div style={{ borderBlockEnd: "1px solid", marginInline: "10px" }} />
        </div >

        <div className="mais" style={{ width: "60%" }}>
          {quizView ?
            <div style={{ marginTop: "20px", marginLeft: "20px" }}>
              <QuizForm quizData={courseData?.course?.quizzes} id={id} />
            </div>
            : <>
              <div style={{ marginTop: "20px", marginLeft: "20px" }}>
                <Player videoLink={courseVideos?.videoLink} permission={courseVideos?.completed} handleComplete={handleComplete} />
              </div>
              <h1 className="adka" style={{ paddingInlineStart: "20px" }}>Description</h1>
              {/* <h5 style={{paddingInlineStart:"20px"}}>{vidoesData?.title}</h5> */}
              <p style={{ paddingInlineStart: "20px" }}>{courseVideos?.description}</p>
              {/* <div   style={{display:"flex", flexDirection:"row",justifyContent:"end"}}>
  <p onClick={()=>{enrollmentMutation.mutate();}} className="bisylms-btn">        {enrollmentMutation.isLoading ? <CircularProgress  size={18} color="inherit" /> : "Complete Video"} </p></div> */}
            </>}
        </div>
      </div>
      <Footer />
      {/* <QuizModal showData={courseData?.course?.quizzes} /> */}
      <GotoTop />
    </>
  )
}

export default Videos;
