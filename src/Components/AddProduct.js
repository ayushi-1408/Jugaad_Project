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
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBTextArea,
  MDBFile
}
from 'mdb-react-ui-kit';

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
    <div >
      {/* <Form>
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
    </Form> */}
   



    <MDBContainer fluid className='bg-success ' >
      <MDBRow className='d-flex justify-content-center align-items-center '>
        <MDBCol lg='9' className='mt-5 mb-5'>

          <h1 class="mb-4">Add your Product</h1>

          <MDBCard>
            <MDBCardBody className='px-4'>

              <MDBRow className='align-items-center pt-4 pb-3'>

                <MDBCol md='3' className='ps-5'>
                  <h6 className="mb-0">Title</h6>
                </MDBCol>

                <MDBCol md='9' className='pe-5'>
                  <MDBInput label='Title' size='lg'  type='text' />
                </MDBCol>

              </MDBRow>

              <hr className="mx-n3" />

              <MDBRow className='align-items-center pt-4 pb-3'>

                <MDBCol md='3' className='ps-5'>
                  <h6 className="mb-0">Description</h6>
                </MDBCol>

                <MDBCol md='9' className='pe-5'>
                  <MDBTextArea label='Description'  rows={3} />
                </MDBCol>

              </MDBRow>

              <hr className="mx-n3" />
              <MDBRow className='align-items-center pt-4 pb-3'>

                <MDBCol md='3' className='ps-5'>
                  <h6 className="mb-0">Price</h6>
                </MDBCol>

                <MDBCol md='9' className='pe-5'>
                  <MDBInput label='Price' size='lg'  type='number' />
                </MDBCol>

                </MDBRow>
                
                <hr className="mx-n3" />


              <MDBRow className='align-items-center pt-4 pb-3'>

                <MDBCol md='3' className='ps-5'>
                  <h6 className="mb-0">Upload Photos</h6>
                </MDBCol>

                <MDBCol md='9' className='pe-5'>
                  <MDBFile size='lg' id='customFile' />
                  <div className="small text-muted mt-2">Upload relevant file/Photos. Max file size 50 MB</div>
                </MDBCol>

              </MDBRow>

              <hr className="mx-n3" />

              <MDBBtn className='my-4' size='lg' type="submit" >SUBMIT</MDBBtn>

            </MDBCardBody>
          </MDBCard>

        </MDBCol>
      </MDBRow>

    </MDBContainer>

    </div>
  )
}

export default AddProduct
