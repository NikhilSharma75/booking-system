const express = require('express');
const router = express.Router();
const Booking = require("../models/booking");
const Room = require("../models/room"); // Changed to 'Room' to avoid conflict
const stripe = require("stripe")("sk_test_51Pgo0LK3VX2gDSK22DOAZVHBvid3jpdcOSD9IaAEeT6RPHByt7ePr5wKh2TNglAaAY5jU96WOFiKKQm9CwNKXug800eXDgXbvI");
const { v4: uuidv4 } = require("uuid");
const moment = require('moment'); // Make sure to import moment

router.post("/bookroom", async (req, res) => {
    const {
        room, // Destructuring 'room' from req.body
        userid,
        fromDate,
        toDate,
        totalAmount,
        totalDays,
        token
    } = req.body;

    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        });

        const idempotencyKey = uuidv4(); // Correctly call uuidv4()
        const payment = await stripe.charges.create({
            amount: totalAmount * 100,
            customer: customer.id,
            currency: 'INR',
            receipt_email: token.email,
        }, {
            idempotencyKey
        });

        if (payment) {
            const newBooking = new Booking({
                room: room.name,
                roomid: room._id,
                userid,
                fromDate: moment(fromDate).format("DD-MM-YYYY"),
                toDate: moment(toDate).format("DD-MM-YYYY"),
                totalAmount,
                totalDays,
                transactionid: '1234'// Use the actual payment ID from Stripe
            });

            const booking = await newBooking.save();

            const roomTemp = await Room.findOne({ _id: room._id });
            roomTemp.currentbookings.push({
                bookingid: booking._id,
                fromDate,
                toDate,
                userid,
                status: booking.status
            });

            await roomTemp.save();

            res.send('Payment Successful, Your room has been booked');
        }
    } catch (error) {
        return res.status(400).json({ error: error.message }); // Provide specific error message
    }
});
router.post("/getbookingsbyuserid" , async(req,res) =>{
    const userid = req.body.userid

    try {
        const bookings =  await Booking.find({userid : userid})
        res.send(bookings)
    } catch (error) {
        return res.status(400).json({error});
    }

});

router.post('/cancelbooking', async (req, res) => {
    const { bookingid, roomid } = req.body;

    try {
        // Find and update the booking status to 'cancelled'
        const booking = await Booking.findById(bookingid);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        booking.status = 'cancelled';
        await booking.save();

        // Remove the booking from the room's current bookings
        const room = await Room.findById(roomid);
        if (room) {
            room.currentbookings = room.currentbookings.filter(b => b.bookingid.toString() !== bookingid);
            await room.save();
        }

        res.json({ message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/getallbookings", async(req,res)=>{
    try {
        const bookings = await Booking.find()
        res.send(bookings)
    } catch (error) {
        return res.status(400).json({error});
        
    }
})
module.exports = router;
