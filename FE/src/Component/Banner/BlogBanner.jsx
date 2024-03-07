import { Link } from "react-router-dom";

function BlogBanner({course}) {
  return (
    <section
      className="page-banner single-p-banner"
      style={{ backgroundImage: `url(${course?.image})` }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-7">
            <Link className="post-cate" to="/course">
              Education
            </Link>
            <h2 className="banner-title">
              {course?.title}
            </h2>
            {/* <div className="bp-meta">
              <Link to="#">
                <i className="icon_clock_alt"></i>April 22, 2020
              </Link>
              <Link to="#">
                <i className="icon_chat_alt"></i>6 Comments
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BlogBanner;
