import TopbarComponent from "../components/Topbar";

export default function Home({ user }) {
  return <>{user ? "": <TopbarComponent />}</>;
}
