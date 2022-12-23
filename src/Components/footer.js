import React from "react";
import {
  MDBFooter,
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBIcon,
  MDBBtn
} from 'mdb-react-ui-kit';
import { SocialIcon } from 'react-social-icons';

 function FooterPart() {
    
  return (
    
    <MDBFooter className='bg-secondary text-center text-white'>
      <MDBContainer className='p-4 pb-0'>
        <section className='mb-4'>
        <SocialIcon url="https://facebook.com/" className="m-3"/>
        <SocialIcon network="twitter" className="m-3"></SocialIcon>
        <SocialIcon network="github" className="m-3"></SocialIcon>
        <SocialIcon network="google" className="m-3"></SocialIcon>
        <SocialIcon url="https://linkedin.com/in/" className="m-3"/>

        </section>
      </MDBContainer>

      <div className='text-center p-3' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}>
        © 2020 Copyright:
        <a className='text-white' href='https://mdbootstrap.com/'>
          MDBootstrap.com
        </a>
      </div>
    </MDBFooter>
  );
}
export default FooterPart;