import { browserPopupRedirectResolver, getAuth, onAuthStateChanged } from "firebase/auth";
import { arrayRemove, arrayUnion, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
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
import Spinner from "./Spinner";
import OrderContext from "../Contexts/OrderContext";
 
function Cart() {
  const { user, setUser } = useContext(UserContext);
  const [cart, setCart] = useState();
  const [sum,setSum] = useState(0);
  const auth = getAuth();

  const nav=useNavigate()

    if(user==undefined || user.uid == undefined) {
      onAuthStateChanged(auth, (userr) => {
        if (userr) {
          console.log(userr)
          setUser({uid:userr.uid})
        } else {
          console.log("not signed")
          nav('/login')
        }
      });
    }

    const handleInput = (e) => {
      const userRef = doc(db, "Users", user.uid);
      const name=e.target.name;
      const value=e.target.value;
      const val= -parseInt(cart[name].quantity)+parseInt(value);
      setSum((sum) => sum+val*parseInt(cart[name].price));
      const updateCart = async() => {
        updateDoc(userRef, {
           Cart: arrayRemove({product:cart[name].pid, quantity:cart[name].quantity})
        });
        updateDoc(userRef, {
          Cart: arrayUnion({product:cart[name].pid, quantity:value})
       });
       setCart(cart.map((product) => 
        product.pid===cart[name].pid? {...product,quantity:value} : {...product}
      )
      );
      }
      updateCart();
  }

  const handleRemove = (e) => {
    console.log("removing")
    const userRef = doc(db, "Users", user.uid);
    const name=e.target.name;
    const val= -parseInt(cart[name].quantity);
    setSum((sum) => sum+val*parseInt(cart[name].price));
    const updateCart = async() => {
      updateDoc(userRef, {
         Cart: arrayRemove({product:cart[name].pid, quantity:cart[name].quantity})
      });
      setCart((products) => (
        products.filter((product) => product.pid !== cart[name].pid)
      ));
    }
    updateCart();
  }
    

  useEffect(() => {
    const getCart = async () => {
      const userRef = doc(db, "Users", user.uid);
      const data = await getDoc(userRef);
      setUser({...user, name:data.data().name})
      setCart([])
      data.data().Cart.forEach((element) => {
        const productCollectionRef = doc(db, "Products", element.product);
        const getProduct = async () => {
        const data = await getDoc(productCollectionRef);
        const temp = data.data();
        console.log(temp)
        temp.quantity=element.quantity;
        temp.pid = element.product;
        setSum((sum) => temp.price*temp.quantity+sum);
        setCart((arr) => [...arr, temp]);
        };
        getProduct(); 
      });
    };
    if(user !== undefined) getCart();
  }, [!user]);

  return (
    <>
   
   {
    
      cart !== undefined ? (
        <section className="h-100 gradient-custom">
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center my-4">
            <MDBCol md="8">
              <MDBCard className="mb-4">
                <MDBCardHeader className="py-3">
                  <MDBTypography tag="h5" className="mb-0">
                    Cart - {cart.length} items
                  </MDBTypography>
                </MDBCardHeader>
                <MDBCardBody>
                  {cart.map((product) => (
                      <><MDBRow key={product.pid}>
                      <MDBCol lg="3" md="12" className="mb-4 mb-lg-0">
                        <MDBRipple rippleTag="div" rippleColor="light"
                          className="bg-image rounded hover-zoom hover-overlay">
                          <img
                            src={product.image}
                            className="w-100" />
                          <a href="#!">
                            <div className="mask" style={{ backgroundColor: "rgba(251, 251, 251, 0.2)", }}>
                            </div>
                          </a>
                        </MDBRipple>
                      </MDBCol>
      
                      <MDBCol lg="5" md="6" className=" mb-4 mb-lg-0">
                        <p>
                          <strong>{product.title}</strong>
                        </p>
                        <p>Color: blue</p>
                        <p>Size: M</p>
      
                        <MDBBtn wrapperProps={{ size: "sm" }} wrapperClass="me-1 mb-2"
                          title="Remove item" type="button" onClick={handleRemove} name={cart.indexOf(product)}>
                          <MDBIcon fas icon="trash" />
                        </MDBBtn>
      
                        <MDBTooltip wrapperProps={{ size: "sm", color: "danger" }} wrapperClass="me-1 mb-2"
                          title="Move to the wish list">
                          <MDBIcon fas icon="heart" />
                        </MDBTooltip>
                      </MDBCol>
                      <MDBCol lg="4" md="6" className="mb-4 mb-lg-0">
                        <div className="d-flex mb-4" style={{ maxWidth: "300px" }}>
                          
      
                          <MDBInput defaultValue={product.quantity} min={1} type="number" label="Quantity" name={cart.indexOf(product)} onChange={handleInput} />
      
                          
          
                          
                        </div>
      
                        <p className="text-start text-md-center">
                          <strong>${product.price}</strong>
                        </p>
                      </MDBCol>
                    </MDBRow><hr className="my-4" /></>
                  ))}
                  
      
                  
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
                      <span>${sum}</span>
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
                        <strong>${sum}</strong>
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
      ) : (
        <Spinner/>
      )
    }



    </>
  );
}

export default Cart;
