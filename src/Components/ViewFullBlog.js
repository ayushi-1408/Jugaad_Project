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
import Blogs from "./Blogs";
import Rating from "@mui/material/Rating";

function ViewFullBlog(props) {
  const param = useParams();
  const { id } = param;
  const BlogCollectionRef = doc(db, "Blogs", id);
  const [Blog, setBlog] = useState();

  const { user, setUser } = useContext(UserContext);
  const auth = getAuth();

  const [like, setLike] = useState(true);
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
    const getBlog = async () => {
      //console.log(user.Cart)

      const data = await getDoc(BlogCollectionRef);
      if (user.SavedBID !== undefined && user.SavedBID.length > 0)
        user.SavedBID.forEach((Blog) =>
          id === Blog ? setStateWishList(false) : console.log()
        );
      setBlog(data.data());
    };

    if (user !== undefined) getBlog();
  }, [id, user]);


  const addWishList = () => {
    const userRef = doc(db, "Users", user.uid);
    const addToWishList = async () => {
      //console.log(user)
      await updateDoc(userRef, {
        SavedBID: arrayUnion(id),
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
        SavedBID: arrayRemove(id),
      });
      setStateWishList(true);
    };

    remWishList();
  };

  const addLike = () => {
    const remWishList = async () => {
      //console.log(user)
      await updateDoc(BlogCollectionRef, {
        LikeUID: arrayRemove(id),
      });
      setLike(false);
    };

    remWishList();
  };

  const removeLike = () => {
    const remWishList = async () => {
      //console.log(user)
      await updateDoc(BlogCollectionRef, {
        LikeUID: arrayRemove(id),
      });
      setLike(true);
    };

    remWishList();
  };

  const [index, setIndex] = useState(0);

  const [comment, setComment] = useState({
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
      await updateDoc(BlogCollectionRef, {
        Comments: arrayUnion({
          comment,
          UId: user.uid,
          name: user.name,
          image: user.image,
        }),
      });
      openModal(false);
      const comm = [
        ...Blog.Comments,
        { comment, UId: user.uid, name: user.name, image: user.image },
      ];
      comm[comm.length - 1].comment.date = Timestamp.fromDate(comment.date);
      // console.log(comm[comm.length-1].comment.date)
      setBlog({ ...Blog, Comments: comm });
      //console.log(comm)
      setComment({
        message: "",
        date: new Date(),
      });
    };
    addComment();
  };

  const toggleModal = () => {
    openModal(!modal);
    setComment({
      message: "",
      date: new Date(),
    });
  };

  return (
    <>
      {Blog !== undefined ? (
        <div>
          <MDBContainer fluid className="bg-success ">
            <MDBRow className="d-flex justify-content-center align-items-center ">
              <MDBCol lg="8" className="mt-5">
                <h1 className="mb-4">{Blog.title}</h1>
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
              {Blog.MediaID !== undefined && Blog.MediaID.length !== 0 ? (
                Blog.MediaID.map((element,id) => (
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
              <Card.Title>Author</Card.Title>
              <Card.Text>{Blog.honorifics !== undefined ? Blog.honorifics.name : ""} {Blog.author}</Card.Text>
            </Card.Body>
          </Card>
          <Card className="mx-3 my-2">
            <Card.Body>
              <Card.Text>{Blog.description}</Card.Text>
            </Card.Body>
          </Card>
          {addToWishList === true ? (
            <>
              <div className="  mb-3">
                <MDBBtn
                  color="success"
                  size="sm"
                  type="submit"
                  onClick={addWishList}
                >
                  {/* <Icon icon={heart} /> */}
                  Save Blog
                </MDBBtn>
              </div>
            </>
          ) : (
            <div className="  mb-3">
              <MDBBtn
                variant="light"
                size="sm"
                color=" success"
                type="submit"
                onClick={removeWishList}
                style={{ border: "1px solid" }}
              >
                {/* <Icon icon={heart} /> */}
                Unsave Blog
              </MDBBtn>
            </div>
          )}
          <Link to={`/userProfile/${Blog.UID}/`}>
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
          {like === true ? (
            <>
              <Button
            variant="danger "
            type="submit"
            onClick={(e) => addLike()}
            className="m-4"
          >
            <Icon size={20} icon={heart} />
           Like
          </Button>
            </>
          ) : (
            
              <Button
            variant="danger "
            type="submit"
            onClick={(e) => removeLike()}
            className="m-4"
          >
            <Icon size={20} icon={heart} />
           UnLike
          </Button>
           
          )}
          

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

                  {Blog.Comments !== undefined &&
                  Blog.Comments.length !== 0 ? (
                    Blog.Comments.map((element, id) => (
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

export default ViewFullBlog;
