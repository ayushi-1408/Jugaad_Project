import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, getDocs } from "firebase/firestore";
import React, { useEffect } from "react";
import { useState } from "react";
import { useContext } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { Link, Navigate, redirect, useNavigate } from "react-router-dom";
import UserContext from "../Contexts/UserContext";
import { db } from "../firebase-config";
import Products from "./Products";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBListGroup,
  MDBListGroupItem,
  MDBRipple,
  MDBRow,
  MDBTooltip,
  MDBTypography,
  } from "mdb-react-ui-kit";
 
function Cart() {
  // const { user, setUser } = useContext(UserContext);
  // const [cart, setCart] = useState([]);
  // const auth = getAuth();

  // const nav=useNavigate()

  //   if(!user) {
  //     onAuthStateChanged(auth, (userr) => {
  //       if (userr) {
  //         console.log(userr)
  //         setUser(userr.uid)
  //       } else {
  //         console.log("not signed")
  //         nav('/login')
  //       }
  //     });
  //   }

  // useEffect(() => {
  //   const getCart = async () => {
  //     const userRef = doc(db, "Users", user);

  //     //console.log(auth.currentUser)
  //     const data = await getDoc(userRef);
  //     console.log(data.data().Cart);
  //     data.data().Cart.forEach((element) => {
  //       const productCollectionRef = doc(db, "Products", element);
  //       const getProduct = async () => {
  //         const data = await getDoc(productCollectionRef);
  //         const temp = data.data();
  //         temp.id = data.id;
  //         // setPrice(price+temp.price)
  //         setCart((arr) => [...arr, temp]);
  //       };
  //       getProduct();
  //     });
  //   };
  //   getCart();
  //   //console.log(auth.currentUser)
  // }, [!user]);

  return (
    // <div>
    //   <Row xs={1} md={2} className="g-4">
    //     {cart.map((product) => (
    //       <Col>
    //         <Link
    //           to={`/viewProduct/${product.id}`}
    //           style={{ textDecoration: "none", color: "black" }}
    //         >
    //           <Card key={product.id}>
    //             <p style={{ alignContent: "center" }}>
    //               <Card.Img
    //                 variant="top"
    //                 src={product.image}
    //                 style={{ maxWidth: "100px", maxHeight: "100px" }}
    //               />
    //             </p>

    //             <Card.Body className="col-md-6 align-self-center">
    //               <Card.Title>{product.title}</Card.Title>
    //               <Card.Text>{product.description}</Card.Text>
    //               <Card.Text>{product.price}</Card.Text>
    //             </Card.Body>
    //           </Card>
    //         </Link>
    //         <Link to={`/placeOrder/${product.id}`}>
    //           <Button variant="primary" type="submit" name={product.id}>
    //             Continue to order
    //           </Button>
    //         </Link>
    //       </Col>
    //     ))}
    //   </Row>
    //   {/* <div>
    //   Total price is {price}
    // </div> */}
    // </div>
    <>
   


<section className="h-100 gradient-custom">
  <MDBContainer className="py-5 h-100">
    <MDBRow className="justify-content-center my-4">
      <MDBCol md="8">
        <MDBCard className="mb-4">
          <MDBCardHeader className="py-3">
            <MDBTypography tag="h5" className="mb-0">
              Cart - 2 items
            </MDBTypography>
          </MDBCardHeader>
          <MDBCardBody>
            <MDBRow>
              <MDBCol lg="3" md="12" className="mb-4 mb-lg-0">
                <MDBRipple rippleTag="div" rippleColor="light"
                  className="bg-image rounded hover-zoom hover-overlay">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Vertical/12a.webp"
                    className="w-100" />
                  <a href="#!">
                    <div className="mask" style={{ backgroundColor: "rgba(251, 251, 251, 0.2)" , }}>
                    </div>
                  </a>
                </MDBRipple>
              </MDBCol>

              <MDBCol lg="5" md="6" className=" mb-4 mb-lg-0">
                <p>
                  <strong>Blue denim shirt</strong>
                </p>
                <p>Color: blue</p>
                <p>Size: M</p>

                <MDBTooltip wrapperProps={{ size: "sm" }} wrapperClass="me-1 mb-2"
                  title="Remove item">
                  <MDBIcon fas icon="trash" />
                </MDBTooltip>

                <MDBTooltip wrapperProps={{ size: "sm" , color: "danger" }} wrapperClass="me-1 mb-2"
                  title="Move to the wish list">
                  <MDBIcon fas icon="heart" />
                </MDBTooltip>
              </MDBCol>
              <MDBCol lg="4" md="6" className="mb-4 mb-lg-0">
                <div className="d-flex mb-4" style={{ maxWidth: "300px" }}>
                  <MDBBtn className="px-3 me-2">
                    <MDBIcon fas icon="minus" />
                  </MDBBtn>

                  <MDBInput defaultValue={1} min={0} type="number" label="Quantity" />

                  <MDBBtn className="px-3 ms-2">
                    <MDBIcon fas icon="plus" />
                  </MDBBtn>
                </div>

                <p className="text-start text-md-center">
                  <strong>$17.99</strong>
                </p>
              </MDBCol>
            </MDBRow>

            <hr className="my-4" />

            <MDBRow>
              <MDBCol lg="3" md="12" className="mb-4 mb-lg-0">
                <MDBRipple rippleTag="div" rippleColor="light"
                  className="bg-image rounded hover-zoom hover-overlay">
                  <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/Horizontal/E-commerce/Vertical/13a.webp"
                    className="w-100" />
                  <a href="#!">
                    <div className="mask" style={{ backgroundColor: "rgba(251, 251, 251, 0.2)" , }}>
                    </div>
                  </a>
                </MDBRipple>
              </MDBCol>

              <MDBCol lg="5" md="6" className=" mb-4 mb-lg-0">
                <p>
                  <strong>Red hoodie</strong>
                </p>
                <p>Color: red</p>
                <p>Size: M</p>

                <MDBTooltip wrapperProps={{ size: "sm" }} wrapperClass="me-1 mb-2"
                  title="Remove item">
                  <MDBIcon fas icon="trash" />
                </MDBTooltip>

                <MDBTooltip wrapperProps={{ size: "sm" , color: "danger" }} wrapperClass="me-1 mb-2"
                  title="Move to the wish list">
                  <MDBIcon fas icon="heart" />
                </MDBTooltip>
              </MDBCol>
              <MDBCol lg="4" md="6" className="mb-4 mb-lg-0">
                <div className="d-flex mb-4" style={{ maxWidth: "300px" }}>
                  <MDBBtn className="px-3 me-2">
                    <MDBIcon fas icon="minus" />
                  </MDBBtn>

                  <MDBInput defaultValue={1} min={0} type="number" label="Quantity" />

                  <MDBBtn className="px-3 ms-2">
                    <MDBIcon fas icon="plus" />
                  </MDBBtn>
                </div>

                <p className="text-start text-md-center">
                  <strong>$17.99</strong>
                </p>
              </MDBCol>
            </MDBRow>
          </MDBCardBody>
        </MDBCard>

        <MDBCard className="mb-4">
          <MDBCardBody>
            <p>
              <strong>Expected shipping delivery</strong>
            </p>
            <p className="mb-0">12.10.2020 - 14.10.2020</p>
          </MDBCardBody>
        </MDBCard>

        <MDBCard className="mb-4 mb-lg-0">
          <MDBCardBody>
            <p>
              <strong>We accept</strong>
            </p>
            <MDBCardImage className="me-2" width="45px"
              src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/visa.svg"
              alt="Visa" />
            <MDBCardImage className="me-2" width="45px"
              src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/amex.svg"
              alt="American Express" />
            <MDBCardImage className="me-2" width="45px"
              src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/mastercard.svg"
              alt="Mastercard" />
            <MDBCardImage className="me-2" width="45px"
              src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce/includes/gateways/paypal/assets/images/paypal.png"
              alt="PayPal acceptance mark" />
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
      <MDBCol md="4">
        <MDBCard className="mb-4">
          <MDBCardHeader>
            <MDBTypography tag="h5" className="mb-0">
              Summary
            </MDBTypography>
          </MDBCardHeader>
          <MDBCardBody>
            <MDBListGroup flush>
              <MDBListGroupItem
                className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                Products
                <span>$53.98</span>
              </MDBListGroupItem>
              <MDBListGroupItem className="d-flex justify-content-between align-items-center px-0">
                Shipping
                <span>Gratis</span>
              </MDBListGroupItem>
              <MDBListGroupItem
                className="d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                <div>
                  <strong>Total amount</strong>
                  <strong>
                    <p className="mb-0">(including VAT)</p>
                  </strong>
                </div>
                <span>
                  <strong>$53.98</strong>
                </span>
              </MDBListGroupItem>
            </MDBListGroup>

            <MDBBtn block size="lg">
              Go to checkout
            </MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBRow>
  </MDBContainer>
</section>

    </>
  );
}

export default Cart;
