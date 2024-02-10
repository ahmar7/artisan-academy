import './style.css'
import { Link } from "react-router-dom"
function HomeLogin() {


  return (
    <section
      className="register-section "
      style={{ backgroundImage: "url(assets/images/own/bg-main.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="container pt-5">
        <div className="row">
          <div className="col-lg-7 col-md-6">
            <h2 className="sec-title mb-15">Welcome back</h2>
            <p className="sec-desc">
              Get 150s of Online <span>Courses for Free</span>
            </p>
            {/* Countdown Start */}
            <div className="devis">

              <img src="assets/images/own/WorkHome.png" alt="" />
            </div>

          </div>
          <div className="col-lg-5 col-md-6">
            <div className="registration-form">
              <h4>What are you waiting for?</h4>
              <p>Get your free personalized course list</p>
              <form action="#" method="post">
                <input type="email" name="email" placeholder="Email" />
                <input type="password" name="password" placeholder="Password" />
                <input type="submit" name="submit" value="Sign in" />
                <div className="or-divider">
                  <div className="line"></div>
                  <div className="or-text">OR</div>
                  <div className="line"></div>
                </div>
                <button type="button" className="btn btn-google mt-3">
                  <img src='assets/images/own/google.svg' /> Sign in with Google</button>
                <p className='alred'>Don't have an account? <Link to="/register">Register Now</Link></p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeLogin;
