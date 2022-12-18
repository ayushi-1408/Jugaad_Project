import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, Outlet, useNavigate } from "react-router-dom";
import UserContext from "../Contexts/UserContext";
import Logout from "./Logout";

function Navigationbar() {
  const nav = useNavigate();
  const {user, setUser } = useContext(UserContext);

 

  const handleLogout = (e) => {
    e.preventDefault();
    Logout();
    setUser();
    nav("/");
  };
  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark"  fixed="top" position="relative" >
        <Container>
          <Navbar.Brand href="#home">JUGAAD</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto">
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
              </Link>{  }
              <Link
                to="/cart"
                style={{ textDecoration: "none", color: "white" ,marginRight: '15px'}}
              >
                Cart
              </Link>{' '}
              
            </Nav>
            <Nav>
              {user !== undefined && user.uid !== undefined ? (
                <>
                  <Link
                    id="userName"
                    to="/userProfile"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    {user.name}
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
