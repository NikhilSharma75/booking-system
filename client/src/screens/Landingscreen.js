import React from 'react'
import { Link } from 'react-router-dom'
function Landingscreen() {
  return (
    <div className='row landing justify-content-center'>
<div className='col-md-9 my-auto text-center' style={{borderRight:'5px solid white'}}>
    <h7 style={{color: 'white', fontSize:'130px'}}>Travel Rooms</h7>
    <h4 style={{color: 'white'}}>"Your Home Away from Home."</h4>
    <Link to="/home">
    <button className='btn landingbtn'style={{color:'black'}}>
        Get Started
    </button>
    </Link>
</div>
    </div>
  )
}

export default Landingscreen