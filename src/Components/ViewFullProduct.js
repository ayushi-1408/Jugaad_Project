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
import { starEmpty } from "react-icons-kit/icomoon/starEmpty";
import { starFull } from "react-icons-kit/icomoon/starFull";
import StarRatingComponent from "react-star-rating-component";
import {
  collection,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  Timestamp,
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
import Products from "./Products";
import Rating from "@mui/material/Rating";

function ViewFullProduct(props) {
  const param = useParams();
  const { id } = param;
  const productCollectionRef = doc(db, "Products", id);
  const [product, setProduct] = useState();

  const { user, setUser } = useContext(UserContext);
  const auth = getAuth();

  const [addToCart, setStateCart] = useState(true);
  const [addToWishList, setStateWishList] = useState(true);
  const [modal, openModal] = useState(false);
  const [avgRating,setAvgRating] = useState(1);

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
      if (data.data().Comments !== undefined) {
        let sum = 0;
        data.data().Comments.forEach((element) => {
          sum += element.comment.rating;
        });
        console.log(sum / data.data().Comments.length);
        setAvgRating( sum / data.data().Comments.length);
      }
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

  const [comment, setComment] = useState({
    rating: 1,
    message: "",
    date: new Date(),
    UID: "",
  });

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  // comment rating date uid name
  const handleComment = () => {
    const addComment = async () => {
      console.log(comment);
      await updateDoc(productCollectionRef, {
        Comments: arrayUnion({
          comment,
          UId: user.uid,
          name: user.name,
          image: user.image,
        }),
      });
      openModal(false);
      alert("Comment added.");
      const comm = [
        ...product.Comments,
        { comment, UId: user.uid, name: user.name, image: user.image },
      ];
      comm[comm.length - 1].comment.date = Timestamp.fromDate(comment.date);
      // console.log(comm[comm.length-1].comment.date)
      setProduct({ ...product, Comments: comm });
      //console.log(comm)
      setComment({
        rating: 1,
        message: "",
        date: new Date(),
      });
    };
    addComment();
  };

  const toggleModal = () => {
    openModal(!modal);
    setComment({
      rating: 1,
      message: "",
      date: new Date(),
    });
  };

  // const avgRating = () => {
  //   if (product.Comments !== undefined) {
  //     let sum = 0;
  //     product.Comments.forEach((element) => {
  //       sum += element.comment.rating;
  //     });
  //     console.log(sum / product.Comments.length);
  //     return sum / product.Comments.length;
  //   } else {
  //     return 2.5;
  //   }
  // };

  return (
    <>
      {product !== undefined ? (
        <div>
          <MDBContainer fluid className="bg-success ">
            <MDBRow className="d-flex justify-content-center align-items-center ">
              <MDBCol lg="8" className="mt-5">
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
                product.MediaID.map((element,id) => (
                  <Carousel.Item key={id}>
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
              <Card.Title>Customer Rating</Card.Title>
              <Card.Text>
                <Rating
                  name="rating"
                  value={avgRating}
                  readOnly
                  precision={0.5}
                />
              </Card.Text>
            </Card.Body>
          </Card>
          <Card className="mx-3 my-2">
            <Card.Body>
              <Card.Title>Price</Card.Title>
              <Card.Text>{product.price}</Card.Text>
            </Card.Body>
          </Card>
          <Card className="mx-3 my-2">
            <Card.Body>
              <Card.Title>Description</Card.Title>
              <Card.Text>{product.description}</Card.Text>
            </Card.Body>
          </Card>

          {addToCart === true ? (
            <>
              <div className="  mb-3">
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
              <div className="  mb-3">
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
              <div className="  mb-3">
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
            <div className="  mb-3">
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
          <br />
          <Button
            variant="warning "
            type="submit"
            onClick={(e) => openModal(true)}
            className="my-4"
          >
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
                    onClick={(e) => toggleModal()}
                  ></MDBBtn>
                </MDBModalHeader>
                <MDBModalBody>
                  <div className="container text-dark">
                    <div className="row d-flex justify-content-center">
                      {/* <div className="col-md-10 col-lg-8 col-xl-6"> */}
                      <div className="card">
                        <div className="card-body p-4">
                          <div className="d-flex flex-start w-100">
                            <img
                              className="rounded-circle shadow-1-strong me-3"
                              src={
                                user.image !== undefined && user.image !== ""
                                  ? user.image
                                  : require("../default_image.webp")
                              }
                              alt="avatar"
                              width="65"
                              height="65"
                            />
                            <div className="w-100">
                              <h5>Add a comment</h5>
                              <div style={{ fontSize: "25px" }}>
                                <Rating
                                  name="rating"
                                  value={comment.rating}
                                  onChange={(event,val) => {
                                    setComment({ ...comment, rating: val });
                                  }}
                                />
                              </div>

                              <Form.Group
                                className="mb-3"
                                controlId="description"
                              >
                                <Form.Control
                                  as="textarea"
                                  rows={3}
                                  name="message"
                                  onChange={(e) => {
                                    setComment({
                                      ...comment,
                                      message: e.target.value,
                                    });
                                  }}
                                  value={comment.message}
                                  placeholder="What is your view?"
                                />
                              </Form.Group>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* </div> */}
                    </div>
                  </div>
                </MDBModalBody>

                <MDBModalFooter>
                  <MDBBtn color="secondary" onClick={(e) => toggleModal()}>
                    Cancel
                  </MDBBtn>
                  <MDBBtn color="danger" onClick={handleComment}>
                    Add Comment
                  </MDBBtn>
                </MDBModalFooter>
              </MDBModalContent>
            </MDBModalDialog>
          </MDBModal>

          <div className="container mb-2 pb-5">
            <div className="row d-flex justify-content-center">
              <div className="col-md-10 col-lg-8 col-xl-6">
                <div className="card text-dark">
                  <h4 className="mt-3">Comments</h4>
                  <p className="fw-light mb-4 pb-2"></p>

                  {product.Comments !== undefined &&
                  product.Comments.length !== 0 ? (
                    product.Comments.map((element, id) => (
                      <>
                        <MDBRow className="card-body p-4" key={id}>
                          <MDBCol className="d-flex flex-start col-md-9 ">
                            <img
                              className="rounded-circle shadow-1-strong me-3"
                              src={
                                element.image !== "" &&
                                element.image !== undefined
                                  ? element.image
                                  : require("../default_image.webp")
                              }
                              alt="avatar"
                              width="60"
                              height="60"
                            />
                            <div>
                              <strong className="fw-bold mb-1 d-flex justify-content-start">
                                {element.name}
                              </strong>
                              <div className="d-flex align-items-center mb-2">
                                <small className="mb-0 " style={{fontSize:"12px"}}>
                                  {element.comment.date.toDate().toDateString()}
                                </small>
                              </div>

                              <div
                                className="mb-0 "
                                style={{ textAlign: "left" , textAlign:"justify"}}
                              >
                                {element.comment.message}
                              </div>
                            </div>
                          </MDBCol>
                          <MDBCol
                            style={{ fontSize: "25px" }}
                            className="d-flex justify-content-end align-self-top"
                          >
                            <Rating
                              name="rating"
                              value={element.comment.rating}
                              readOnly
                              precision={0.5}
                            />
                          </MDBCol>
                        </MDBRow>

                        <hr className="my-0" />
                      </>
                    ))
                  ) : (
                    <></>
                  )}
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
