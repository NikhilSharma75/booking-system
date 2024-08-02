import React, { useEffect, useState } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from '../components/Error';
import { DatePicker } from 'antd';
import moment from "moment";

const { RangePicker } = DatePicker;

function Homescreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fromDate, setfromDate] = useState(null);
  const [toDate, settoDate] = useState(null);
const[duplicaterooms , setduplicaterooms] = useState([])

const[searchkey , setsearchkey] = useState('')
const[type , settype]= useState('all')
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = (await axios.get("/api/rooms/getallrooms")).data;
        setRooms(data);
        setduplicaterooms(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function filterByDate(dates) {
    if (dates && dates.length === 2) {
      const fromDate = dates[0].format("DD-MM-YYYY");
      const toDate = dates[1].format("DD-MM-YYYY");

      // Filter rooms based on selected date range
      const filteredRooms = duplicaterooms.filter((room) => {
        let isAvailable = true;
        for (const booking of room.currentbookings) {
          const bookingfromDate = booking.fromDate;
          const bookingtoDate = booking.toDate;

          // Check if selected range overlaps with any existing booking
          if (
            moment(fromDate, "DD-MM-YYYY").isBetween(
              bookingfromDate,
              bookingtoDate,
              null,
              "[]"
            ) ||
            moment(toDate, "DD-MM-YYYY").isBetween(
              bookingfromDate,
              bookingtoDate,
              null,
              "[]"
            ) ||
            moment(bookingfromDate, "DD-MM-YYYY").isBetween(
              fromDate,
              toDate,
              null,
              "[]"
            ) ||
            moment(bookingtoDate, "DD-MM-YYYY").isBetween(
              fromDate,
              toDate,
              null,
              "[]"
            )
          ) {
            isAvailable = false;
            break;
          }
        }
        return isAvailable;
      });
       // Update state with filtered rooms and selected dates
       setRooms(filteredRooms);
       setfromDate(fromDate);
       settoDate(toDate);
     } else {
       // Handle case where dates are not properly selected
       setRooms(duplicaterooms); // Reset to original list if no valid dates
       setfromDate(null);
       settoDate(null);
    }
  }
  function filterBySearch(){
const temprooms = duplicaterooms.filter(room=>room.name.toLowerCase().includes(searchkey.toLowerCase()))
setRooms(temprooms);
  }
  function filterBytype(e){
    settype(e)
    if(e!=='all'){
    const temprooms = duplicaterooms.filter(room =>room.type.toLowerCase()==e.toLowerCase())
    setRooms(temprooms);
    }
    else{
      setRooms(duplicaterooms)
    }
  }
  return (
    <div className="container">
      <div className="row mt-5 bs">
        <div className="col-md-3">
          <RangePicker format='DD-MM-YYYY' onChange={filterByDate} />
        </div>
        <div className="col md-5">
          <input type="text" className="form-control" placeholder="Search rooms"
          value={searchkey} onChange={(e)=>{setsearchkey(e.target.value)}} onKeyUp ={filterBySearch}
          />
        </div>
       <div className="col -md-3" >
       <select className="form-control" value={type} onChange={(e)=>{filterBytype(e.target.value)}} >
          <option value="all">all</option>
          <option value="Business">Business</option>
          <option value="Deluxe">Deluxe</option>
          <option value="Executive">Executive</option>
          <option value="Suite">Suite</option>
          <option value="Standard">Standard</option>
          <option value="Premium">Premium</option>
        </select>
       </div>
      </div>
      <div className="row justify-content-center mt-5">
        {loading ? (
          <h1>
            <Loader />
          </h1>
        ) : (
          rooms.map((room) => {
            return(
            <div key={room._id} className="col-md-9 mt-2">
              <Room room={room} fromDate={fromDate} toDate={toDate} />
            </div>
          );
})
         )}
      </div>
    </div>
  );
}

export default Homescreen;

