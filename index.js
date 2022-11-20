require('dotenv').config()
const jwt = require('jsonwebtoken')
const express = require("express")
const app = express()
const cors = require('cors')
const { getAllTimeSlot, bookingTimeSlots, getAllBookings, saveUser, appointmentSpeacialty, doctorsControlar, getAllDoctor, deletDoctor, loginUser, addPrice, getSingleBookink, verifyToken } = require('./controlar')
const port = process.env.PORT || 8000


app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))

const run = async () => {
    try {
        //get single booking user
        app.get('/booking/:id', getSingleBookink)
        //get booking price
        app.get('/price', addPrice)

        //get timer slots
        app.get('/appointment', getAllTimeSlot)

        //get booking user list
        app.get('/booking', getAllBookings)

        //get single catagory
        app.get('/appintmentSpecility', appointmentSpeacialty)

        //get all doctors
        app.get('/doctors', getAllDoctor)

        //save user with email & password
        app.post('/users', saveUser)


        //post booking time
        app.post('/bookings', bookingTimeSlots)

        //post doctors
        app.post('/doctors', verifyToken, doctorsControlar)

        //login user
        app.post('/login', loginUser)


        //delete doctor
        app.delete('/doctors/:id', deletDoctor)




    } catch (error) {
        console.log(error.message);
    }
}
run()

app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, (req, res) => {
    console.log('Server is running on port', port);
})