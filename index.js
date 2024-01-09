const express=require('express');
const app=express();
const cors=require('cors');
require("dotenv").config();

app.use(cors( 
    {
        origin: "http://localhost:3000"
    }
));
app.use(express.json());
app.get('/',(req,res)=>{
    res.send("Hello World! ");
});
const Stripe=require('stripe');
const stripe=Stripe(process.env.STRIPE_PRIVATE_VALUE)
app.post('/create-checkout-session',async(req,res)=>{
  try{
    const session =await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        mode:"payment",
        line_items: req.body.items.map(item =>{
            return{
                price_data:{
                    currency:"inr",
                    product_data:{
                        name: item.name,
                    },
                    unit_amount:item.price*100
                },
                quantity:item.quantity
            }
        }),
        success_url:`http://localhost:3000/Success`,
        cancel_url:`http://localhost:3000/Cancelled`
    })
    res.json({url: session.url})
  } 
  catch(e){
    res.status(500).json({error:e.message})
  }  
})

app.listen(5000,()=>{
    console.log("Server is running at http://localhost:5000");
});