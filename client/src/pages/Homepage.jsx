import "../css/User.css";
import ContentMedia from "./components/ContentMedia";
import SidebarComponent from "./components/Sidebar";

export default function HomePage() {
  return (
    <>
      <div className="CenterContainer">
        <SidebarComponent />
        <ContentMedia />
      </div>
    </>
  );
}
