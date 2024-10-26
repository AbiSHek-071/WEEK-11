const Cart = require("../../Models/Cart");
async function addToCart(req,res) {
    try {  
        const { userId, product } = req.body;
        const {productId,size,stock,price,salePrice,qty} = product;
        
        
        
        let cart = await Cart.findOne({userId});
        
        if(!cart){
            cart = new Cart({
              userId,
              items: [
                {productId,
                size,
                stock,
                price,
                salePrice,
                qty,
                totalProductPrice : salePrice*qty,
            },
              ],
            });
            await cart.save();
            return res.status(201).json({success:true,message:"Item added to cart"});
        }

        let existingItem = cart.items.findIndex((item,index)=>{
            return item.productId.toString() === productId.toString() && item.size === size; 
        })

        if(existingItem >= 0){            
            existingItem = cart.items[existingItem];
            existingItem.qty+=qty;
            existingItem.totalProductPrice = existingItem.salePrice * existingItem.qty;
            await cart.save();
            return res
              .status(200)
              .json({ success: true, message: "Item added to cart" });
        }else{
             cart.items.push({
               productId,
               size,
               stock,
               price,
               salePrice,
               qty,
               totalProductPrice: salePrice * qty,
             });
              await cart.save();
              return res
                .status(200)
                .json({ success: true, message: "Cart updated successfully!" });
        }
        
    } catch (err) {
        console.log(err);
        
    }
}

module.exports = {
    addToCart,
}