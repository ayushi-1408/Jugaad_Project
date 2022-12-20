import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { MDBRipple ,MDBContainer, MDBTypography} from 'mdb-react-ui-kit';
import {
 
  MDBCol,
  MDBRow,
} from 'mdb-react-ui-kit';
import { useContext } from 'react';
import UserContext from '../Contexts/UserContext';
import { db } from '../firebase-config';

const a=function Component() {

  const { user, setUser } = useContext(UserContext);
  const auth = getAuth();

  if (user === undefined || user.uid === undefined) {
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
    <MDBRipple rippleTag='div' className='bg-image hover-overlay hover-zoom hover-shadow'>
      <img src={ require('../b.png') } className='w-100' />
      <a href='#!'>
        <div className='mask' style={{ backgroundColor: 'rgba(251, 251, 251, 0.2)' }}></div>
      </a>
    </MDBRipple>
  <MDBContainer fluid breakpoint="lg">
  <MDBTypography tag='div' className='display-4 pb-3 mb-3 border-bottom fw-bold text-purple-500'>
  LETS INVEST IN OURSELVES AND PLANET EARTH BY CHOOSING <mark className="bg-success p-2 text-dark bg-opacity-50">SUSTAINABLE GOODS</mark>
      </MDBTypography></MDBContainer>
      <br></br>
      <br></br>
      <MDBTypography variant='h1'>Our Blogs</MDBTypography>
      
    


    <MDBRow>
      <MDBCol lg={4} md={12} className='mb-4 mb-lg-0'>
        <img
          src='https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(73).webp'
          className='w-100 shadow-1-strong rounded mb-4'
          alt='Boat on Calm Water'
        />

        <img
          src='https://mdbcdn.b-cdn.net/img/Photos/Vertical/mountain1.webp'
          className='w-100 shadow-1-strong rounded mb-4'
          alt='Wintry Mountain Landscape'
        />
      </MDBCol>

      <MDBCol lg={4} className='mb-4 mb-lg-0'>
        <img
          src='https://mdbcdn.b-cdn.net/img/Photos/Vertical/mountain2.webp'
          className='w-100 shadow-1-strong rounded mb-4'
          alt='Mountains in the Clouds'
        />

        <img
          src='https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(73).webp'
          className='w-100 shadow-1-strong rounded mb-4'
          alt='Boat on Calm Water'
        />
      </MDBCol>

      <MDBCol lg={4} className='mb-4 mb-lg-0'>
        <img
          src='https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(18).webp'
          className='w-100 shadow-1-strong rounded mb-4'
          alt='Waves at Sea'
        />

        <img
          src='https://mdbcdn.b-cdn.net/img/Photos/Vertical/mountain3.webp'
          className='w-100 shadow-1-strong rounded mb-4'
          alt='Yosemite National Park'
        />
      </MDBCol>
    </MDBRow>
 
      
  </>
  );
}

export default a;
