import { useEffect, useState } from "react";
import Preloader from "../../Component/Preloader";
import Header from "../../Component/Headers";
import Footer from "../../Component/Footer/Footer";
import Banner from "../../Component/Banner/Banner";
import { course } from "../../Data/course";
import FeatureCourseCard from "../../Component/Cards/FeatureCourseCard";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import LatestCourseCard from "../../Component/Cards/LatestCourseCard";
import ReviewForm from "../../Component/Form/ReviewForm";
import CircularProgress from '@mui/material/CircularProgress';
import GotoTop from "../../Component/GotoTop";
import {useAxios} from '../../Api/http.service'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useMutation } from 'react-query';
import { toast } from "react-toastify";
function CourseSingle() {
  // const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState("Overview");
  const {  get,post,setBearerToken} = useAxios()
  const location = useLocation();
  const navigation = useNavigate();
  const {token}=useSelector(state=>state.authReducer)
  const { id } = location.state || {};

  const fetchData = async () => {
 if(!id) return
    let endpoint = `/course/${id}`


    const response = await get(endpoint)
   
  

  return response?.data
}
const { data: courseData, isLoading } = useQuery(
    ['single',id],
    fetchData,
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false
    }
  )
 
  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return "<span className=" + className + " myPagination" + "></span>";
    },
  };
  // let content = undefined;
  // useEffect(() => {
  //   setIsLoading(false);
  // }, [isLoading]);

  // if (isLoading) {
  //   content = <Preloader />;
  // } else {
  //   content = (
  
  //   );
  // }
  const handleEnrollment = async() => {
    setBearerToken(token)
    const result = await post(`/enroll/${id}`,{})
  return result.data
  }
  const enrollmentMutation = useMutation(
    handleEnrollment,
    {
      onSuccess: (data) => {
        navigation('/profile')
      },
      onError: (error) => {
         
     
      
       toast.error(error.response.data.error || "Something went wrong, please try again")
      },
    }
  );
  return (
    <>
    {isLoading ? <Preloader />:
    <>
        <Header logo="assets/images/logo4.png" joinBtn={true} />
        <Banner title={courseData?.singleCourse?.title} background={courseData?.singleCourse?.image} />
        {/* course section start */}
        <section className="course-details-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-9">
                <div className="single-course-area">
                  <div className="course-top">
                    <h4>{courseData?.singleCourse?.title}</h4>
                    <div className="course-meta">
                      <div className="author">
                        <img src="assets/images/home3/course/a1.png" alt="" />
                        <span>Teacher</span>
                        <span>{courseData?.instructors[0].name}</span>
                        {/* <Link to="/">Anthony</Link> */}
                      </div>
                      <div className="categories">
                        <span>Categories:</span>
                        <span>{courseData?.singleCourse?.category}</span>
                        {/* <Link to="/">Art & Design</Link> */}
                      </div>
                      <div className="ratings">
                        <span>4.5 (9 Reviews)</span>
                        <i className="icon_star"></i>
                        <i className="icon_star"></i>
                        <i className="icon_star"></i>
                        <i className="icon_star"></i>
                        <i className="icon_star"></i>
                      </div>
                    </div>
                    {/* <div className="course-price">
                      $75.00
                      <span>$92.00</span>
                    </div> */}
                  </div>
                  <div className="sc-thumb">
                    <img src={courseData?.singleCourse?.image} alt="" />
                  </div>
                  <div className="course-tab-wrapper">
                    <ul className="course-tab-btn nav nav-tabs">
                      <li>
                        <a
                          onClick={(e) => setActiveView(e.target.innerText)}
                          className={activeView === "Overview" ? "active" : ""}
                        >
                          <i className="icon_ribbon_alt"></i>Overview
                        </a>
                      </li>
                      <li>
                        <a
                          onClick={(e) => setActiveView(e.target.innerText)}
                          className={
                            activeView === "Curriculum" ? "active" : ""
                          }
                        >
                          <i className="icon_book_alt"></i>Curriculum
                        </a>
                      </li>
                      <li>
                        <a
                          onClick={(e) => setActiveView(e.target.innerText)}
                          className={
                            activeView === "Instructors" ? "active" : ""
                          }
                        >
                          <i className="icon_profile"></i>Instructors
                        </a>
                      </li>
                      <li>
                        <a
                          onClick={(e) => setActiveView(e.target.innerText)}
                          className={activeView === "Reviews" ? "active" : ""}
                        >
                          <i className="icon_star"></i>Reviews
                        </a>
                      </li>
                    </ul>
                    {/* Tab Content  */}
                    <div className="tab-content">
                      {/* Overview Tab  */}
                      {activeView === "Overview" && (
                        <div
                          className="tab-pane fade in show active"
                          id="overview"
                          role="tabpanel"
                        >
                          <div className="overview-content">
                            <h4>Course Description</h4>
                            <p>
                             {courseData?.Curriculum?.description}
                            </p>
                           
                            <h4>Course Description</h4>
                            <ul>
                              <li>
                                <i className="icon_check_alt2"></i>Learn The
                                Latest Skills
                                <span>
                                  He lost his bottle starkers up the duff wind
                                  up easy peasy cracking goal cheers I butty
                                  only a quid he legged it, cuppa the little
                                  rotter bevvy bugger all mate spiffing good
                                  time.
                                </span>
                              </li>
                              <li>
                                <i className="icon_check_alt2"></i>Earn a
                                Certificate or Degree
                                <span>
                                  Chimney pot barmy easy peasy he lost his
                                  bottle nancy boy old cor blimey guvnor bog
                                  tickety-boo geeza, Richard on your bike mate
                                  down the pub are you taking.
                                </span>
                              </li>
                              <li>
                                <i className="icon_check_alt2"></i>Get Ready for
                                a Career
                                <span>
                                  Lost the plot plastered he lost his bottle
                                  blatant barney butty are you taking the piss
                                  porkies me old mucker young delinquent
                                  smashing so I said pear shaped cheeky say.
                                </span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      )}
                      {/* Overview Tab  */}
                      {/* Curriculum Tab  */}
                      {activeView === "Curriculum" && (
                        <div
                          className="tab-pane fade in show active"
                          id="curriculum"
                          role="tabpanel"
                        >
                          <div className="curriculum-item" id="id_1">
                            <div className="card-header" id="cc_1">
                              <h5 className="mb-0">
                                <button
                                  className="btn btn-link"
                                  data-toggle="collapse"
                                  data-target="#acc_1"
                                  aria-expanded="true"
                                  aria-controls="acc_1"
                                >
                                 Optimizing the Course Learning Context
                                </button>
                              </h5>
                            </div>
                            {courseData?.Curriculum?.videos.map((v,index)=>
(
                            <div
                              id="acc_1"
                              className="collapse show"
                              aria-labelledby="cc_1"
                              data-parent="#id_1"
                            >
                              <div className="card-body">
                                <div className={`ci-item ${index % 2 === 0 ? 'with-bg' : ''}`}>
                                  <h5>
                                    <i className="icon_menu-square_alt2"></i>
                                   
                                    {v?.title}
                                   
                                  </h5>
                                  <div className="ci-tools">
                                    {/* <Link to="/" className="time">
                                      02 hour
                                    </Link> */}
                                    <Link to="/" className="lock">
                                      <i className="icon_lock_alt"></i>
                                    </Link>
                                  </div>
                                </div>
                            
                              </div>
                            </div>))}
                          </div>
                        
                        </div>
                      )}
                      {/* Curriculum Tab  */}
                      {/* Instructors Tab  */}
                      {activeView === "Instructors" && (
                        <div
                          className="tab-pane fade in show active"
                          id="instructors"
                          role="tabpanel"
                        >
                          <div className="teacher-item-3">
                            <div className="teacher-thumb">
                              <img
                                src="assets/images/single-course/i1.jpg"
                                alt=""
                              />
                            </div>
                            <div className="teacher-meta">
                              <h5>
                                <Link to="/">Dianne Ameter</Link>
                              </h5>
                              <span>Illustrator</span>
                              <p>
                                I don't want no agro car boot lavatory wind up
                                twit haggle spiffing show off show off pick your
                                nose and blow off spend a penny David zonked
                                what a plonker are you taking.
                              </p>
                              <div className="teacher-social">
                                <a href="#">
                                  <i className="social_facebook"></i>
                                </a>
                                <a href="#">
                                  <i className="social_twitter"></i>
                                </a>
                                <a href="#">
                                  <i className="social_linkedin"></i>
                                </a>
                              </div>
                            </div>
                          </div>
                          <div className="teacher-item-3">
                            <div className="teacher-thumb">
                              <img
                                src="assets/images/single-course/i2.jpg"
                                alt=""
                              />
                            </div>
                            <div className="teacher-meta">
                              <h5>
                                <a href="#">Hugh Saturation</a>
                              </h5>
                              <span>Photographer</span>
                              <p>
                                I don't want no agro car boot lavatory wind up
                                twit haggle spiffing show off show off pick your
                                nose and blow off spend a penny David zonked
                                what a plonker are you taking.
                              </p>
                              <div className="teacher-social">
                                <a href="#">
                                  <i className="social_facebook"></i>
                                </a>
                                <a href="#">
                                  <i className="social_twitter"></i>
                                </a>
                                <a href="#">
                                  <i className="social_linkedin"></i>
                                </a>
                              </div>
                            </div>
                          </div>
                          <div className="teacher-item-3">
                            <div className="teacher-thumb">
                              <img
                                src="assets/images/single-course/i3.jpg"
                                alt=""
                              />
                            </div>
                            <div className="teacher-meta">
                              <h5>
                                <Link to="/">Jim Séchen</Link>
                              </h5>
                              <span>Stylist & Author</span>
                              <p>
                                I don't want no agro car boot lavatory wind up
                                twit haggle spiffing show off show off pick your
                                nose and blow off spend a penny David zonked
                                what a plonker are you taking.
                              </p>
                              <div className="teacher-social">
                                <a href="#">
                                  <i className="social_facebook"></i>
                                </a>
                                <a href="#">
                                  <i className="social_twitter"></i>
                                </a>
                                <a href="#">
                                  <i className="social_linkedin"></i>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Instructors Tab  */}
                      {/* Reviews Tab  */}
                      {/* {activeView === "Reviews" && (
                        <div
                          className="tab-pane fade in show active"
                          id="reviews"
                          role="tabpanel"
                        >
                          <div className="reviw-area">
                            <h4>Reviews</h4>
                            <div className="reating-details">
                              <div className="average-rate">
                                <p>Average Rating</p>
                                <div className="rate-box">
                                  <h2>4.8</h2>
                                  <div className="ratings">
                                    <i className="icon_star"></i>
                                    <i className="icon_star"></i>
                                    <i className="icon_star"></i>
                                    <i className="icon_star"></i>
                                    <i className="icon_star"></i>
                                  </div>
                                  <span>4 Reviews</span>
                                </div>
                              </div>
                              <div className="details-rate">
                                <p>Detailed Rating</p>
                                <div className="detail-rate-box">
                                  <div className="rate-item">
                                    <p>5</p>
                                    <div className="progress">
                                      <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: "100%" }}
                                        aria-valuenow="100"
                                        aria-valuemin="0"
                                        aria-valuemax="100"
                                      ></div>
                                    </div>
                                    <span>100%</span>
                                  </div>
                                  <div className="rate-item">
                                    <p>4</p>
                                    <div className="progress">
                                      <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: "30%" }}
                                        aria-valuenow="30"
                                        aria-valuemin="0"
                                        aria-valuemax="30"
                                      ></div>
                                    </div>
                                    <span>30%</span>
                                  </div>
                                  <div className="rate-item">
                                    <p>3</p>
                                    <div className="progress">
                                      <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: "20%" }}
                                        aria-valuenow="20"
                                        aria-valuemin="0"
                                        aria-valuemax="20"
                                      ></div>
                                    </div>
                                    <span>20%</span>
                                  </div>
                                  <div className="rate-item">
                                    <p>2</p>
                                    <div className="progress">
                                      <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: "10%" }}
                                        aria-valuenow="10"
                                        aria-valuemin="0"
                                        aria-valuemax="10"
                                      ></div>
                                    </div>
                                    <span>10%</span>
                                  </div>
                                  <div className="rate-item">
                                    <p>1</p>
                                    <div className="progress">
                                      <div
                                        className="progress-bar"
                                        role="progressbar"
                                        style={{ width: "0%" }}
                                        aria-valuenow="0"
                                        aria-valuemin="0"
                                        aria-valuemax="0"
                                      ></div>
                                    </div>
                                    <span>0%</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="review-rating">
                              <h5>Comments ( 3 )</h5>
                              <ol>
                                <li>
                                  <div className="single-comment">
                                    <img
                                      src="assets/images/single-course/r1.png"
                                      alt=""
                                    />
                                    <h5>
                                      <Link to="/">Dianne Ameter</Link>
                                    </h5>
                                    <span>August 8, 2012 at 9:22 am</span>
                                    <div className="comment">
                                      <p>
                                        I don't want no agro car boot lavatory
                                        wind up twit haggle spiffing show off
                                        show off pick your nose and blow off
                                        spend a penny David zonked what a
                                        plonker are you taking.
                                      </p>
                                    </div>
                                    <div className="ratings">
                                      <i className="icon_star"></i>
                                      <i className="icon_star"></i>
                                      <i className="icon_star"></i>
                                      <i className="icon_star"></i>
                                      <i className="icon_star"></i>
                                    </div>
                                    <div className="c-border"></div>
                                  </div>
                                </li>
                                <li>
                                  <div className="single-comment">
                                    <img
                                      src="assets/images/single-course/r2.png"
                                      alt=""
                                    />
                                    <h5>
                                      <Link to="/">Hugh Saturation</Link>
                                    </h5>
                                    <span>March 14, 2012 at 10:13 am</span>
                                    <div className="comment">
                                      <p>
                                        Lavatory wind up twit haggle spiffing
                                        show off show off pick your nose and
                                        blow off spend a penny David zonked what
                                        a plonker are you taking.
                                      </p>
                                    </div>
                                    <div className="ratings">
                                      <i className="icon_star"></i>
                                      <i className="icon_star"></i>
                                      <i className="icon_star"></i>
                                      <i className="icon_star"></i>
                                      <span>
                                        <i className="icon_star"></i>
                                      </span>
                                    </div>
                                    <div className="c-border"></div>
                                  </div>
                                </li>
                                <li>
                                  <div className="single-comment">
                                    <img
                                      src="assets/images/single-course/r3.png"
                                      alt=""
                                    />
                                    <h5>
                                      <Link to="/">Jim Séchen</Link>
                                    </h5>
                                    <span>April 16, 2012 at 12:15 pm</span>
                                    <div className="comment">
                                      <p>
                                        He lost his bottle cheeky bugger such
                                        fibber Harry porkies spiffing good time
                                        wind up argy bargy arse bite your arm
                                        off bugger.
                                      </p>
                                    </div>
                                    <div className="ratings">
                                      <i className="icon_star"></i>
                                      <i className="icon_star"></i>
                                      <i className="icon_star"></i>
                                      <span>
                                        <i className="icon_star"></i>
                                        <i className="icon_star"></i>
                                      </span>
                                    </div>
                                  </div>
                                </li>
                              </ol>
                            </div>
                            <div className="review-form-area">
                              <h5>Leave a Comment</h5>
                              <div className="comment-form">
                                <ReviewForm />
                              </div>
                            </div>
                          </div>
                        </div>
                      )} */}
                      {/*  Reviews Tab  */}
                    </div>
                    {/* Tab Content  */}
                  </div>
                  {/* share link start  */}
                  <div className="post-share">
                    <h5>Share:</h5>
                    <a className="fac" href="#">
                      <i className="social_facebook"></i>
                    </a>
                    <a className="twi" href="#">
                      <i className="social_twitter"></i>
                    </a>
                    <a className="goo" href="#">
                      <i className="social_googleplus"></i>
                    </a>
                  </div>
                  {/* share link end  */}
                  <div className="related-course">
                    <h3>Related Courses</h3>
                    <Swiper
                      spaceBetween={20}
                      pagination={pagination}
                      modules={[Pagination]}
                      className="mySwiper mySwiper3 "
                      breakpoints={{
                        640: {
                          slidesPerView: 2,
                          spaceBetween: 20,
                        },
                        768: {
                          slidesPerView: 3,
                          spaceBetween: 20,
                        },
                      }}
                      autoplay={{
                        delay: 2500,
                        disableOnInteraction: false,
                      }}
                    >
                      {/* Single Slider item  */}
                      <div className="related-course-slider">
                        {courseData?.relativeCourse?.map((item) => (
                          <SwiperSlide key={item.id}>
                            <FeatureCourseCard
                              className="feature-course-item-4"
                              course={item}
                              swiper={true}
                            />
                          </SwiperSlide>
                        ))}
                      </div>
                    </Swiper>
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="course-sidebar">
                  <aside className="widget">
                    <div className="info-course">
                      <ul>
                        <li>
                          <i className="icon_house_alt"></i>
                          <span>Instructor: </span> {courseData?.instructors[0].name}
                        </li>
                        <li>
                          <i className="icon_document_alt"></i>
                          <span>Lectures Videos: </span> {courseData?.singleCourse?.videos?.length}
                        </li>
                        <li>
                          <i className="icon_clock_alt"></i>
                          <span>Duration: </span> 10 weeks
                        </li>
                        {/* <li>
                          <i className="icon_profile"></i>
                          <span>Enrolled: </span> {courseData?.enrolledStudents?.length} students
                        </li> */}
                        <li>
                          <i className="icon_cog"></i>
                          <span>Language: </span> English
                        </li>
                        {/* <li>
                          <i className="icon_calendar"></i>
                          <span>Deadline: </span> 16 April 2020
                        </li> */}
                      </ul>
                      {token ?<div className="bisylms-btn" onClick={()=>{enrollmentMutation.mutate();}} >
                      {enrollmentMutation.isLoading ? <CircularProgress  size={18} color="inherit" /> : "Enroll Course"} 
                  
                      </div>:<div className="bisylms-btn" onClick={()=>{navigation("/login"); }} >
                       Enroll Course
                  
                      </div>}
                      
                    </div>
                  </aside>
                  <aside className="widget">
                    <h3 className="widget-title">Latest Courses</h3>
                    {courseData?.latestCourses.map((v)=> <LatestCourseCard
                      img={v.image}
                      name={v.title}
                      price={v.category}
                    />)}
                   
              
                  </aside>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* course section end  */}
        <Footer />
        <GotoTop />
      </>
}
      </>
  );
}

export default CourseSingle;
