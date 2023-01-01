import React from 'react'
import loading from '../loading-gif.gif'

function Spinner() {
  return (
    <div>
      <img src={loading} alt="Loading" style={{height:"50px", width:"50px", margin:"20px"}}/>
    </div>
  )
}

export default Spinner
