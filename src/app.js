const express = require('express');
const Student = require('./models/Student');


const app = express();

// middleware 
app.use(express.json());

// Routes
// app.use(express.urlencoded());
// const bodyParser = require("body-parser");
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())


// Get all the students
app.get('/students', async (req, res) => {
    const students = await Student.find()
    if (!students) return statusCode(404)
    res.send(students)
})

// Add student to database
app.post('/students', async (req, res) => {
    const student = new Student({
        name: req.body.name,
        sex: req.body.sex,
        class: req.body.class,
        age: req.body.age,
        grade_point: req.body.grade_point,
        isDeleted: req.body.isDeleted
    })
    const result = await student.save()
    res.send(result)
})

// Get specific student
app.get('/students/:id', async (req, res) => {
    const student = await Student.findById(req.params.id)
    if (!student || student.isDeleted) return statusCode(404)
    res.send(student)
})

// delete specific student
app.delete('/students/:id?type=soft||hard', async (req, res) => {
    console.log(req.query.type);
    if (req.query.type == "soft") {
        const student = await Student.findById(req.params.id)
        if (student.isDeleted) {return res.send(404)}
        else{
        student.isDeleted = true
        await student.save()
        res.send(200)
        }
    }
    if (req.query.type == "hard") {
        await Student.deleteOne({ _id: req.params.id })
        res.sendStatus(200)
    }
})

app.delete('/students/:id?type=soft||hard', async (req, res) => {
    if (req.query.type == "hard") {
        await Student.deleteOne({ _id: req.params.id })
        res.send(200)
    }
})



module.exports = app;
