import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "../config/supabase.js";


const router = express.Router();





// REGISTER USER

router.post("/register", async (req,res)=>{


    try{


        const {
            name,
            email,
            password
        } = req.body;



        if(!name || !email || !password){

            return res.status(400).json({

                message:"All fields are required"

            });

        }





        // Check existing user

        const {data:existingUser} = await supabase

        .from("users")

        .select("*")

        .eq("email",email)

        .single();





        if(existingUser){

            return res.status(400).json({

                message:"User already exists"

            });

        }






        // Hash password

        const hashedPassword =
        await bcrypt.hash(password,10);







        const {data,error} =
        await supabase

        .from("users")

        .insert([{

            name:name,

            email:email,

            password_hash:hashedPassword,

            role:"user"

        }])

        .select();





        if(error){

            return res.status(500).json(error);

        }





        res.json({

            message:"Account created successfully",

            user:data[0]

        });



    }

    catch(error){


        res.status(500).json({

            message:error.message

        });


    }



});









// LOGIN USER


router.post("/login", async(req,res)=>{


try{


const {

email,

password


}=req.body;






const {data:user,error}=

await supabase

.from("users")

.select("*")

.eq("email",email)

.single();







if(error || !user){


return res.status(400).json({

message:"Invalid email or password"

});


}







const validPassword =

await bcrypt.compare(

password,

user.password_hash

);






if(!validPassword){


return res.status(400).json({

message:"Invalid email or password"

});


}







const token = jwt.sign(

{

id:user.id,

email:user.email,

role:user.role

},

process.env.JWT_SECRET,

{

expiresIn:"7d"

}

);







res.json({

message:"Login successful",

token:token,

user:user

});






}


catch(error){


res.status(500).json({

message:error.message

});


}



});





export default router;