import SidebarComponent from "../components/Sidebar";
import TopbarComponent from "../components/Topbar";

export default function Settings({ user }) {
  return (
    <>
      <TopbarComponent user={user} />
      <SidebarComponent />
    </>
  );
}
