
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken')
require('dotenv').config()
const uri = process.env.DB_USER
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const database = client.db('doctors_server')
const appointmentCollection = database.collection('slots')
const bookingCollection = database.collection('booking')
const usersCollection = database.collection('users')
const doctorsCollection = database.collection('doctors')


//get single booking user
const getSingleBookink = async (req, res) => {
    try {
        const id = req.params.id
        const query = { _id: ObjectId(id) }
        const result = await bookingCollection.findOne(query)

        res.send({
            status: true,
            message: 'booking user got',
            data: result
        })

    } catch (error) {
        return res.send({
            status: false,
            message: error.message
        })
    }
}
//add price
const addPrice = async (req, res) => {
    try {

        const query = {}
        const updata = {
            $set: {
                price: 1200
            },
        }
        const options = { upsert: true };
        const result = await bookingCollection.updateMany(query, updata, options)
        res.send(result)

    } catch (error) {
        return res.send({
            status: false,
            message: error.message
        })
    }
}


//login user controlar
const loginUser = async (req, res) => {
    try {
        const email = req.body.email
        // const query = { email: email }
        const result = await usersCollection.findOne({ email: email })
        const token = jwt.sign(result, process.env.ACCESS_TOKEN, { expiresIn: '2h' })

        if (token) {
            return res.send({ token, ...result })
        }

    } catch (error) {
        return res.send({
            status: false,
            message: error.message
        })
    }
}

//verify token
const verifyToken = async (req, res, next) => {
    try {

        const token = req.headers['authentication']

        if (typeof token !== 'undefined') {
            const validToken = jwt.verify(token, process.env.ACCESS_TOKEN)

            if (validToken) {
                res.send(validToken)
                console.log(validToken);
                next()
            } else {
                console.log('token not valid...');
            }
        } else {
            return res.status(401).send({
                status: false,
                message: 'token not valid'
            })
        }

    } catch (error) {
        return res.status(401).send({
            status: false,
            message: error.message
        })
    }
}
//get all time slots
const getAllTimeSlot = async (req, res) => {
    try {
        const date = req.query.date
        const options = await appointmentCollection.find({}).toArray()

        const bookingQuery = { month: date }
        const alradyBooked = await bookingCollection.find(bookingQuery).toArray()

        options.forEach(option => {
            const optionBooked = alradyBooked.filter(book => book.treatment === option.name)
            const bookSlots = optionBooked.map(book => book.hours)
            const remainingSlots = option.slots.filter(slot => !bookSlots.includes(slot))
            option.slots = remainingSlots
        })


        if (options) {
            res.send({
                status: true,
                message: 'Time slots is exist',
                data: options
            })
        }
    } catch (error) {
        res.send(error.message)
    }
}

//get all doctors
const getAllDoctor = async (req, res) => {
    try {
        const doctors = await doctorsCollection.find({}).toArray()
        return res.send({
            status: true,
            message: "user get successfull",
            data: doctors
        })

    } catch (error) {
        return res.send({
            status: false,
            message: error.message,

        })
    }
}

// time slots bookings
const bookingTimeSlots = async (req, res) => {
    try {
        const booking = req.body
        const result = await bookingCollection.insertOne(booking)
        // const query = {
        //     month: booking.month,
        //     email: booking.email
        // }

        // const alradyBooked = await bookingCollection.find(query).toArray()

        // if (alradyBooked.length) {
        //     const message = 'You alrady booked'
        //     return res.send({ acknowledged: false, message })
        // }

        res.send({
            status: true,
            message: "booking successfull",
            data: result
        })

    } catch (error) {
        res.send({
            status: false,
            message: 'bookings dose not exist'
        })
    }
}

//add doctors
const doctorsControlar = async (req, res) => {
    try {
        const doctor = req.body;
        const result = await doctorsCollection.insertOne(doctor)

        res.send({
            status: true,
            message: 'doctor added',
            data: result
        })

    } catch (error) {
        return res.send({
            status: false,
            message: error.message,

        })
    }
}

//get booking user list
const getAllBookings = async (req, res) => {
    try {
        const email = req.query.email;
        const query = { email: email }
        const booking = await bookingCollection.find(query).toArray()

        res.send({
            status: true,
            message: "User booking exist success",
            data: booking
        })

    } catch (error) {
        res.send({
            status: false,
            message: 'User bookink dose not exist'
        })
    }
}


//get doctor specialty
const appointmentSpeacialty = async (req, res) => {
    try {
        const query = {}
        const cursor = await appointmentCollection.find(query).project({ name: 1 }).toArray()

        if (cursor) {
            return res.send({
                status: true,
                message: 'Doctor catagory specialty exist',
                data: cursor
            })
        }

    } catch (error) {
        res.send({
            status: false,
            message: 'Doctor catagory specialty dose not exist'
        })
    }
}

//save user with emal & pasword
const saveUser = async (req, res) => {
    try {
        const user = req.body
        const users = await usersCollection.insertOne(user)

        if (data.acknowledged) {
            res.send({
                status: true,
                message: 'User created successfully',
                data: users
            })
        }

    } catch (error) {
        res.send({
            status: false,
            message: 'User dose not created'
        })
    }
}

//jwt contoral
// const jwtControlar = async (req, res) => {
//     try {
//         const email = req.query.email;
//         const query = { email: email }
//         const user = await usersCollection.findOne(query)

//         if (user) {
//             const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '1h' })

//             return res.send({
//                 status: true,
//                 message: "token generated",
//                 token
//             })
//         }

//         return res.status(403).send({ ACCESS_TOKEN: '' })


//     } catch (error) {
//         res.send({
//             status: false,
//             message: 'Authentication failed'
//         })
//     }
// }

//delete doctor
const deletDoctor = async (req, res) => {
    try {
        const id = req.params.id
        const query = { _id: ObjectId(id) }

        const cursor = await doctorsCollection.deleteOne(query)

        res.send({
            status: true,
            message: 'doctor deleted',
            data: cursor
        })

    } catch (error) {
        res.send({
            status: false,
            message: error.message
        })
    }
}


module.exports = { getAllTimeSlot, bookingTimeSlots, getAllBookings, saveUser, appointmentSpeacialty, doctorsControlar, getAllDoctor, deletDoctor, verifyToken, loginUser, addPrice, getSingleBookink }