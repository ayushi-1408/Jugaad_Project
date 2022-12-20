import React, { useState, useEffect, useContext } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../firebase-config";
import {
  collection,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import UserContext from "../Contexts/UserContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Spinner from "./Spinner";

function ViewFullBlog(props) {
  const param = useParams();
  const { id } = param;
  console.log(id);
  const [blog, setblog] = useState();
  const [save, setsave] = useState(true);

  const { user, setUser } = useContext(UserContext);
  const auth = getAuth();

  const blogCollectionRef = doc(db, "Blogs", id);

  const nav=useNavigate()

  if (user==undefined || user.uid == undefined) {
    onAuthStateChanged(auth, (userr) => {
      if (userr) {
       // console.log(userr);
        const getUser = async () => {
          const userRef = doc(db, "Users", userr.uid);
          const data = await getDoc(userRef);
          setUser({...data.data(),uid:userr.uid})
        };
        getUser();
      } else {
        nav('/login')
      }
    });
  }



  useEffect(() => {
    const getblog = async () => {
      const data = await getDoc(blogCollectionRef);
      console.log(user)
      if(user.SavedBID !== undefined && user.SavedBID.length > 0 ) user.SavedBID.forEach((blog) => id === blog ? setsave(false) : console.log())
      console.log(data.data());
      setblog(data.data());
    };

    getblog();
  }, []);

  const handleSave = () => {
    const userRef = doc(db, "Users", user.uid);
    const addToCart = async () => {
      //console.log(user)
      await updateDoc(userRef, {
        SavedBID: arrayUnion(id),
      });
      setsave(false)
      console.log("updated saved blogs");
    };

    addToCart();
  };

  const handleSaveRemove = () => {
    const userRef = doc(db, "Users", user.uid);
    const addToCart = async () => {
      //console.log(user)
      await updateDoc(userRef, {
        SavedBID: arrayRemove(id),
      });
      setsave(true)
      console.log("updated saved blogs");
    };

    addToCart();
  };


  return (
    <>
    {
      blog !== undefined ? (
        <div>
      <Card>
        <p style={{ alignContent: "center" }}>
          <Card.Img
            variant="top"
            src={blog.image}
            style={{ maxWidth: "100px", maxHeight: "100px" }}
          />
        </p>
        <Card.Body>
          <Card.Text>{blog.title}</Card.Text>
        </Card.Body>
      </Card>
      <br />
      <Card>
        <Card.Body>
          <Card.Text>{blog.description}</Card.Text>
        </Card.Body>
        {
            save === true ? (
              <Button variant="light" type="submit" onClick={handleSave}>
            Save
          </Button>
            ) : (
              <Button variant="dark " type="submit" onClick={handleSaveRemove} >
            Remove from Saved
          </Button>
            )
          }
      </Card>
    </div>
      ) : (
        <Spinner/>
      )
    }
    </>
    
  );
}

export default ViewFullBlog;
