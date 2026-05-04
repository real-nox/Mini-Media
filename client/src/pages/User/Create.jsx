import { useState } from "react";
import SidebarComponent from "../../components/Sidebar";
import TopbarComponent from "../../components/Topbar";
import { useNavigate } from "react-router-dom";

export default function CreatePost({ user }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const navigation = useNavigate()

  function sanitizeHTML(txt) {
    const div = document.createElement("div");
    div.textContent = txt;
    return div.innerHTML;
  }

  async function submitPost(ev) {
    ev.preventDefault();
    try {
      if (!title && !content) return setError("Cannot publish empty post.");
      if (!title) return setError("Cannot publish without title.");
      if (!content) return setError("Cannot publish without content.");

      const result = await fetch(`${import.meta.env.VITE_link}/posts/create`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        credentials: "include",
        body: JSON.stringify({
          content: content,
          title: title
        })
      })
      const data = await result.json()

      if (data.success)
        return navigation("/")
      else
        return setError(data.error)
      return data
    
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <TopbarComponent user={user} />
      <div className="CenterContainer">
        <SidebarComponent />
        <div className="CreatePost">
          <div className="PostForm" onSubmit={(ev) => submitPost(ev)}>
            <form className="formPost">
              <p className={error ? "p red" : "p green"}>
                {error ? error : result}
              </p>
              <label htmlFor="title">Title Post :</label>
              <input
                type="text"
                name="title"
                id="title"
                maxLength="35"
                onChange={(e) => {
                  setTitle(sanitizeHTML(e.target.value));
                }}
              />
              <label htmlFor="content">Content :</label>
              <textarea
                name="content"
                id="content"
                maxLength="500"
                onChange={(e) => {
                  setContent(sanitizeHTML(e.target.value));
                }}
              ></textarea>
              <p>500 character max*</p>
              <button type="submit">Publish</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
