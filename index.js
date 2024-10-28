const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

// const { incomingRequestLogger } = require("./middleware/index.js");
const userRoutes = require('./routes/user.js');
const indexRoute = require('./routes/index.js');
const taskRoutes = require('./routes/task.js');

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors({origin: true}));

// app.use(incomingRequestLogger);
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/user/task',taskRoutes);

app.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");
    mongoose.connect(process.env.MONGOOSE_URI_STRING);
    mongoose.connection.on("connected", () => {
        console.log("connected");
    });
    mongoose.connection.on("error", (err) => {
        console.log(err);
    });
});