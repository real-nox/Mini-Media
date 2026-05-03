import { Link } from "react-router-dom";

function TopbarComponent({ user }) {
  return (
    <>
      <div className="TopbarHolder">
        <div className="TopElements">
          <div className="LeftBar">
            <Link className="AppTitle" to="/">Mini Media</Link>
          </div>
          {user ? (
            <div className="RightBar">
              <Link to="/profile">Profile</Link>
            </div>
          ) : (
            <div className="RightBar">
              <Link className="LoginBTN" to="/login">
                Login
              </Link>
              <Link className="RegisterBTN" to="/register">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TopbarComponent;
