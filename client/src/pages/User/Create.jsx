import SidebarComponent from "../../components/Sidebar";
import TopbarComponent from "../../components/Topbar";

export default function CreatePost({ user }) {
  return (
    <>
      <TopbarComponent user={user} />
      <div className="CenterContainer">
        <SidebarComponent />
        <div className="CreatePost">
            <div className="PostForm">
                <form>
                    <textarea name="content"></textarea>
                </form>
            </div>
        </div>
      </div>
    </>
  );
}
