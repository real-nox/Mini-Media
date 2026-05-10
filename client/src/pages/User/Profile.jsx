import SidebarComponent from "../components/Sidebar";
import TopbarComponent from "../components/Topbar";

export default function Profile({ user }) {
  return (
    <>
      <TopbarComponent user={user} />
      <SidebarComponent />
      {console.log(user)}
      <div className="CenterContainer">
        <p>Hello{user ? user.username : ""} </p>
      </div>
    </>
  );
}
