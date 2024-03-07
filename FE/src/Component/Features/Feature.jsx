import { useState } from "react";
import { course } from "../../Data/course";
import FeatureCard from "../Cards/FeatureCard";
import {useAxios} from '../../Api/http.service'
import { useQuery } from 'react-query'
function Feature() {
  const [activeCategory, setActiveCategory] = useState("All");
  const {  get } = useAxios()
  const [currentPage, setCurrentPage] = useState(1)
  const [searchText, setSearchText] = useState('')
  const fetchData = async () => {

      let endpoint = `/course?page=${currentPage}`

      if (searchText) {
        endpoint = `/course?page=${currentPage}&search=${searchText}`
      }
  
      const response = await get(endpoint)
     
      if (response) {
        setCurrentPage(response?.data?.currentPage)
      }
 
    return response?.data
  }
  const { data: courseData, isLoading } = useQuery(
      ['course',currentPage, searchText],
      fetchData,
      {
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
      }
    )
 console.log(courseData,"course")
  return (
    <section className="feature-course-section">
      <div className="container">
        <div className="row">
          <div className="col-md-5">
            <h2 className="sec-title">
              <span>Find the Right</span> Online Course for you
            </h2>
          </div>
          <div className="col-md-7">
            <ul className="shaf-filter">
              <li
                className={activeCategory === "All" ? "active" : ""}
                data-group="all"
                onClick={(e) => setActiveCategory(e.target.innerText)}
              >
                All
              </li>
              <li
                data-group="development"
                className={activeCategory === "Web Development" ? "active" : ""}
                onClick={(e) => setActiveCategory(e.target.innerText)}
              >
                Web Development
              </li>
              <li
                data-group="architecture"
                className={activeCategory === "Architecture" ? "active" : ""}
                onClick={(e) => setActiveCategory(e.target.innerText)}
              >
                Architecture
              </li>
              <li
                data-group="engineering"
                className={activeCategory === "Engineering" ? "active" : ""}
                onClick={(e) => setActiveCategory(e.target.innerText)}
              >
                Engineering
              </li>
              <li
                className={activeCategory === "Data Science" ? "active" : ""}
                data-group="science"
                onClick={(e) => setActiveCategory(e.target.innerText)}
              >
                Data Science
              </li>
            </ul>
          </div>
        </div>
        <div className="row shafull-container">
          {courseData?.courses.map((course) => (
              <FeatureCard course={course} key={course.id} />
            ))}
        </div>
      </div>
    </section>
  );
}

export default Feature;
