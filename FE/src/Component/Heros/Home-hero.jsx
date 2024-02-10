import { Link } from "react-router-dom";

function HomeHero({ scrollToComponent }) {
  const handleButtonClick = () => {
    scrollToComponent("elements");
  };
  return (
    <section
      className="hero-banner-1"
      style={{ backgroundImage: "url(assets/images/own/bg-main.jpg)" }}
    >
      {/* shape  */}
      <div className="shape-wrap">
        <div className="b-shape-1">
          <img src="assets/images/home/shape-1.png" alt="" />
        </div>
        <div className="b-shape-2">
          <img src="assets/images/home/shape-2.png" alt="" />
        </div>
        <div className="b-shape-3">
          <img src="assets/images/home/shape-3.png" alt="" />
        </div>
        <div className="b-shape-4">
          <img src="assets/images/home/shape-4.png" alt="" />
        </div>
      </div>
      {/* shape  */}
      <div className="container">
        <div className="row">
          <div className="col-lg-5 col-md-5">
            <div className="hero-content">
              <div className="container mb-5">
                <div className="d-flex align-items-center">
                  <hr className="f 1 har" />
                  <h3 className="mx-3 mb-0 hai">"it's what we do"</h3>
                </div>
                {/* Your content goes here */}
              </div>

              <h2>Craftmanship in every risk</h2>
              {/* <p>
                Loo you mug lurgy baking cakes boot cracking goal morish up the
                duff haggle hotpot faff about no biggie burke, is bleeder
                bamboozled bite your.
              </p> */}
              <div onClick={handleButtonClick} className="bisylms-btn mt-5">
                <i class="fa-solid fa-arrow-down-up-across-line"></i>  Scroll down
              </div>
            </div>
          </div>
          <div className="col-lg-7 col-md-7">
            <div className="banner-thumb">
              <img src="assets/images/own/data.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeHero;
