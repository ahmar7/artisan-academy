import Prototypes from "prop-types";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
function FeatureCard({ course }) {
  const navigate = useNavigate();
  const {
    title,
    description,
    videos,
    category,
    student,
    image,
    quizzes,
    reviews,
    rating,
    price,
    offerPrice,
    author,
    courseLink,
    _id,
  } = course;
  return (
    <div
    onClick={()=> navigate(`/single-course`, { state: { id: _id } })}
      className="col-lg-4 col-md-6 shaf-item"
      data-groups='["all", "science"]'
    >
      <div className="feature-course-item">
        <div className="flipper">
          <div className="front">
            <div className="fcf-thumb">
              <img src={image} alt="" />
            </div>
            <p>{category}</p>
            <h4>{title}</h4>
            <div className="fcf-bottom">
              <Link to={courseLink}>
                <i className="icon_book_alt"></i>
                {videos.length} Lessons
              </Link>
              <Link to={courseLink}>
                <i className="icon_profile"></i>
                {quizzes.length} MCQ
              </Link>
            </div>
          </div>
          <div className="back">
            <div className="fcf-thumb">
              <img src="assets/images/home/course/6.png" alt="" />
            </div>
            <Link to={courseLink} className="c-cate">
              {title}
            </Link>
            <h4>
              {/* <Link to={courseLink}>{heading}</Link> */}
            </h4>
            <h4>{description}</h4>
            {/* <div className="ratings">
              <i className="icon_star"></i>
              <i className="icon_star"></i>
              <i className="icon_star"></i>
              <i className="icon_star"></i>
              <i className="icon_star"></i>
              <span>
                {rating} ({reviews} Reviews)
              </span>
            </div> */}
            {/* <div className="course-price">
              ${offerPrice}
              <span>${price}</span>
            </div> */}
            {/* <div className="author">
              <img src={author.img} alt="" />
              <Link to={author.profileLink}>{author.name}</Link>
            </div> */}
            <div className="fcf-bottom">
              <Link to={courseLink}>
                <i className="icon_book_alt"></i>
                {videos.length} Lessons
              </Link>
              <Link to={courseLink}>
             
                {/* <i className="icon_profile"></i> */}
                {quizzes.length} MCQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

FeatureCard.propTypes = {
  course: Prototypes.object.isRequired,
};

export default FeatureCard;
