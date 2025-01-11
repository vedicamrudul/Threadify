require('dotenv').config();
require('express-async-errors')

const authRoutes=require('./routes/auth.routes'); 
const userRoutes=require('./routes/user.routes');
const postRoutes=require('./routes/post.routes');
const notificationRoutes=require('./routes/notification.routes');

const {v2: cloudinary} = require('cloudinary');
const express=require('express');
const connectDB=require('./db/connect');
const cookieParser = require('cookie-parser');
// we have things like authentication, users, posts, notifications (this is a twitter clone buddy)

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const app= express();
const PORT= process.env.PORT || 8000;

app.use(express.json()); 
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/notifications', notificationRoutes)

app.get('/', (req, res) => {
    res.send('Server is ready');
});


const port = process.env.PORT || 8000;

const start = async () => {
  try {
    // Connect to the database
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.error(error);
  }
};

start();
