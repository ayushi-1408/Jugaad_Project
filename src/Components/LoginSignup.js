import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import UserContext from '../Contexts/UserContext';
import {MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';

export default function LoginSignup() {

  // const [loginUser,setLoginUser] = useState([])

  // const {user,setUser} = useContext(UserContext)

  //   const navigate=useNavigate()

  //   const handleInput = (e) => {
  //       const name=e.target.placeholder;
  //       const value=e.target.value;

  //       setLoginUser({...loginUser, [name]:value})
  //       //console.log(newProduct)
  //   }

  

  // const handleSignup = (e) => {
  //   e.preventDefault()
  //     navigate('/newUser')
  // }

  // const handleLogin = (e) => {
  //   e.preventDefault()

  //    const auth = getAuth();
  //   signInWithEmailAndPassword(auth, loginUser.email, loginUser.password)
  //     .then((userCredential) => {
  //   // Signed in 
  //   const userr = userCredential.user;
  //   //console.log(user)
  //    if(userr.emailVerified) {
  //        setUser(userr.uid)
  //        navigate('/userProfile')
  //    }
  //    else {
  //      alert("Verify email")
  //    }
  // })
  // .catch((error) => {
  //   const errorCode = error.code;
  //   const errorMessage = error.message;
  //   alert(errorMessage)
  // });
      
  // }


  return (
    <>
    {/* <div>
      <Form>
      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email</Form.Label>
        <Form.Control type="email" placeholder="email" onChange={handleInput} value={loginUser.email}/>
      </Form.Group>
      <Form.Group className="mb-3" controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="password" onChange={handleInput} value={loginUser.password}/>
      </Form.Group>
      <Button variant="primary" type="submit" onClick={handleLogin} >
        Login
      </Button>
      </Form>
      <div>
      <Button variant="primary" type="submit" onClick={handleSignup} >
        Signup
      </Button>
      </div>
    </div>
    */}


  


    <MDBContainer fluid className="p-3 my-5 h-custom" style={{  width:' 100%',
  height: '100%', background: 'linear-gradient(to right, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5))' , backgroundSize:'cover'}}>

      <MDBRow>

        <MDBCol col='10' md='6'>
          <img src={ require('../l.png') } class="img-fluid" alt="Sample image" />
        </MDBCol>

        <MDBCol col='4' md='6'>

          <div className="d-flex flex-row align-items-center justify-content-center">

            <p className="lead fw-normal mb-0 me-3">Sign in with</p>

            <MDBBtn floating size='md' tag='a' className='me-2'>
              <MDBIcon fab icon='fa fa-facebook' />
            </MDBBtn>

            <MDBBtn floating size='md' tag='a'  className='me-2'>
              <MDBIcon fab icon='twitter' />
            </MDBBtn>

            <MDBBtn floating size='md' tag='a'  className='me-2'>
              <MDBIcon fab icon='linkedin-in' />
            </MDBBtn>

          </div>

          <div className="divider d-flex align-items-center my-4">
            <p className="text-center fw-bold mx-3 mb-0">Or</p>
          </div>

          <MDBInput wrapperClass='mb-4' label='Email address' id='formControlLg' type='email' size="lg"/>
          <MDBInput wrapperClass='mb-4' label='Password' id='formControlLg' type='password' size="lg"/>

          <div className="d-flex justify-content-between mb-4">
            <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
            <a href="!#">Forgot password?</a>
          </div>

          <div className='text-center text-md-start mt-4 pt-2'>
            <MDBBtn className="mb-0 px-5" size='lg'>Login</MDBBtn>
            <p className="small fw-bold mt-2 pt-1 mb-2">Don't have an account? <a href="NewUser.js" className="link-danger">Register</a></p>
          </div>

        </MDBCol>

      </MDBRow>

      

        <div>

          <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white' }}>
            <MDBIcon fab icon='facebook-f' size="md"/>
          </MDBBtn>

          <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white'  }}>
            <MDBIcon fab icon='twitter' size="md"/>
          </MDBBtn>

          <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white'  }}>
            <MDBIcon fab icon='google' size="md"/>
          </MDBBtn>

          <MDBBtn tag='a' color='none' className='mx-3' style={{ color: 'white'  }}>
            <MDBIcon fab icon='linkedin-in' size="md"/>
          </MDBBtn>

        </div>

    

    </MDBContainer>
 
    </>
  )
}
