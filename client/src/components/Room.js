import React ,{useState} from 'react'
import {Modal,Button,Carousel} from 'react-bootstrap'
import { Link } from 'react-router-dom';

function Room({room ,fromDate , toDate}) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
  return (
    <div className='row bs '>
        <div className='com-md-4'>
            <img src={room.imageurls[0]} className='smallimg'/>
        </div>
        <div className='com-md-7'>
          <b>
             <h1>{room.name}</h1>
            <p>Max count: {room.maxcount}</p>
            <p>PhoneNumber: {room.phonenumber}</p>
            <p>Type: {room.type}</p>
            </b>
            <div style={{float:'right'}}>

              {(fromDate && toDate)&& (
                <Link to={`/book/${room._id}/${fromDate}/${toDate}`}>
 <button className='btn btn-primary m-2'>Book Now</button>
 </Link>  
              )}
      
                <button className='btn btn-primary ' onClick={handleShow}>View details</button>
            </div>
        </div>
       

      <Modal show={show} onHide={handleClose} size='lg'>
        <Modal.Header>
          <Modal.Title>{room.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Carousel>
            
      {room.imageurls.map(url=>{
return <Carousel.Item>
<img
className="d-block w-100 bigimg"
src={url}
/>

</Carousel.Item>
      })}
      
    </Carousel>
    <p>{room.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
         
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Room