import { useEffect } from "react";

export default function Logout() {

  const logout = async () => {
    try {
      const result = await fetch(`${import.meta.env.VITE_link}/logout`, {
        method: "GET",
        credentials: "include",
      });

      const data = await result.json();
      if (data) {
        window.location.replace("/")
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    logout();
  }, []);
  return (
    <>
      <h1>hi</h1>
    </>
  );
}
