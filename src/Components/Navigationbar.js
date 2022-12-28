import { getAuth, signOut } from "firebase/auth";
import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import UserContext from "../Contexts/UserContext";
import Logout from "./Logout";

function Navigationbar() {
  const nav = useNavigate();
  const {user, setUser } = useContext(UserContext);

 

  const handleLogout = (e) => {
    e.preventDefault();
    const auth = getAuth();
    signOut(auth)
      .then(() => {
          console.log("logged out")
          setUser();
          console.log(user);
      })
      .catch((error) => {
        console.log(error)
      });
    nav("/");
  };

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark"   position="relative" className="route-outlet" >
        <Container>
          <Navbar.Brand className="" href="/">JUGAAD</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto ms-1">
              <Link to="/" style={{ textDecoration: "none", color: "white", marginRight: '15px' }}>
                Home 
              </Link>
              <Link
                to="/about"
                style={{ textDecoration: "none", color: "white", marginRight: '15px' }}
              >
                About Us 
              </Link>
              <Link
                to="/products"
                style={{ textDecoration: "none", color: "white", marginRight: '15px' }}
              >
                Products
              </Link>
              <Link
                to="/blogs"
                style={{ textDecoration: "none", color: "white",marginRight: '15px' }}
              >
                Blogs
              </Link>
              <Link
                to="/events"
                style={{ textDecoration: "none", color: "white", marginRight: '15px' }}
              >
                Events
              </Link>
              <Link
                to="/cart"
                style={{ textDecoration: "none", color: "white" ,marginRight: '15px'}}
              >
                Cart
              </Link>
              
            </Nav>
            <Nav>
              {user !== undefined && user.uid !== undefined ? (
                <>
                  <Link
                    id="userName"
                   to ={`/userProfile/${user.uid}/`}
                  // onClick={() => nav(`/userProfile/${user.uid}`)}
                  // reloadDocument="true"
                    style={{ textDecoration: "none", color: "white", marginRight:"10px" }}
                  >
                    <div class="circle-singleline"><strong>{user.name.charAt(0)}</strong></div> 
                    
                  </Link>

                  <Button variant="danger" onClick={handleLogout} >
                    Logout
                  </Button>
                </>
              ) : (
                <Link
                  id="login"
                  to="/login"
                  style={{ textDecoration: "none", color: "white" }}
                >
                  Login/Signup
                </Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
}

export default Navigationbar;
