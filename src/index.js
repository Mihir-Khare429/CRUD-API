const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
require('./db/mongoose')
const userRoutes = require('./router/user');
const taskRoutes = require('./router/task');
//middleware

//For creating A Maintainence Break

// app.use((req,res,next) => {
//     res.status(503).json({
//         message : 'Site is Under Maintainence. Check Back Soon !'
//     })
// })
app.use(express.json());
app.use(userRoutes);
app.use(taskRoutes);
// app.use(bodyParser.json())



app.listen(port , () => {
    console.log('Serving at port ' + port)
})