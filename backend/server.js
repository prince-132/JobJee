import app from './app.js'
import cloudinary from "cloudinary" 

const PORT = process.env.PORT || 4000
cloudinary.v2.config({
    cloude_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET
})

app.get('/', (req,res)=> res.send("Hello"))

app.listen(PORT, ()=>{
    console.log(`Server is running on PORT ${PORT}`);
})