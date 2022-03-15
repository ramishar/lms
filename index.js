const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const bodyparser = require("body-parser");
const path = require('path')
const cors = require("cors");

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.set('view engine','ejs');

dotenv.config({path:'config.env'})
const PORT = process.env.PORT || 3000

app.use(bodyparser.urlencoded({ extended : true}))

const dbURI = 'mongodb+srv://ramisha:bhgN295XC2muXaA1@cluster0.kutod.mongodb.net/LMS'; 
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true})
    .then((result) => app.listen(PORT))
    .catch((err) => console.log(err));

app.get('/', (req, res) => res.render('home'));
app.use(authRoutes);

