import axios from "axios";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link } from "react-router-dom";
import { db } from "../firebase-config";
import { collection, getDocs, doc, getDoc, Query } from "firebase/firestore";
import { Icon } from "react-icons-kit";
import { search } from "react-icons-kit/icomoon/search";
import { x } from "react-icons-kit/oct/x";

import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBIcon,
  MDBBtn,
  MDBRipple,
  MDBTooltip,
  MDBCardOverlay,
  MDBCardTitle,
  MDBCardText,
} from "mdb-react-ui-kit";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import UserContext from "../Contexts/UserContext";
import Spinner from "./Spinner";
import BlogContext from "../Contexts/BlogsContext";
import { query, where } from "firebase/firestore";

export default function Blogs() {
  //const [Blogs,setBlogs] = useState()
  const BlogCollectionRef = collection(db, "Blogs");
  const { user, setUser } = useContext(UserContext);
  const { blogs, setBlogs } = useContext(BlogContext);
  const [filteredBlogs, setFilteredBlogs] = useState();
  const auth = getAuth();

  const [suggestions, setSuggestion] = useState([]);

  useEffect(() => {
    if (blogs === undefined) {
      const getBlogs = async () => {
        const data = await getDocs(BlogCollectionRef);
        //console.log(data)
        setBlogs(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setFilteredBlogs(
          data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );
        //console.log(Blogs)
      };

      getBlogs();
      //console.log(Blogs)
    } else if (filteredBlogs === undefined) {
      setFilteredBlogs(blogs.map((doc) => ({ ...doc })));
    }
  }, [Blogs]);

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
      }
    });
  }

  const [searchedItem, setSearchedItem] = useState("");

  const setSearch = (value) => {
    
    setSearchedItem(value);
    if (value !== "")
      setSuggestion(
        blogs.filter((element) =>
          element.title.toLowerCase().includes(value.toLowerCase())
        ).map((element) => element.title)
      );
    else setSuggestion([]);
    
  };

  const findBlogs = () => {
    setSuggestion();
    const keywordArray = searchedItem.toLowerCase().split(" ");
    

    const getData = () => {
      setFilteredBlogs(
        blogs.map((Blog) => ({
          ...Blog,
          matchCount: findMatchCount(Blog.keywords, keywordArray),
        }))
          .filter((Blog) => Blog.matchCount !== 0)
          .sort((p1, p2) => p2.matchCount - p1.matchCount)
      );
    };
    if (searchedItem !== "") getData();
  };

  const findMatchCount = (keywords, words) => {
    let c = 0;
    if (keywords !== undefined)
      words.forEach((element) => {
        if (keywords.includes(element)) c++;
      });
    
    return c;
  };

  const clearSearch = (e) => {
    setSearchedItem("");
    setSuggestion();
    setFilteredBlogs(blogs.map((doc) => ({ ...doc })));
    
  };

  return (
    <div className="bg-success">
      {/* search bar */}

      <div>
        <div className=" md-5 d-flex justify-content-center py-3 pe-5  ">
          <div className="d-flex align-self-center">
            <div>
              <input
                className="form-control  hoverable "
                placeholder="Search"
                style={{ width: "300px" }}
                type="text"
                aria-label="Search"
                value={searchedItem}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key == "Enter") findBlogs();
                }}
              ></input>
              <div
                style={{
                  borderRight: "1px solid darkgray",
                  borderLeft: "1px solid darkgray",
                  background: "white",
                }}
              >
                {suggestions !== undefined && suggestions.length !== 0 ? (
                  suggestions.map((element) => {
                    return (
                      <>
                        <div
                          style={{ borderBottom: "1px solid white" }}
                          onClick={(e) => {
                            setSearch(element);
                            findBlogs();
                          }}
                        >
                          <Link
                            style={{
                              textDecoration: "none",
                              fontWeight: "bold",
                              color: "black",
                            }}
                          >
                            {element}
                          </Link>
                        </div>
                      </>
                    );
                  })
                ) : (
                  <></>
                )}
              </div>
            </div>

            <Button className="pt-2 pb-2 ms-1 btn-light" onClick={findBlogs}>
              <Icon
                icon={search}
                className="d-flex align-self-center "
                size={18}
              />
            </Button>
            <Button className=" ms-1 btn-light" onClick={clearSearch}>
              <Icon icon={x} className="d-flex align-self-center " size={22} />
            </Button>
          </div>
        </div>
      </div>

      {filteredBlogs !== undefined && filteredBlogs.length !== 0 ? (
        <MDBContainer
          fluid
          className=" text-center "
          style={{ alignContent: "center" }}
        >
          <MDBRow className="d-flex justify-content-center py-3 rows-col-xl-10">
            {filteredBlogs.map((Blog) => (
              <MDBCol
                className="my-2 mx-1 col-md-4 col-lg-4 col-sm-10 col-xl-3"
                key={Blog.id}
              >
                <Link
                  to={`/viewBlog/${Blog.id}`}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <MDBCard>
                    <MDBRipple
                      rippleColor="light"
                      rippleTag="div"
                      className="bg-image rounded hover-zoom"
                    >
                      <MDBCardImage
                        src={
                          Blog.MediaID !== undefined &&
                          Blog.MediaID.length !== 0
                            ? Blog.MediaID[0]
                            : require("../default_image.webp")
                        }
                        fluid
                        className="w-100"
                        style={{ height: "250px" }}
                      />
                      
                        <MDBCardTitle style={{fontSize:"20px" , paddingTop:"5px"}}>{Blog.title}</MDBCardTitle>
                        <MDBCardText style={{fontSize:"13px", textAlign:"justify"  , paddingLeft:"10px", paddingRight:"10px", paddingBottom:"10px"}}>
                          {Blog.subtitle}
                          This is a wider card with supporting text below as a
                          natural lead-in to additional content. This content is
                          a little bit longer.
                        </MDBCardText>
                       
                      
                    </MDBRipple>
                  </MDBCard>
                </Link>
              </MDBCol>
            ))}
          </MDBRow>
        </MDBContainer>
      ) : filteredBlogs !== undefined && filteredBlogs.length === 0 ? (
        <h5 className="py-5">No Blogs found.</h5>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
