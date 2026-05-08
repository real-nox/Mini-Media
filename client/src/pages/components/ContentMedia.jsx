import { useEffect, useState } from "react";

const link = import.meta.env.VITE_link;

export default function ContentMedia() {
  const [currentOwner, setcurrentOwner] = useState(null);
  const [comments, setComments] = useState({});
  const [posts, setPosts] = useState([]);
  const [cursor, setCursor] = useState({});
  const [following, setFollowing] = useState({});

  useEffect(() => {
    initializeOwner();
  }, []);

  useEffect(() => {
    const user = [...new Set(posts.map((post) => post.user_id))];

    user.forEach((user_id) => {
      if (following[user_id] === undefined) {
        HasFollowed(user_id);
      }
    });
  }, [posts]);

  async function initializeOwner() {
    const owner = await GetOwner();
    if (owner) {
      setcurrentOwner(owner);
      await load();
    }
  }

  async function GetOwner() {
    try {
      const result = await fetch(`${link}/api/user`, {
        method: "GET",
        credentials: "include",
      });
      const data = await result.json();

      return data;
    } catch (err) {
      console.error(err);
    }
  }

  async function GetList() {
    try {
      const resultat = await fetch(`${link}/api/posts?limit=10`);

      if (!resultat) return;
      const data = await resultat.json();

      return data;
    } catch (err) {
      console.error(err);
    }
  }

  async function like_dislike(ev) {
    const post_id = ev.target.dataset.postId;
    const btn = ev.target;
    btn.disabled = true;
    try {
      const likescontent = document.querySelector(
        `.like-btn[data-post-id="${post_id}"]`,
      );

      const resultat = await fetch(`${link}/api/post/${post_id}/like`, {
        method: "POST",
        credentials: "include",
      });
      const data = await resultat.json();

      if (resultat.ok) {
        const current = parseInt(likescontent.dataset.likes);
        const updated = current + data;
        likescontent.dataset.likes = updated;
        likescontent.innerText = `Like ${updated}`;
      }
      btn.disabled = false;
    } catch (err) {
      console.error(err);
    }
  }

  async function show_hidecmt(ev) {
    const post_id = ev.target.dataset.postId;
    const btn = ev.target;

    btn.disabled = true;
    const commentsDiv = document.getElementById(`center-${post_id}`);

    try {
      let url = `${link}/api/post/${post_id}/comments?limit=5`;

      const resultat = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      const data = await resultat.json();

      console.log(data);

      const cmts = data.cmt;
      const owner = data.owner;

      setComments((prev) => ({
        ...prev,
        [post_id]: cmts,
      }));

      console.log(comments);

      /*if (comments.length > 0) {
        cursor[post_id] = comments[comments.length - 1].created_at;
      }*/

      document.getElementById(`comments-${post_id}`).classList.toggle("show");
      btn.disabled = false;
    } catch (err) {
      console.error(err);
    }
  }

  async function SubmitComment(ev) {
    ev.preventDefault();

    const form = ev.target;

    const post_id = form.dataset.postId;
    const textarea = form.querySelector("textarea");
    const content = textarea.value;

    try {
      ev.target.disabled = true;
      const resultat = await fetch(`${link}/api/post/${post_id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ content }),
      });

      const data = await resultat.json();

      const comment = data.cmt;

      setComments((prev) => ({
        ...prev,
        [post_id]: [...(prev[post_id] || []), comment],
      }));

      ev.target.disabled = false;
    } catch (err) {
      console.error(err);
    }
  }

  async function loadmore(post_id, btn) {
    btn.disabled = true;
    const commentsDiv = document.getElementById(`center-${post_id}`);

    try {
      let url = `${link}/api/post/${post_id}/comments?limit=5`;
      if (cursor[post_id]) url += `&cursor=${cursor[post_id]}`;

      const resultat = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      const data = await resultat.json();

      const comments = data.cmt;
      if (comments.length < 5) {
        btn.disabled = false;
        btn.innerText = "No more comments";
        return;
      }

      if (comments.length > 0)
        cursor[post_id] = comments[comments.length - 1].created_at;

      let div = "";
      for (const comment of comments) {
        div += `
                <div id="comment-${comment.comment_id}">
                    <div><a href='/${comment.username}'>${comment.username}</a></div>
                    <div><p>${comment.p_content}</p></div>`;
        if (
          currentOwner === comment.p_comment_author_id ||
          data.owner == currentOwner
        )
          div += `<div><button class="delete-cmt-btn" data-post-id="${post_id}" data-author-id="${comment.p_comment_author_id}">Delete</button></div>`;
        div += `</div>`;
      }
      commentsDiv.innerHTML += div;

      commentsDiv.classList.add("show");
      btn.disabled = false;
    } catch (err) {
      console.error(err);
    }
  }

  async function DeleteComment(ev) {
    const post_id = ev.target.dataset.postId;
    const author_id = ev.target.dataset.authorId;
    const comment_id = ev.target.dataset.commentId;
    const btn = ev.target;

    btn.disabled = true;
    try {
      const result = await fetch(`${link}/api/comments/${post_id}`, {
        method: "DELETE",
        body: JSON.stringify({ author_id, comment_id }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (result.ok) {
        btn.disabled = false;
        setComments((prev) => ({
          ...prev,
          [post_id]: prev[post_id].filter(
            (cmt) => cmt.comment_id !== comment_id,
          ),
        }));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function deletePost(post_id) {
    try {
      const result = await fetch(`${link}/posts/${post_id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (result.ok) {
        return document.getElementById(`post-${post_id}`).remove();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function HasFollowed(post_owner_id) {
    try {
      console.log(post_owner_id);
      const result = await fetch(`${link}/api/post/followed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_owner_id: post_owner_id }),
        credentials: "include",
      });

      const data = await result.json();
      setFollowing((prev) => ({
        ...prev,
        [post_owner_id]: data,
      }));
      return;
    } catch (err) {
      console.error(err);
    }
  }

  async function un_follow(user_id) {
    try {
      const result = await fetch(`${link}/api/post/un_follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_owner_id: user_id }),
        credentials: "include",
      });

      console.log(await result);
      const data = await result.json();

      if (data) console.log(data);
      setFollowing((prev) => ({
        ...prev,
        [user_id]: data,
      }));
    } catch (err) {
      console.error(err);
    }
  }

  function buildCommentsHTML(post_id, owner, comment, currentOwner) {
    return (
      <div
        key={`comment-${comment.comment_id}`}
        id={`comment-${comment.comment_id}`}
      >
        <div>
          <a href="/${comment.username}">{comment.username}</a>
        </div>
        <div>
          <p>{comment.p_content}</p>
        </div>
        {currentOwner == comment.p_comment_author_id ||
        owner == currentOwner ? (
          <div>
            <button
              className="delete-cmt-btn"
              data-post-id={post_id}
              data-comment-id={comment.comment_id}
              data-author-id={comment.p_comment_author_id}
              onClick={(ev) => DeleteComment(ev)}
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  function buildPostHTML(post, currentOwner, isfollowed) {
    return (
      <>
        <div className="post">
          <div className="user">
            <a href={`/${post.username}`}>{post.username}</a>
            {post.user_id != currentOwner ? (
              <button
                className="follow_unfollow"
                data-id={post.user_id}
                onClick={() => {
                  un_follow(post.user_id);
                }}
              >
                {isfollowed ? "Unfollow" : "Follow"}
              </button>
            ) : (
              <div className="post-actions">
                <button className="options-btn" data-id={post.post_id}>
                  ⋮
                </button>
                <div className="post-menu hidden" data-id={post.post_id}>
                  <button className="edit-btn" data-id={post.post_id}>
                    Edit
                  </button>
                  <button className="delete-btn" data-id={post.post_id}>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="content">
            {(post.post_img || post.link) && (
              <img src={post.post_img || post.link} alt="post image" />
            )}
            {post.p_content && (
              <div className="contentP">
                <p>{post.p_content}</p>
              </div>
            )}
          </div>
          <div className="itemsbar">
            <div className="bottomarticle">
              <span>
                <button
                  className="like-btn"
                  data-post-id={post.post_id}
                  data-likes={post.likes}
                  onClick={(ev) => like_dislike(ev)}
                >
                  Like {post.likes}
                </button>
              </span>
              <span>
                <button
                  className="comments-btn"
                  data-post-id={post.post_id}
                  onClick={(ev) => show_hidecmt(ev)}
                >
                  Comments
                </button>
              </span>
            </div>
            <div id={`comments-${post.post_id}`} className="comments">
              <div className="topcmtbtn">
                <form
                  className="add-comment-form"
                  data-post-id={post.post_id}
                  onSubmit={(ev) => SubmitComment(ev)}
                >
                  <span>
                    <textarea
                      name="comment"
                      placeholder="Add a comment here."
                    ></textarea>
                    <button type="submit">Send</button>
                  </span>
                </form>
              </div>
              {comments[post.post_id]?.map((comment) =>
                comment ? buildCommentsHTML(
                  post.post_id,
                  comment.p_comment_author_id,
                  comment,
                  currentOwner,
                ) : null
              )}
              <div className="center" id={`center-${post.post_id}`}></div>
              <div className="btnplace">
                <button
                  className="loadmore-btn"
                  data-post-id={post.post_id}
                  onClick={(ev) => show_hidecmt(ev)}
                >
                  Load More
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  async function load() {
    setInterval(
      async () => {
        const list = await GetList();

        if (list) {
          setPosts(list);
        }
      },
      1000 * 60 * 5,
    );

    const list = await GetList();

    if (list) {
      setPosts(list);
    }

    document.getElementById("Posts").addEventListener("click", async (ev) => {
      //Like btn

      //Comments btn

      //Load more btn
      if (ev.target.classList.contains("loadmore-btn")) {
        const post_id = ev.target.dataset.postId;
        const btn = ev.target;
        await loadmore(post_id, btn);
      }

      //Delete Cmt btn
      /*if (ev.target.classList.contains("delete-cmt-btn")) {
        const post_id = ev.target.dataset.postId;
        const author_id = ev.target.dataset.authorId;
        const comment_id = ev.target.dataset.commentId;
        const btn = ev.target;

        await deletecmt(comment_id, post_id, author_id, btn);
      }*/
    });

    document.querySelectorAll(".options-btn").forEach((opt_btn) =>
      opt_btn.addEventListener("click", (ev) => {
        const post_id = opt_btn.dataset.id;
        const div = document.querySelector(`.post-menu[data-id='${post_id}']`);

        if (div) div.classList.toggle("hidden");
      }),
    );

    document.querySelectorAll(".edit-btn").forEach((edit_btn) =>
      edit_btn.addEventListener("click", async (ev) => {
        const post_id = edit_btn.dataset.id;
        const postDiv =
          edit_btn.parentElement.parentElement.parentElement.parentElement;

        const center = postDiv.querySelector(".content");
        const content = center.querySelector("p").innerText;

        const textarea = document.createElement("textarea");
        textarea.value = content;
        textarea.classList.add("edit-textarea");

        const savebtn = document.createElement("button");
        savebtn.textContent = "Save";
        const cancelbtn = document.createElement("button");
        cancelbtn.textContent = "Cancel";

        center.innerHTML = "";
        center.appendChild(textarea);
        center.appendChild(savebtn);
        center.appendChild(cancelbtn);

        savebtn.addEventListener("click", async () => {
          const newcontent = textarea.value;
          savebtn.disabled = true;

          const response = await fetch(`/posts/${post_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: newcontent }),
          });

          const result = await response.json();

          if (result.success) {
            center.innerHTML = `<p class="post-body">${newcontent}</p>`;
          } else {
            alert(result.error.join(", "));
          }

          savebtn.disabled = false;
        });

        cancelbtn.addEventListener("click", () => {
          center.innerHTML = `<p class="post-body">${content}</p>`;
        });
      }),
    );

    document.querySelectorAll(".delete-btn").forEach((delete_btn) =>
      delete_btn.addEventListener("click", async (ev) => {
        ev.preventDefault();
        const post_id = delete_btn.dataset.id;
        await deletePost(post_id);
      }),
    );
  }

  return (
    <>
      <div id="maincontainer" className="maincontainer">
        <div id="Posts">
          {posts.map((post) => (
            <article key={`post-${post.post_id}`}>
              {buildPostHTML(post, currentOwner, following[post.user_id])}
            </article>
          ))}
        </div>
        <div>
          <footer>
            Mini Media - 2026 &copy;
          </footer>
        </div>
      </div>
    </>
  );
}
