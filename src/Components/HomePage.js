import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { MDBRipple ,MDBContainer, MDBTypography, MDBCard,MDBCardImage, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn} from 'mdb-react-ui-kit';
import {
  MDBCol,
  MDBRow,
} from 'mdb-react-ui-kit';
import { useContext } from 'react';
import UserContext from '../Contexts/UserContext';
import { db } from '../firebase-config';
import Navigationbar from './Navigationbar';


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
          console.log(data.data())
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
<div>
  <MDBContainer fluid breakpoint="lg" >
  <MDBTypography tag='div' className='display-4 pb-3 mb-3 border-bottom fw-bold text-purple-500 '>
 <h1><b>LETS INVEST IN OURSELVES AND PLANET EARTH BY CHOOSING 
  <br></br><mark className="bg-success d-inline-block p-2 text-dark bg-opacity-50">SUSTAINABLE GOODS</mark></b></h1>
  </MDBTypography></MDBContainer>
</div>

    
      <MDBContainer >
      <div class="d-flex align-items-center">
  <div class="flex-shrink-0">
   
  </div>
  <div class="flex-grow-1 ms-3 mt-5 lh-lg fst-italic  mb-5">
  <MDBTypography variant='h1'>WHO WE ARE?</MDBTypography>
<b> A platform where users can share their daily life examples of how they have used Jugaad.
  Aside from writing blogs, consumers can sell there product on our platform. Our country, India, is very popular for being “JUGAADU”, and finding easy and quick ways 
  in minimum time and bare resources. This provides a lot of useful content to its users and 
  can establish a sense of innovation and creativity among its users which is a very need of the hour.</b>
   
  </div>
</div>

</MDBContainer >


      <MDBTypography variant='h1' className='mt-4'>Our Products</MDBTypography>
      
      <MDBContainer className='mt-3 mb-5 ' >
      <MDBRow >
        <MDBCol lg='4' md='12' className='mb-4 bg-image hover-zoom  '>
        <MDBCardImage
                        src={
                          require("../bulb.jpg")
                        }
                        fluid
                        className="w-100 img-fluid shadow-2-strong rounded-4"
                        style={{ height: "350px" }}
                      />
          {/* <img
            src={ require('../bulb.jpg') }
            className='img-fluid shadow-2-strong rounded-4 '
            alt=''
            sizes='((min-width: 10em) and (max-width: 20em)) 10em,
            ((min-width: 30em) and (max-width: 40em)) 30em,
             (min-width: 40em) 40em'
          /> */}
        </MDBCol>

        <MDBCol lg='4' md='6' className='mb-4 bg-image hover-zoom'>
        <MDBCardImage
                        src={
                          require("../chair.jpg")
                        }
                        fluid
                        className="w-100 img-fluid shadow-2-strong rounded-4"
                        style={{ height: "350px" }}
                      />
          {/* <img
            src={ require('../chair.jpg') }
            className='img-fluid shadow-2-strong rounded-4'
            alt=''
          /> */}
        </MDBCol>

        <MDBCol lg='4' md='6' className='mb-4 bg-image hover-zoom'>
        <MDBCardImage
                        src={
                          require("../pot.jpg")
                        }
                        fluid
                        className="w-100 img-fluid shadow-2-strong rounded-4"
                        style={{ height: "350px" }}
                      />
          {/* <img
            src={ require('../pot.jpg') }
            className='img-fluid shadow-2-strong rounded-4'
            alt=''
          /> */}
        </MDBCol>
      </MDBRow>

      <MDBRow>
        <MDBCol lg='4' md='12' className='mb-4 bg-image hover-zoom'>
        <MDBCardImage
                        src={
                          require("../pots.jpg")
                        }
                        fluid
                        className="w-100 img-fluid shadow-2-strong rounded-4"
                        style={{ height: "350px" }}
                      />
          {/* <img
            src={ require('../pots.jpg') }
            className='img-fluid shadow-2-strong rounded-4'
            alt=''
          /> */}
        </MDBCol>

        <MDBCol lg='4' md='6' className='mb-4 bg-image hover-zoom'>
        <MDBCardImage
                        src={
                          require("../bottle.jpg")
                        }
                        fluid
                        className="w-100 img-fluid shadow-2-strong rounded-4"
                        style={{ height: "350px" }}
                      />
          {/* <img
            src={ require('../bottle.jpg') }
            className='img-fluid shadow-2-strong rounded-4'
            alt=''
          /> */}
        </MDBCol>

        <MDBCol lg='4' md='6' className='mb-4 bg-image hover-zoom'>
        <MDBCardImage
                        src={
                          require("../tyre.jpg")
                        }
                        fluid
                        className="w-100 img-fluid shadow-2-strong rounded-4"
                        style={{ height: "350px" }}
                      />
          {/* <img
            src={ require('../tyre.jpg') }
            className='img-fluid shadow-2-strong rounded-4'
            alt=''
          /> */}
        </MDBCol>
      </MDBRow>
    </MDBContainer>
<br>
</br>
<br>
</br>
<br></br>
  </>
  );
}

export default a;
