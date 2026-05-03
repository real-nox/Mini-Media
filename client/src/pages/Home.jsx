import TopbarComponent from "../components/Topbar";
import GuestPage from "./Guest";
import HomePage from "./Homepage";

export default function Home({ user }) {
  return (
    <>
      <TopbarComponent user={user} />
      {user ? <HomePage /> : <GuestPage />}
    </>
  );
}
