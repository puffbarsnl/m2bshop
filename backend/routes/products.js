const { Product } = require("../models/Product");
const { auth, isUser, isAdmin } = require("../middleware/auth");
const cloudinary = require("../utils/cloudinary");
const { Review } = require("../models/Review");

const router = require("express").Router();

//CREATE

router.post("/", isAdmin, async (req, res) => {
  const { name, brand, desc, price, oldPrice, stock, soldOut, sale, image } = req.body;

  try {
    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        upload_preset: "ml_default",
      });

      if (uploadedResponse) {
        const product = new Product({
          name,
          brand,
          desc,
          price,
          oldPrice,
          stock,
          soldOut,
          sale,
          image: uploadedResponse,
        });

        const savedProduct = await product.save();
        res.status(200).send(savedProduct);
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

//DELETE

router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).send("Product not found...");

    if (product.image.public_id) {
      const destroyResponse = await cloudinary.uploader.destroy(
        product.image.public_id
      );

      if (destroyResponse) {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        res.status(200).send(deletedProduct);
      }
    } else {
      console.log("Action terminated. Failed to delete product image...");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// EDIT PRODUCT

router.put("/:id", isAdmin, async (req, res) => {
  if (req.body.productImg) {
    const destroyResponse = await cloudinary.uploader.destroy(
      req.body.product.image.public_id
    );

    if (destroyResponse) {
      const uploadedResponse = await cloudinary.uploader.upload(
        req.body.productImg,
        {
          upload_preset: "ml_default",
        }
      );

      if (uploadedResponse) {
        const updatedProduct = await Product.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              ...req.body.product,
              image: uploadedResponse,
            },
          },
          { new: true }
        );

        res.status(200).send(updatedProduct);
      }
    }
  } else {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body.product,
        },
        { new: true }
      );
      res.status(200).send(updatedProduct);
    } catch (err) {
      res.status(500).send(err);
    }
  }
});

//GET ALL PRODUCTS

router.get("/", async (req, res) => {
  const qbrand = req.query.brand;
  try {
    let products;

    if (qbrand) {
      products = await Product.find({
        brand: qbrand,
      }).sort({ _id: -1 });
    } else {
      products = await Product.find().sort({ _id: -1 });
    }

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

//GET PRODUCT

router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});


// CREATE REVIEW
router.post('/review/:id', async (req, res) => {
  const {name, email, stars, title, message} = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).send("Product not found...");

    else {
      const review = new Review({
        productId: req.params.id,
        name: name,
        email: email,
        stars: stars,
        title: title,
        message: message,
      });

      const savedProduct = await review.save();
      res.status(200).send(savedProduct);
    }

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }

});

// GET REVIEWS FOR PRODUCT
router.get('/review/:id', async (req, res) => {
  try {
    const reviews = await Review.find({productId: req.params.id});

    res.send(reviews);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
})

router.get('/review/:id/average', async (req, res) => {
  try {
    const reviews = await Review.find({productId: req.params.id});

    if(reviews[0]) {
      res.status(200).json({average: reviews.reduce((n, {stars}) => n + stars / reviews.length, 0), count: reviews.length})
    } else {
      res.json({average: 0, count: 0})
    }

  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
})

// DELETE REVIEW
router.delete("/review/:id", isAdmin, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404).send("Review not found...") 
    } else {
      const deletedReview = await Review.findByIdAndDelete(req.params.id);
      res.status(200).send(deletedReview);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET ALL REVIEWS
router.get('/reviews', isAdmin, async (req, res) => {
  try {
    const reviews = await Review.find({});
    res.status(200).send(reviews);
  } catch (error) {
    
  }
})

// GET REVIEW COUNT
router.get('/reviews/count', isAdmin, async (req, res) => {
  try {
    const reviews = await Review.count({}, function(err, count) {
      res.json(count);
    })
  } catch (error) {
  }
})


module.exports = router;
