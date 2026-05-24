import TopbarComponent from "./components/Topbar";
import GuestPage from "./Guest";
import HomePage from "./Homepage";

export default function Home({ user }) {
  return (
    <>
      <TopbarComponent user={user} />
      { console.log(user)}
      {user ? <HomePage /> : <GuestPage />}
    </>
  );
}
