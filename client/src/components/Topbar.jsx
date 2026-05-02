import { Link } from "react-router-dom";

function TopbarComponent() {
  return (
    <>
      <div className="TopbarHolder">
        <div className="TopElements">
          <div className="LeftBar">
            <h3>Mini Media</h3>
          </div>
          <div className="RightBar">
            <Link className="LoginBTN" to="/login">
              Login
            </Link>
            <Link className="RegisterBTN" to="/register">
              Register
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default TopbarComponent;
