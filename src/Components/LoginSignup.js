import { FacebookAuthProvider, getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, TwitterAuthProvider } from 'firebase/auth';
import React, { useState } from 'react'
import { useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../Contexts/UserContext';
import {MDBContainer, MDBCol, MDBRow, MDBBtn, MDBIcon, MDBInput, MDBCheckbox } from 'mdb-react-ui-kit';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

export default function LoginSignup() {

  const [loginUser,setLoginUser] = useState([])

  const [newUser,setNewUser] = useState({
    name:"",
    password:"",
    description:"",
    dateOfPosting:new Date(),
    address:"",
    connections: {
      connected:[],
      requestsReceived:[],
      requestsSent:[]
    },
    dob:"",
    email:"",
    mobile:null,
    OID:[],
    BID:[],
    Cart:[],
    PID:[],
    EID:[],
    WishPID:[],
    SavedBID:[],
    SavedEID:[],
    additionalInfo:{}
  })

  const {user,setUser} = useContext(UserContext)

    const navigate=useNavigate()

    const auth = getAuth();

    const nav=useNavigate()


    onAuthStateChanged(auth, (userr) => {
      if (userr) {
        nav('/')
      }
    });

    const handleInput = (e) => {
        const name=e.target.name;
        const value=e.target.value;
        //console.log(loginUser)
        setLoginUser({...loginUser, [name]:value})
        //console.log(newProduct)
    }

  

  const handleSignup = (e) => {
    e.preventDefault()
      navigate('/newUser')
  }

  const handleLogin = (e) => {
    e.preventDefault()

    signInWithEmailAndPassword(auth, loginUser.email, loginUser.password)
      .then((userCredential) => {
    // Signed in 
    signIn(userCredential)
    
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage)
  });
      
  }

  const signInWithFacebook = () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth,provider)
    .then((userCredential) => {
      auth.currentUser.emailVerified=true;
      console.log(auth.currentUser)
      signIn(userCredential)
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage)
    });
  }

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth,provider)
    .then((userCredential) => {
      console.log("yes")
      console.log(userCredential)
      auth.currentUser.emailVerified=true;
      console.log(auth.currentUser)
      signIn(userCredential)
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage)
    });
  }

  const signInWithTwitter = () => {
    const provider = new TwitterAuthProvider();
    signInWithPopup(auth,provider)
    .then((userCredential) => {
      auth.currentUser.emailVerified=true;
      console.log(auth.currentUser)
      signIn(userCredential)
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(errorMessage)
    });
  }

  const signIn = (userCredential) => {
    const userr = userCredential.user;
    console.log(userr)
    //console.log(user)
     if(userr.emailVerified) {
         
      const setUserName = async() => {
       // console.log(user)

        const userRef = doc(db, "Users", userr.uid);
        const data = await getDoc(userRef);
        console.log(data)
        if(!data.exists()) {
          setDoc(userRef,newUser);
          updateDoc(userRef,{email:userCredential.user.email,name:userCredential.user.displayName,mobile:userCredential.user.phoneNumber});
        }
        console.log(newUser)
        
       // console.log(user)
        navigate(`/userProfile/${userr.uid}`)
       }

       setUserName()
     }
     else {
       alert("Verify email")
     }
  }


  return (
    <>

    <MDBContainer fluid className="p-3 my-5 h-custom" style={{  width:' 100%',
  height: '100%', background: 'linear-gradient(to right, rgba(102, 126, 234, 0.5), rgba(118, 75, 162, 0.5))' , backgroundSize:'cover'}}>

      <MDBRow>

        <MDBCol col='10' md='6'>
          <img src={ require('../l.png') } class="img-fluid" alt="Sample image" />
        </MDBCol>

        <MDBCol col='4' md='6'>

          <div className="d-flex flex-row align-items-center justify-content-center">

            <p className="lead fw-normal mb-0 me-3">Sign in with</p>

            <MDBBtn floating size='md' tag='a'  className='me-2' onClick={signInWithGoogle}>
              <MDBIcon fab icon='google' >G</MDBIcon>
            </MDBBtn>

            <MDBBtn floating size='md' tag='a' className='me-2' onClick={signInWithFacebook}>
            <MDBIcon fab icon="fab fa-facebook-square" >F</MDBIcon>
            </MDBBtn>

            <MDBBtn floating size='md' tag='a'  className='me-2' onClick={signInWithTwitter}>
              <MDBIcon fab icon='twitter' >T</MDBIcon>
            </MDBBtn>

          </div>

          <div className="divider d-flex align-items-center my-4">
            <p className="text-center fw-bold mx-3 mb-0">Or</p>
          </div>

          <MDBInput wrapperClass='mb-4' label='Email address' name="email" id='formControlLg' type='email' size="lg" onChange={handleInput} value={loginUser.email}/>
          <MDBInput wrapperClass='mb-4' label='Password' name="password" id='formControlLg' type='password' size="lg" onChange={handleInput} value={loginUser.password}/>

          <div className="d-flex justify-content-between mb-4">
            <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
            <a href="!#">Forgot password?</a>
          </div>

          <div className='text-center text-md-start mt-4 pt-2'>
            <MDBBtn className="mb-0 px-5" size='lg' onClick={handleLogin}>Login</MDBBtn>
            <p className="small fw-bold mt-2 pt-1 mb-2">Don't have an account? <Link to="/newUser" className="link-danger">Register</Link></p>
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
