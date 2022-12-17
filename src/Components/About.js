import React from 'react';
import { MDBRipple } from 'mdb-react-ui-kit';


export default function About() {
  return (
    <>
    <MDBRipple className='bg-image ' rippleTag='div' rippleColor='light'>
      <img src='https://i.pinimg.com/564x/e6/8b/d3/e68bd3d55e6ed3817e9a3334214aafff.jpg' className='w-100' style={{width:'100%'}}/>
      <a href='#!'>
        <div className='mask' style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' , }}>
          <div className='d-flex justify-content-center align-items-center h-100'>
            <p className='text-white mb-0 fs-1'>Why Jugaad?</p>
          </div>
        </div>
        <div className='hover-overlay'>
          <div className='mask' style={{ backgroundColor: 'rgba(251, 251, 251, 0.2)' }}></div>
        </div>
      </a>
    </MDBRipple>
    <div class>
    <h5 class="card-title">Card title</h5>
    <p class="card-text">
      This is a wider card with supporting text below as a natural lead-in to additional
      content. This content is a little bit longer.
    </p>
    </div>

    </>
  )
}
