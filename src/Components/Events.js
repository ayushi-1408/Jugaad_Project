import axios from 'axios';
import React, {useState, useEffect, useContext} from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {Link} from 'react-router-dom';
import {db} from '../firebase-config';
import {collection , getDocs , getDoc, doc} from 'firebase/firestore';
import UserContext from '../Contexts/UserContext';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Spinner from './Spinner';
import EventsContext from '../Contexts/EventsContext';

export default function Events() {
  const {events,setEvents} = useContext(EventsContext)
  const eventCollectionRef = collection(db , "Events" )
  const { user, setUser } = useContext(UserContext);
  const auth = getAuth();

  useEffect(() => {
    if(events===undefined) {
      const getEvents = async () => {
        const data = await getDocs(eventCollectionRef)
        console.log(data)
        setEvents(data.docs.map((doc) => ({...doc.data(), id:doc.id })))
     }
 
     getEvents();
    }
 
  },[!events])

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
      events !== undefined ? (
        <div >
    <Row xs={1} md={2} className="g-4">
      {events.map(product => (
        <Col>
          <Link to={`/viewProduct/${product.id}`}
           style={{textDecoration: 'none',color:'black'}}>
          <Card key={product.id} >           
            <Card.Body className='col-md-6 align-self-center'>
              <Card.Title>{product.title}</Card.Title>
              <Card.Text>
                {product.description}
              </Card.Text>
              <Card.Text>
                {product.date}
              </Card.Text>
              <Card.Text>
                {product.location}
              </Card.Text>
            </Card.Body>
          </Card>
          </Link>
          
        </Col>
      ))}
    </Row>
    </div>
      ) : (
        <Spinner/>
      )
    }
    </>
    
  )
}