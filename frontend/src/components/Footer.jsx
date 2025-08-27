import { Outlet } from "react-router-dom";
import Header from "./Header";

function Footer(){
  return (
    <footer className="footer">
      <small>© {new Date().getFullYear()} PetCare</small>
    </footer>
  );
}

export default function Layout(){
  return (
    <>
      <Header />
      <main className="container">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
