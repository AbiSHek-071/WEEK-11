const bcrypt = require("bcrypt");
const product = require("../../Models/product");
const Category = require("../../Models/category");



async function fetchProducts(req, res) {
  try {
    const { category, sleeve, size, search, sortBy } = req.query;
    console.log(sortBy);
    
   
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    

    //filtering based on category
    const filterQueries = {isActive:true}
    if(category){
      const categories = await Category.find({
        name: { $in: category.split(",") },
      }).lean()

      const categoryIds = categories.map((cat) => cat._id);
      filterQueries["category"] = { $in: categoryIds }; 
    }

    //filtering based on sleeve
    if(sleeve){
      filterQueries.sleeve = {$in:sleeve.split(",")}
    }

    //filtering based on size
    if(size){
      filterQueries["sizes"] = {
        $elemMatch: {
          size: {
            $in: size.split(',')
          },
          stock : {$gt : 0}
        }
      };
    }   


    //include search to filter queries 
    if(search){
      filterQueries["$or"] = [
        { name: { $regex: search, $options: "i" } },
        { description :{$regex:search,$options:"i"}},
        {sleeve:{$regex:search,$options:"i"}},
      ];
    }

    //sorting 
    const sort = {};
    if(sortBy == "newest"){
      sort["createdAt"] = -1;
    }else if(sortBy == "price-low-to-high"){
      sort["price"] = 1;
    }else if(sortBy == "price-high-to-low"){
      sort["price"] = -1;
    }else if(sortBy == "name-a-to-z"){
      sort["name"] = 1;
    }else if(sortBy == "name-z-to-a"){
      sort["name"] = -1
    }
    

    const productData = await product
      .find(filterQueries)
      .populate({
        path: "category",
        match: { isActive: true },
        select: "name",
      })
      .sort(sort)
      .skip(skip)
      .limit(limit);
 

    const totalProduct = await product.countDocuments(filterQueries);

    

    if (!productData) {
      return res
        .status(404)
        .json({ message: "Unable to fetch Image", success: false });
    }
    return res.status(200).json({
      message: "products fetched successfully",
      success: true,
      productData,
      currentPage: page,
      totalPages: Math.ceil(totalProduct / limit),
      totalProduct,
    });
  } catch (err) {
    console.log(err);
  }
}
async function fetchproduct(req, res) {
  try {
    const { id } = req.body;
    const productData = await product.findById({ _id: id }).populate({
      path: "category",
      match: { isActive: true },
      select: "name",
    });

    if (!productData) {
      return res
        .status(404)
        .json({ success: true, message: "Unable to Find the Product," });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Product Fetched",
        product: productData,
      });
  } catch (err) {
    console.log(err);
  }
}


async function fetchRelatedProducts(req, res) {
  try {
    const { categoryId } = req.body;
    const productData = await product
      .find({ category: categoryId, isActive: true })
      .populate({
        path: "category",
        match: { isActive: true },
        select: "name",
      });
    const filteredProductData = productData.filter(
      (prod) => prod.category !== null
    );

    if (!productData) {
      return res
        .status(404)
        .json({ message: "Unable to fetch Image", success: false });
    }
    return res.status(200).json({
      message: "products fetched successfully",
      success: true,
      productData: filteredProductData,
    });
  } catch (err) {
    console.log(err);
  }
}
module.exports = {
  fetchproduct,
  fetchProducts,
  fetchRelatedProducts,
};
