import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { Icon } from "react-icons-kit";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { ic_add_shopping_cart } from "react-icons-kit/md/ic_add_shopping_cart";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase-config";
import { heart } from "react-icons-kit/fa/heart";
import {starEmpty} from 'react-icons-kit/icomoon/starEmpty'
import {starFull} from 'react-icons-kit/icomoon/starFull'
import {
  collection,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
} from "firebase/firestore";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import UserContext from "../Contexts/UserContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Spinner from "./Spinner";
import { Carousel, Form } from "react-bootstrap";

function ViewFullProduct(props) {
  const param = useParams();
  const { id } = param;
  console.log(id);
  const productCollectionRef = doc(db, "Products", id);
  const [product, setProduct] = useState();

  const { user, setUser } = useContext(UserContext);
  const auth = getAuth();

  const [addToCart, setStateCart] = useState(true);
  const [addToWishList, setStateWishList] = useState(true);
  const [modal, openModal] = useState(false);

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

  useEffect(() => {
    const getProduct = async () => {
      //console.log(user.Cart)
     
      const data = await getDoc(productCollectionRef);
      if (user.Cart !== undefined && user.Cart.length > 0)
        user.Cart.forEach((product) =>
          id === product.product ? setStateCart(false) : console.log()
        );
      if (user.WishPID !== undefined && user.WishPID.length > 0)
        user.WishPID.forEach((product) =>
          id === product ? setStateWishList(false) : console.log()
        );
      setProduct(data.data());
    };

    if (user !== undefined) getProduct();
  }, [id, user]);

  const handleCart = () => {
    const userRef = doc(db, "Users", user.uid);
    const addToCart = async () => {
      //console.log(user)
      await updateDoc(userRef, {
        Cart: arrayUnion({ product: id, quantity: 1 }),
      });
      setStateCart(false);
    };
    addToCart();
  };

  const addWishList = () => {
    const userRef = doc(db, "Users", user.uid);
    const addToWishList = async () => {
      //console.log(user)
      await updateDoc(userRef, {
        WishPID: arrayUnion(id),
      });
      setStateWishList(false);
    };

    addToWishList();
  };

  const removeWishList = () => {
    const userRef = doc(db, "Users", user.uid);
    const remWishList = async () => {
      //console.log(user)
      await updateDoc(userRef, {
        WishPID: arrayRemove(id),
      });
      setStateWishList(true);
    };

    remWishList();
  };

  const [index, setIndex] = useState(0);

  const [comment,setComment] = useState();

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  // comment rating date uid name
  const handleComment = () => {
    const addComment = async () => {
      await updateDoc(productCollectionRef, {
        Comments: arrayRemove(comment),
      });
      openModal(false);
      alert('Comment added.')
      setComment();
    };

    addComment();
  };

  return (
    <>
      {product !== undefined ? (
        <div>
          <MDBContainer fluid className="bg-success ">
            <MDBRow className="d-flex justify-content-center align-items-center ">
              <MDBCol lg="9" className="mt-5">
                <h1 className="mb-4">{product.title}</h1>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
          <Card className="mx-3 my-2">
            <Carousel
              className="w-50"
              style={{ alignSelf: "center", margin: "20px" }}
              activeIndex={index}
              onSelect={handleSelect}
            >
              {product.MediaID !== undefined && product.MediaID.length !== 0 ? (
                product.MediaID.map((element) => (
                  <Carousel.Item key={element}>
                    <img
                      className="d-block w-100"
                      src={element}
                      alt="First slide"
                      style={{
                        objectFit: "contain",
                        width: "300px",
                        height: "400px",
                      }}
                    />
                  </Carousel.Item>
                ))
              ) : (
                <Card.Img
                  variant="top"
                  src={require("../default_image.webp")}
                  //style={{ maxWidth: "100px", maxHeight: "100px" }}
                  className="w-100"
                  style={{
                    objectFit: "contain",
                    width: "200px",
                    height: "300px",
                  }}
                />
              )}
            </Carousel>
          </Card>

          <Card className="mx-3 my-2">
            <Card.Body>
              <Card.Title>Description</Card.Title>
              <Card.Text>{product.description}</Card.Text>
            </Card.Body>
          </Card>

          {addToCart === true ? (
            <>
              <div className=" mx-md-n5 mb-3">
                <MDBBtn
                  color="primary"
                  size="sm"
                  type="submit"
                  onClick={handleCart}
                >
                  <Icon icon={ic_add_shopping_cart} />
                  Add to Cart
                </MDBBtn>
              </div>
            </>
          ) : (
            <>
              <div className=" mx-md-n5 mb-3">
                <MDBBtn
                  outline
                  color="primary"
                  size="sm"
                  disabled
                  type="submit"
                  variant="light "
                  style={{ border: "1px solid" }}
                >
                  <Icon icon={ic_add_shopping_cart} />
                  Added to Cart
                </MDBBtn>
              </div>
            </>
          )}
          {addToWishList === true ? (
            <>
              <div className=" mx-md-n5 mb-3">
                <MDBBtn
                  color="danger"
                  size="sm"
                  type="submit"
                  onClick={addWishList}
                >
                  <Icon icon={heart} />
                  Add to Wishlist
                </MDBBtn>
              </div>
            </>
          ) : (
            <div className=" mx-md-n5 mb-3">
              <MDBBtn
                variant="light"
                size="sm"
                color="danger"
                type="submit"
                onClick={removeWishList}
                style={{ border: "1px solid" }}
              >
                <Icon icon={heart} />
                Remove from WishList
              </MDBBtn>
            </div>
          )}
          <Link to={`/userProfile/${product.UID}/`}>
            <Button variant="primary " type="submit">
              View this user profile
            </Button>
          </Link>

          <Button variant="primary " type="submit" onClick={e => openModal(true)}>
            Add Comment
          </Button>

          <MDBModal show={modal} setShow={openModal} tabIndex="-1">
            <MDBModalDialog>
              <MDBModalContent>
                <MDBModalHeader>
                  <MDBModalTitle>Add Comment</MDBModalTitle>
                  <MDBBtn
                    className="btn-close"
                    color="none"
                    onClick={e => openModal(!modal)}
                  ></MDBBtn>
                </MDBModalHeader>
                <MDBModalBody>
                  <div className="container text-dark">
                    <div className="row d-flex justify-content-center">
                      <div className="col-md-10 col-lg-8 col-xl-6">
                        <div className="card">
                          <div className="card-body p-4">
                            <div className="d-flex flex-start w-100">
                              <img
                                className="rounded-circle shadow-1-strong me-3"
                                src={
                                  product.MediaID !== undefined &&
                                  product.MediaID.length !== 0
                                    ? product.MediaID[0]
                                    : require("../default_image.webp")
                                }
                                alt="avatar"
                                width="65"
                                height="65"
                              />
                              <div className="w-100">
                                <h5>Add a comment</h5>
                                <ul
                                  className="rating mb-3"
                                  data-mdb-toggle="rating"
                                >
                                  <li>
                                    <i
                                      className="far fa-star fa-sm text-danger"
                                      title="Bad"
                                    ></i>
                                  </li>
                                  <li>
                                    <i
                                      className="far fa-star fa-sm text-danger"
                                      title="Poor"
                                    ></i>
                                  </li>
                                  <li>
                                    <i
                                      className="far fa-star fa-sm text-danger"
                                      title="OK"
                                    ></i>
                                  </li>
                                  <li>
                                    <i
                                      className="far fa-star fa-sm text-danger"
                                      title="Good"
                                    ></i>
                                  </li>
                                  <li>
                                    <i
                                      className="far fa-star fa-sm text-danger"
                                      title="Excellent"
                                    ></i>
                                  </li>
                                </ul>
                                <div className="form-outline">
                                  <textarea
                                    className="form-control"
                                    id="textAreaExample"
                                    rows="4"
                                  ></textarea>
                                  <label
                                    className="form-label"
                                    for="textAreaExample"
                                  >
                                    What is your view?
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </MDBModalBody>

                <MDBModalFooter>
                  <MDBBtn color="secondary" onClick={e => openModal(!modal)}>
                    Cancel
                  </MDBBtn>
                  <MDBBtn color="danger" onClick={handleComment}>
                    Add Comment
                  </MDBBtn>
                </MDBModalFooter>
              </MDBModalContent>
            </MDBModalDialog>
          </MDBModal>


        
  <div className="container my-2 py-5">
    <div className="row d-flex justify-content-center">
      <div className="col-md-12 col-lg-10">
        <div className="card text-dark">
          <div className="card-body p-4">
            <h5 className="mb-0">Comments</h5>
            <p className="fw-light mb-4 pb-2"></p>

            <div className="d-flex flex-start ">
              <img className="rounded-circle shadow-1-strong me-3"
                src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(23).webp" alt="avatar" width="60"
                height="60" />
              <div>
                <h6 className="fw-bold mb-1  d-flex justify-content-start">Maggie Marsh</h6>
                <div className="d-flex align-items-center mb-2">
                  <p className="mb-0">
                    March 07, 2021
                    
                  </p>
                  <a href="#!" className="link-muted"><i className="fas fa-pencil-alt ms-2"></i></a>
                  <a href="#!" className="link-muted"><i className="fas fa-redo-alt ms-2"></i></a>
                  <a href="#!" className="link-muted"><i className="fas fa-heart ms-2"></i></a>
                </div>
                <div className="mb-0 " style={{textAlign:"left"}}>
                  Lorem Ipsum is simply dummy text of the printing and typesetting
                  industry. Lorem Ipsum has been the industry's standard dummy text ever
                  since the 1500s, when an unknown printer took a galley of type and
                  scrambled it.
                </div>
              </div>
            </div>
          </div>

          <hr className="my-0" />

          <div className="card-body p-4">
            <div className="d-flex flex-start">
              <img className="rounded-circle shadow-1-strong me-3"
                src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(24).webp" alt="avatar" width="60"
                height="60" />
              <div>
                <h6 className="fw-bold mb-1">Betty Walker</h6>
                <div className="d-flex align-items-center mb-3">
                  <p className="mb-0">
                    March 30, 2021
                    <span className="badge bg-primary">Pending</span>
                  </p>
                  <a href="#!" className="link-muted"><i className="fas fa-pencil-alt ms-2"></i></a>
                  <a href="#!" className="link-muted"><i className="fas fa-redo-alt ms-2"></i></a>
                  <a href="#!" className="link-muted"><i className="fas fa-heart ms-2"></i></a>
                </div>
                <p className="mb-0">
                  It uses a dictionary of over 200 Latin words, combined with a handful of
                  model sentence structures, to generate Lorem Ipsum which looks
                  reasonable. The generated Lorem Ipsum is therefore always free from
                  repetition, injected humour, or non-characteristic words etc.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
        </div>
      ) : (
        <Spinner />
      )}
      <br />
    </>
  );
}

export default ViewFullProduct;
