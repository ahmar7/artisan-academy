import ProtoTypes from "prop-types";
import { Link } from "react-router-dom";

function FeatureCourseCard({ course, className, swiper }) {
  const {
    image,
    courseLink,
    author,
    title,
    heading,
    category,
    price,
    rating,
    reviews,
    videos,
    offerPrice,
  } = course;

  return (
    <div className={!swiper ? "col-lg-4 col-md-6" : ""}>
      <div className={`${className ? className : "feature-course-item-3"}`}>
        <div className="fcf-thumb">
          <img src={image} alt="" />
          <Link className="enroll" to={courseLink}>
            Enroll Now
          </Link>
        </div>
        <div className="fci-details">
          <Link to={courseLink} className="c-cate">
            <i className="icon_tag_alt"></i>
            {category}
          </Link>
          <h4>
            <Link to="#">{title}</Link>
          </h4>
          <div className="author">
            {/* <img src={author?.image} alt="" /> */}
            {/* <Link to={author?.profile}>{author?.name}</Link> */}
          </div>
          <div className="price-rate">
            <div className="course-price">
            <i className="icon_book_alt"></i>
                {videos?.length} videos
            </div>
            <div className="ratings">
              {/* <i className="icon_star"></i>
              <span>
                {rating} ({reviews})
              </span> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

FeatureCourseCard.propTypes = {
  course: ProtoTypes.object,
  className: ProtoTypes.string,
  swiper: ProtoTypes.bool,
};

export default FeatureCourseCard;
