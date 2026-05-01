import { Link } from "react-router-dom";

function TopbarComponent({ user }) {
  return (
    <>
      <div className="TopbarHolder">
        <div className="TopElements">
          <div className="LeftBar"></div>
          <div className="RightBar">
            {user ? <span>Hey {user} </span> : <p>Wow</p>}
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
