import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Error from '../components/Error';
import moment from 'moment';
import StripeCheckout from 'react-stripe-checkout';
import swal from "sweetalert2";

function Bookingscreen() {
    const { roomid ,fromDate,toDate} = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [room, setRoom] = useState();
   
   
    useEffect(() => {
        if(!localStorage.getItem('currentUser')){
            window.location.reload='/login'
        }
        const fetchRoom = async () => {
            try {
                setLoading(true);
                const { data } = await axios.post("/api/rooms/getroombyid", { roomid });
                setRoom(data);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setError(true);
            }
        };

        fetchRoom();
    }, [roomid]);
    if (loading){
        return <h1><Loader/></h1>
    }
    if(error)
    {
        return <h2><Error/></h2>
    }
    const fromDateFormatted = moment(fromDate, "DD-MM-YYYY").format('DD-MM-YYYY');
    const toDateFormatted = moment(toDate, "DD-MM-YYYY").format('DD-MM-YYYY');
   const totalDays = moment(toDate,"DD-MM-YYYY").diff(moment(fromDate,"DD-MM-YYYY"),'days');
   const totalAmount = totalDays * room?.rentperday

  async  function onToken(token){
        console.log(token)
        try {
        const bookingDetails ={
            room ,
            userid: JSON.parse(localStorage.getItem('currentUser'))._id,
            fromDate:fromDateFormatted,
            toDate:toDateFormatted,
            totalAmount,
            totalDays,
            token
        }
        
            setLoading(true);
            const result = await axios.post('/api/bookings/bookroom', bookingDetails );
            setLoading(false);
            swal.fire('Congratulations' , 'Your Room Booked Successfuly' , 'success').then(result=>{
                window.location.href='/profile'
            })
        } catch (error) { setLoading(false);
            swal.fire('Oops!', ' Something Went wrong', 'error')} 
       
    }

    return (
        <div className="m-5">
           {loading ?(<h1 className='text-center'><Loader/></h1>): room ? (<div>
            <div className="row justify content-center  mt-5 bs ">
              <div className ="col-md-6">
<h1>{room.name}</h1>
<img src ={room.imageurls[0]} className='bigimg'/>
              </div>
              
              <div className  ="col-md-6">
                <div>
                <h2>Booking Details</h2>
                <hr/>
                <b>
                <p>Name: {JSON.parse(localStorage.getItem('currentUser')).name}</p>
                <p>From Date: {fromDate}</p>
                <p>To Date: {toDate}</p>
                <p>Max Count: {room.maxcount}</p>
                </b>
              
              
               <b>
               <h2>Amount</h2>
                <hr/>
                <p>Total days: {totalDays}</p>
                <p>Rent per day: Rs {room.rentperday}</p>
                <p>Total Amount: Rs {totalAmount}</p>
               </b>
               </div>
            
            <div style={{float:"right"}}>
            

        <StripeCheckout
        amount={totalAmount * 100}
        token={onToken}
        currency='INR'
        stripeKey="pk_test_51Pgo0LK3VX2gDSK2iO3yW1c0mDDJrLH0Jyh0y1fE4hYl9Ezez0lYDwzTKs075kBL5z9AvXjxwU1n1lYeAGJ6wr1v00pw7W8V9Y"
        >
        <button className="btn btn-primary" >Pay Now{" "}</button>
        </StripeCheckout>
              </div>
              </div>
              </div>
           </div>
        ):(
        <Error/>
        )}
           
        </div>
    );
}

export default Bookingscreen;
