import { Link } from "react-router-dom";

export default function SidebarComponent() {
  return (
    <div className="SideBarContainer">
      <Link className="sideBarElements" to="/create-post">
        Create
      </Link>
      <Link className="sideBarElements" to="/settings">
        Direct Messages
      </Link>
      <Link className="sideBarElements" to="/settings">
        Settings
      </Link>
    </div>
  );
}
