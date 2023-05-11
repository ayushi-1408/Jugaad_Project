import React, { useContext, useEffect } from "react";
import "../App.css";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { db, storage } from "../firebase-config";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import UserContext from "../Contexts/UserContext";
import { Link, redirect, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import BlogContext from "../Contexts/BlogsContext";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBTextArea,
  MDBFile,
} from "mdb-react-ui-kit";

import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { TagsInput } from "react-tag-input-component";
import { WithContext as ReactTags } from "react-tag-input";
import Spinner from "./Spinner";
import ReactSelect from "react-select";

function AddBlog() {
  const [newBlog, setNewBlog] = useState({
    title: "",
    subtitle: "",
    honorifics:"",
    author: "",
    dateOfPosting: new Date(),
    description: "",
    MediaID: [],
    LIkeUID: [],
    Comments: [],
    categories: [],
    PID: [],
  });
  const [media, setMedia] = useState([]);
  const [tags, setTags] = React.useState([]);
  const [spinner, setSpinner] = useState(false);

  const BlogCollectionRef = collection(db, "Blogs");

  const { user, setUser } = useContext(UserContext);
  const { Blogs, setBlogs } = useContext(BlogContext);
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

  const handleInput = (e) => {
   // console.log(tags);
    const name = e.target.name;
    const value = e.target.value;
    if (name === "file") {
      for (let x = 0; x < e.target.files.length; x++) {
        setMedia((elements) => [...elements, e.target.files[x]]);
      }
    } else {
      setNewBlog({ ...newBlog, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSpinner(true);
    console.log(newBlog);
    setNewBlog({ ...newBlog, UID: user.uid });
    const addBlog = async () => {
      const ref1 = await addDoc(BlogCollectionRef, newBlog);
      // add images to storage
      media.forEach(async (element) => {
        //console.log(element);
        const imageRef = ref(storage, `images/${element.name}`);
        await uploadBytes(imageRef, element).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            updateDoc(ref1, {
              MediaID: arrayUnion(url),
              UID:user.uid
            });
          });
        });
      });
      await updateDoc(ref1, {
        keywords: tags,
      });
      //console.log(ref1.id);
      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, {
        BID: arrayUnion(ref1.id),
      });
      //console.log("updated user");
      setNewBlog({
        title: "",
        subtitle: "",
        honorifics:"",
        author: "",
        dateOfPosting: new Date(),
        description: "",
        MediaID: [],
        LIkeUID: [],
        Comments: [],
        categories: [],
        PID: [],
      });
      setBlogs();
      setUser();
      setTags([]);
      setSpinner(false);
      alert('Blog added');
    };

    addBlog();
  };

  const honorifics = [
    {
      label:"Mr.",
      name:"Mr."
    },
    {
      label:"Mrs.",
      name:"Mrs."
    },
    {
      label:"Ms.",
      name:"Ms."
    },
    {
      label:"Dr.",
      name:"Dr."
    },
    {
      label:"Miss",
      name:"Miss"
    },
    {
      label:"Master",
      name:"Master"
    }
  ]

  return (
    <div>
      <MDBContainer fluid className="bg-success ">
        <MDBRow className="d-flex justify-content-center align-items-center ">
          <MDBCol sm="10" md="8"  xl="6" className="mt-4 mb-5">
            <h1 class="mb-4">Add your Blog</h1>

            <MDBCard>
              <MDBCardBody className="px-4">
                <MDBRow className="align-items-center pt-4 pb-3">
                  <MDBCol md="3" className="ps-5">
                    <h6 className="mb-0">Title</h6>
                  </MDBCol>

                  <MDBCol md="9" className="pe-5">
                    <MDBInput
                      label="Title"
                      //size="lg"
                      type="text"
                      name="title"
                      onChange={handleInput}
                      value={newBlog.title}
                    />
                  </MDBCol>
                </MDBRow>

                <hr className="mx-n3" />

                <MDBRow className="align-items-center pt-4 pb-3">
                  <MDBCol md="3" className="ps-5">
                    <h6 className="mb-0">Subtitle</h6>
                  </MDBCol>

                  <MDBCol md="9" className="pe-5">
                    <MDBInput
                      label="Give a Brief Description"
                      // size="lg"
                      type="text"
                      name="subtitle"
                      onChange={handleInput}
                      value={newBlog.subtitle}
                    />
                  </MDBCol>
                </MDBRow>

                <hr className="mx-n3" />

                <MDBRow className="align-items-center pt-4 pb-3">
                  <MDBCol md="3" className="ps-5">
                    <h6 className="mb-0">Description</h6>
                  </MDBCol>

                  <MDBCol md="9" className="pe-5">
                    <MDBTextArea
                      label="Description"
                      rows={4}
                      name="description"
                      onChange={handleInput}
                      value={newBlog.description}
                    />
                  </MDBCol>
                </MDBRow>

                <hr className="mx-n3" />

                <MDBRow className="align-items-center pt-4 pb-3">
                  <MDBCol md="3" className="ps-5">
                    <h6 className="mb-0">Author</h6>
                  </MDBCol>

                  <MDBCol md="2" className="pe-1">
                  <ReactSelect
                      id="city"
                      name="honorifics"
                      options={honorifics}
                      value={newBlog.honorifics}
                      onChange={(val) => setNewBlog({...newBlog, honorifics:val})}
                    />
                    </MDBCol>
                    <MDBCol md="7" className="pe-5">
                    <MDBInput
                      label="Author"
                      type="text"
                      name="author"
                      onChange={handleInput}
                      value={newBlog.author}
                    />
                  </MDBCol>
                </MDBRow>

                <hr className="mx-n3" />

                <MDBRow className="align-items-center pt-4 pb-3">
                  <MDBCol md="3" className="ps-5">
                    <h6 className="mb-0">Upload Media</h6>
                  </MDBCol>

                  <MDBCol md="9" className="pe-5">
                    <MDBFile
                      //size="lg"
                      name="file"
                      onChange={handleInput}
                      multiple
                      id="customFile"
                    />
                    <div className="small text-muted mt-2">
                      Upload relevant file/Photos. Max file size 50 MB
                    </div>
                  </MDBCol>
                </MDBRow>
                <hr className="mx-n3" />
                <MDBRow>
                  <MDBCol md="3" className="ps-5">
                    <h6 className="mb-0">Add related keywords</h6>
                  </MDBCol>
                  <MDBCol>
                    <TagsInput
                      value={tags}
                      onChange={setTags}
                      name="Keywords"
                      placeHolder="Press Enter to add Keywords"
                    />
                  </MDBCol>
                </MDBRow>
                <hr className="mx-n3" />

                {spinner ? (
                  <Spinner />
                ) : (
                  <MDBBtn
                    className="my-4"
                    size="lg"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    SUBMIT
                  </MDBBtn>
                )}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default AddBlog;
