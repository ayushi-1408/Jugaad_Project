import {
  browserPopupRedirectResolver,
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { Icon } from "react-icons-kit";
import { bin2 } from "react-icons-kit/icomoon/bin2";

import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { heart } from "react-icons-kit/icomoon/heart";
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
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import Spinner from "./Spinner";
import StripeCheckout from "react-stripe-checkout";

function Cart() {
  const { user, setUser } = useContext(UserContext);
  const [cart, setCart] = useState();
  const [sum, setSum] = useState(0);
  const auth = getAuth();

  const nav = useNavigate();

  if (user == undefined || user.uid == undefined) {
    onAuthStateChanged(auth, (userr) => {
      if (userr) {
        // console.log(userr);
        const getUser = async () => {
          const userRef = doc(db, "Users", userr.uid);
          const data = await getDoc(userRef);
          setUser({ ...data.data(), uid: userr.uid });
        };
        getUser();
      } else {
        nav("/login");
      }
    });
  }

  const handleInput = (index, value) => {
    const userRef = doc(db, "Users", user.uid);
    // const name = e.target.name;
    //const value = e.target.value;
    const val = -parseInt(cart[index].quantity) + parseInt(value);
    const updateCart = async () => {
      setSum((sum) => sum + val * parseInt(cart[index].price));
      updateDoc(userRef, {
        Cart: arrayRemove({
          product: cart[index].pid,
          quantity: cart[index].quantity,
        }),
      });
      updateDoc(userRef, {
        Cart: arrayUnion({ product: cart[index].pid, quantity: value }),
      });
      setCart(
        cart.map((product) =>
          product.pid === cart[index].pid
            ? { ...product, quantity: value }
            : { ...product }
        )
      );
    };
    if (value !== undefined && value !== "") updateCart();
  };

  const handleRemove = (index) => {
    console.log("removing");
    // const name = e.target.name;
    // console.log(cart);
    // console.log(name);
    // console.log(cart[index])
    const userRef = doc(db, "Users", user.uid);
    const val = -parseInt(cart[index].quantity);
    setSum((sum) => sum + val * parseInt(cart[index].price));
    const updateCart = async () => {
      updateDoc(userRef, {
        Cart: arrayRemove({
          product: cart[index].pid,
          quantity: cart[index].quantity,
        }),
      });
      setCart((products) =>
        products.filter((product) => product.pid !== cart[index].pid)
      );
    };
    updateCart();
  };

  const handleWishList = (index) => {
    console.log("adding to wishlist");
    const userRef = doc(db, "Users", user.uid);
    // const name = e.target.name;
    console.log(index);
    console.log(cart[index]);
    const updateWishList = async () => {
      updateDoc(userRef, {
        WishPID: arrayUnion(cart[index].pid),
      });
      alert("Added to WishList");
    };
    updateWishList();
  };

  useEffect(() => {
    const getCart = async () => {
      const userRef = doc(db, "Users", user.uid);
      const data = await getDoc(userRef);
      setUser({ ...user, name: data.data().name });
      setCart([]);
      data.data().Cart.forEach((element) => {
        const productCollectionRef = doc(db, "Products", element.product);
        const getProduct = async () => {
          const data = await getDoc(productCollectionRef);
          const temp = data.data();
          console.log(temp);
          temp.quantity = element.quantity;
          temp.pid = element.product;
          setSum((sum) => temp.price * temp.quantity + sum);
          setCart((arr) => [...arr, temp]);
        };
        getProduct();
      });
    };
    if (user !== undefined) getCart();
  }, [!user]);

  const [basicModal, setBasicModal] = useState(false);

  const [ordereing, setOrdering] = useState(false);

  const toggleShow = () => setBasicModal(!basicModal);

  const onToken = (token) => {
    setOrdering(true);
    const orderRef=collection(db, "Orders");
    const addOrder = async () => {
      const ref1 = await addDoc(orderRef,{
        UID:user.uid,
        Products:cart.map((p) => ({PID:p.pid,quantity:p.quantity})),
        Amount:sum,
        Address:user.address,
        mobile:user.mobile,
        paymentMode:"online",
        paymentStatus:1
      });
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, {
        Cart:[],
        Orders:arrayUnion(ref1.id)
      })
      setOrdering(false);
      toggleShow();
      setSum(0);
      setCart([]);

      alert('Order Placed...Kindly check in My Orders.');
    }
    addOrder();
   }

  return (
    <>
      {cart !== undefined ? (
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
                    {cart.map((product, index) => (
                      <>
                        <MDBRow>
                          <MDBCol lg="3" md="12" className="mb-4 mb-lg-0">
                            <MDBRipple
                              rippleTag="div"
                              rippleColor="light"
                              className="bg-image rounded hover-zoom hover-overlay"
                            >
                              <img src={product.MediaID !== undefined && product.MediaID.length !== 0 ? product.MediaID[0] : require('../default_image.webp')} className="w-100" />
                              <a href="#!">
                                <div
                                  className="mask"
                                  style={{
                                    backgroundColor: "rgba(251, 251, 251, 0.2)",
                                  }}
                                ></div>
                              </a>
                            </MDBRipple>
                          </MDBCol>

                          <MDBCol lg="5" md="6" className=" mb-4 mb-lg-0">
                            <p>
                              <strong>{product.title}</strong>
                            </p>
                            <p>Color: blue</p>
                            <p>Size: M</p>

                            <MDBBtn
                              className="me-1 my-3"
                              title="Remove item"
                              type="button"
                              onClick={(e) => handleRemove(index)}
                            >
                              <Icon icon={bin2} />
                            </MDBBtn>

                            <MDBBtn
                              color="danger"
                              wrapperClass="me-1 m-3"
                              title="Move to the wish list"
                            >
                              <Icon
                                icon={heart}
                                onClick={(e) => handleWishList(index)}
                              />
                            </MDBBtn>
                          </MDBCol>
                          <MDBCol lg="4" md="6" className="mb-4 mb-lg-0">
                            <div
                              className="d-flex mb-4"
                              style={{ maxWidth: "300px" }}
                            >
                              <MDBInput
                                defaultValue={product.quantity}
                                min={1}
                                type="number"
                                label="Quantity"
                                onChange={(e) =>
                                  handleInput(index, e.target.value)
                                }
                              />
                            </div>

                            <p className="text-start text-md-center">
                              <strong>${product.price}</strong>
                            </p>
                          </MDBCol>
                        </MDBRow>
                        <hr className="my-4" />
                      </>
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
                    <MDBCardImage
                      className="me-2"
                      width="45px"
                      src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/visa.svg"
                      alt="Visa"
                    />
                    <MDBCardImage
                      className="me-2"
                      width="45px"
                      src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/amex.svg"
                      alt="American Express"
                    />
                    <MDBCardImage
                      className="me-2"
                      width="45px"
                      src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/mastercard.svg"
                      alt="Mastercard"
                    />
                    <MDBCardImage
                      className="me-2"
                      width="45px"
                      src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce/includes/gateways/paypal/assets/images/paypal.png"
                      alt="PayPal acceptance mark"
                    />
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
                      <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                        Products
                        <span>${sum}</span>
                      </MDBListGroupItem>
                      <MDBListGroupItem className="d-flex justify-content-between align-items-center px-0">
                        Shipping
                        <span>Gratis</span>
                      </MDBListGroupItem>
                      <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 mb-3">
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

                    <MDBBtn block size="lg" onClick={toggleShow}>
                      Go to checkout
                    </MDBBtn>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
          <MDBModal show={basicModal} setShow={setBasicModal} tabIndex="-1">
            <MDBModalDialog>
              <MDBModalContent>
                <MDBModalHeader>
                  <MDBModalTitle>Order Summary</MDBModalTitle>
                  <MDBBtn
                    className="btn-close"
                    color="none"
                    onClick={toggleShow}
                  ></MDBBtn>
                </MDBModalHeader>
                <MDBModalBody>
                  {
                    ordereing ? (
                      <>
                      <Spinner/>
                      <h6>Confirming Order Details...</h6>
                      </>
                      
                    ) : (
                      <>
                      <div><strong>Products</strong></div>
                  {
                    cart.map((element) => (
                      <>
                      <div>{element.title} - ${element.price} - {element.quantity}</div>
            
                      </>
                    ))
                  }
                  <hr className="mx-n6" />
                  <div><strong>Total Amount - </strong>$ {sum}</div>
                  <hr className="mx-n6" />
                  <div><strong>Shipping Address</strong></div>
                  <div>{user.address}</div> 
                      </>
                    )
                  }

                

                </MDBModalBody>

                <MDBModalFooter>
                  <MDBBtn color="secondary" onClick={toggleShow}>
                    Cancel
                  </MDBBtn>
                  <StripeCheckout
                    token={onToken}
                    name="Order Payment"
                    amount={sum*100}
                    stripeKey="pk_test_51MJZ1KSB9uQMp7kpVr3EVPsGdDqnHFRiLsi5dAuNaLqgJSUEFk7RB8sV2zIiZHF3IxmKstQ6IqTNSEBhB7zJBGVf00RdHIGoiv"
                  />
                </MDBModalFooter>
              </MDBModalContent>
            </MDBModalDialog>
          </MDBModal>
        </section>
      ) : (
        <Spinner />
      )}
    </>
  );
}

export default Cart;
