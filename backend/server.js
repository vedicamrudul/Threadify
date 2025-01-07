const express=require('express');
require('dotenv').config();
const authRoutes=require('./routes/auth.routes');
const connectDB=require('./db/connect');
// we have things like authentication, users, posts, notifications (this is a twitter clone buddy)

const app= express();
const PORT= process.env.PORT || 8000;

app.use('/api/auth', authRoutes); 

app.get('/', (req, res) => {
    res.send('Server is ready');
});


const port = process.env.PORT || 8000;

const start = async () => {
  try {
    // Connect to the database
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.error(error);
  }
};

start();
