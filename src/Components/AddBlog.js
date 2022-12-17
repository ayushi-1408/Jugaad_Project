import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import {db} from '../firebase-config';
import {addDoc, arrayUnion, collection , doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import UserContext from '../Contexts/UserContext';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  Button,
  Card,
  CardBody,
  CardText,
  Col,
  Container,
  Input,
  Row,
} from "reactstrap";


function AddBlog() {
    const [newBlog,setNewBlog] = useState({})
    const BlogCollectionRef = collection(db , "Blogs" )

    const {user,setUser}= useContext(UserContext)
    const auth=getAuth()

    const nav=useNavigate()

    if(!user) {
      onAuthStateChanged(auth, (userr) => {
        if (userr) {
          console.log(userr)
          setUser(userr.uid)
        } else {
          console.log("not signed")
          nav('/login')
        }
      });
    }

    const handleInput = (e) => {
        const name=e.target.placeholder;
        const value=e.target.value;
          setNewBlog({...newBlog, [name]:value})
        console.log(name)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(newBlog)
        const addBlog = async () => {
            setNewBlog({...newBlog, UID:user})
            const ref1 = await addDoc(BlogCollectionRef,newBlog)
            console.log(ref1.id)
            const userRef = doc(db, "Users", user)
            await updateDoc(userRef,{
            BID:arrayUnion(ref1.id)
            })
            console.log("updated user")
         }
     
         addBlog();

    }

     

  return (
    <Container className="mt-4">
      

      <Row className="my-4">
        <Col
          md={{
            size: 9,
            offset: 1,
          }}
        >
          <h3>Write your Jugaad</h3>

        

          <Card className="mt-4 border-0">
            <CardBody>
            <Input type="text" placeholder="title" onChange={handleInput} />
              <Input type="textarea" placeholder="description" onChange={handleInput} />

              <Button onClick={handleSubmit} className="mt-2" color="primary">
                Create Post
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default AddBlog
