import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {db} from '../firebase-config';
import {addDoc, arrayUnion, collection , doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import UserContext from '../Contexts/UserContext';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';


function AddEvent() {
    const [newEvent,setNewEvent] = useState([])
    const eventCollectionRef = collection(db , "Events" )

    const {user,setUser}= useContext(UserContext)

    const userData=[{}]

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

        setNewEvent({...newEvent, [name]:value})
        //console.log(newEvent)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(newEvent)
        const addEvent = async () => {
            setNewEvent({...newEvent, UID:user})
            const ref1 = await addDoc(eventCollectionRef,newEvent)
            console.log(ref1.id)
            const userRef = doc(db, "Users", user)  
            await updateDoc(userRef,{
            PID:arrayUnion(ref1.id)
            })
            console.log("updated user")
         }
     
         addEvent();

    }

     

  return (
    <div>
      <Form>
      <Form.Group className="mb-3" controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control type="name" placeholder="title" onChange={handleInput} value={newEvent.title} />
        <Form.Text className="text-muted">
          We'll never share your data with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control type="text" placeholder="description" onChange={handleInput} value={newEvent.description} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="date">
        <Form.Label>Date</Form.Label>
        <Form.Control type="date" placeholder="date" onChange={handleInput} value={newEvent.date}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="location">
        <Form.Label>Location</Form.Label>
        <Form.Control type="text" placeholder="location" onChange={handleInput} value={newEvent.location}/>
      </Form.Group>
      <Button variant="primary" type="submit" onClick={handleSubmit}>
        Submit
      </Button>
    </Form>
    </div>
  )
}

export default AddEvent