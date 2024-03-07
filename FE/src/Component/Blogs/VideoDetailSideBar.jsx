import { Link } from "react-router-dom";

function VideoDetailSideBar() {
  return (
    <div className="col-lg-4 col-md-5">
      <div className="blog-sidebar">
     
        <aside className="widget widget-categories">
          <h3 className="widget-title">Categories</h3>
          <ul>
            <li>
              <Link to="/blog">Web Design</Link>
              <span>(24)</span>
            </li>
            <li>
              <Link to="/blog">Marketing</Link>
              <span>(15)</span>
            </li>
            <li>
              <Link to="/blog">Frontend</Link>
              <span>(8)</span>
            </li>
            <li>
              <Link to="/blog">IT & Software</Link>
              <span>(13)</span>
            </li>
            <li>
              <Link to="/blog">Photography</Link>
              <span>(4)</span>
            </li>
            <li>
              <Link to="/blog">Technology</Link>
              <span>(16)</span>
            </li>
            <li>
              <Link to="/blog">General</Link>
              <span>(12)</span>
            </li>
          </ul>
        </aside>
        
       
      </div>
    </div>
  );
}

export default VideoDetailSideBar;
