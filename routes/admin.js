import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import supabase from "../config/supabase.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();





// ADMIN LOGIN

router.post("/login", async(req,res)=>{


    try{


        const {
            email,
            password
        } = req.body;



        const {data:admin,error} = await supabase

        .from("users")

        .select("*")

        .eq("email",email)

        .eq("role","admin")

        .single();





        if(error || !admin){

            return res.status(400).json({

                message:"Admin not found"

            });

        }





        const validPassword =

        await bcrypt.compare(

            password,

            admin.password_hash

        );






        if(!validPassword){

            return res.status(400).json({

                message:"Wrong password"

            });

        }







        const token = jwt.sign(

        {

            id:admin.id,

            email:admin.email,

            role:admin.role

        },

        process.env.JWT_SECRET,

        {

            expiresIn:"7d"

        }

        );







        res.json({

            message:"Admin login successful",

            token

        });



    }


    catch(error){


        res.status(500).json({

            message:error.message

        });


    }


});









// ADD VIDEO


router.post(
"/videos",
authMiddleware,
async(req,res)=>{


try{


// Check admin role

if(req.user.role !== "admin"){


return res.status(403).json({

message:"Admin access required"

});


}






const {

title,

youtube_url


}=req.body;






const {data,error}=

await supabase

.from("videos")

.insert([{

title,

youtube_url

}])

.select();







if(error){

return res.status(500).json(error);

}





res.json({

message:"Video added",

video:data[0]

});




}



catch(error){


res.status(500).json({

message:error.message

});


}



});









// GET ALL USERS


router.get(
"/users",
authMiddleware,
async(req,res)=>{


try{


if(req.user.role !== "admin"){


return res.status(403).json({

message:"Admin only"

});


}






const {data,error}=

await supabase

.from("users")

.select(

"id,name,email,role,created_at"

);







if(error){

return res.status(500).json(error);

}




res.json(data);




}



catch(error){


res.status(500).json({

message:error.message

});


}



});









// GET ALL VIDEOS FOR ADMIN


router.get(
"/videos",
authMiddleware,
async(req,res)=>{


try{


const {data,error}=

await supabase

.from("videos")

.select("*")

.order(

"created_at",

{

ascending:false

}

);






if(error){

return res.status(500).json(error);

}





res.json(data);



}


catch(error){


res.status(500).json({

message:error.message

});


}


});





export default router;