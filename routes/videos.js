import express from "express";
import supabase from "../config/supabase.js";
import authMiddleware from "../middleware/authMiddleware.js";


const router = express.Router();




// GET PRIVATE VIDEOS

router.get("/", authMiddleware, async(req,res)=>{


    try{


        const {data,error} = await supabase

        .from("videos")

        .select("*")

        .order(
            "created_at",
            {
                ascending:false
            }
        );





        if(error){

            return res.status(500).json({

                message:error.message

            });

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