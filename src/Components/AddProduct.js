import React, { useContext, useEffect } from 'react'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {db} from '../firebase-config';
import {addDoc, arrayUnion, collection , doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import UserContext from '../Contexts/UserContext';
import { Link, redirect, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import ProductContext from '../Contexts/ProductsContext';


function AddProduct() {
    const [newProduct,setNewProduct] = useState({
      price:0,
      title:"",
      dateOfPosting:new Date(),
      description:"",
      MediaID:[],
      CommentID:[],
      categories:[],
      BID:[],
      deliverySpan:1
    })
    const productCollectionRef = collection(db , "Products" )

    const {user,setUser}= useContext(UserContext)
    const {products, setProducts} = useContext(ProductContext)
    const auth=getAuth()

    const userData=[{}]

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
  

    const handleInput = (e) => {
        const name=e.target.placeholder;
        const value=e.target.value;
        if(name=='price') {
          setNewProduct({...newProduct, [name]:parseInt(value)})
        }
        else {
          setNewProduct({...newProduct, [name]:value})
        }
        
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(newProduct)
        const addProduct = async () => {
            setNewProduct({...newProduct, UID:user})
            const ref1 = await addDoc(productCollectionRef,newProduct)
            console.log(ref1.id)
            const userRef = doc(db, "Users", user)
            await updateDoc(userRef,{
            PID:arrayUnion(ref1.id)
            })
            console.log("updated user")
            setProducts();
            setUser();
            nav('/userProfile');
         }
     
         addProduct();

    }

     

  return (
    <div>
      <Form>
      <Form.Group className="mb-3" controlId="title">
        <Form.Label>Title</Form.Label>
        <Form.Control type="name" placeholder="title" onChange={handleInput} value={newProduct.title} />
        <Form.Text className="text-muted">
          We'll never share your data with anyone else.
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="description">
        <Form.Label>Description</Form.Label>
        <Form.Control type="text" placeholder="description" onChange={handleInput} value={newProduct.description} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="price">
        <Form.Label>Price</Form.Label>
        <Form.Control type="number" placeholder="price" onChange={handleInput} value={newProduct.price}/>
      </Form.Group>
      <Button variant="primary" type="submit" onClick={handleSubmit}>
        Submit
      </Button>
    </Form>
    </div>
  )
}

export default AddProduct
