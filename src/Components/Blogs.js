import axios from 'axios';
import React, {useState, useEffect, useContext} from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {Link} from 'react-router-dom';
import {db} from '../firebase-config';
import {collection , doc, getDoc, getDocs } from 'firebase/firestore';
import {
  MDBCard,
  MDBCardImage,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBCardFooter,
  MDBRow,
  MDBCol
} from 'mdb-react-ui-kit';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import UserContext from '../Contexts/UserContext';
import Spinner from './Spinner';
import BlogsContext from '../Contexts/BlogsContext';

export default function Blogs() {
  const {blogs,setBlogs} = useContext(BlogsContext)
  const blogCollectionRef = collection(db , "Blogs" )
  const auth = getAuth();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if(blogs===undefined) {
      const getblogs = async () => {
        const data = await getDocs(blogCollectionRef)
        //console.log(data)
        setBlogs(data.docs.map((doc) => ({...doc.data(), id:doc.id })))
     }
 
     getblogs();
    }
  
  },[])

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
      }
    });
  }


  return (
    <>
    {
      blogs !== undefined ? (
        <MDBRow className='row-cols-1 row-cols-md-3 g-4'>
        {blogs.map((blog) => (
          <MDBCol key={blog.id}>
          <MDBCard className='h-100'>
          <Link to={`/viewBlog/${blog.id}`}>
            <MDBCardImage
              src={blog.image}
              alt='...'
              position='top'
            />
            <MDBCardBody>
              <MDBCardTitle>{blog.title}</MDBCardTitle>
              <MDBCardText>
                {blog.description}
              </MDBCardText>
            </MDBCardBody>
            <MDBCardFooter>
              <small className='text-muted'>Last updated 3 mins ago</small>
            </MDBCardFooter>
            </Link>
          </MDBCard>
        </MDBCol>
        ))}
        
        
      </MDBRow>
      ) : (
        <Spinner/>
      )
    }
    
  
    </>
  )
}
