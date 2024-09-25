const { cloudUpload } = require("../utilities/cloudinary")
const path = require("path");
const PRODUCT = require("../Models/productModal");
const USER = require("../Models/userModel");
const { sendNotification } = require("./notification/sentNotification");

module.exports = {
    addProduct_test: async (req, res) => {
        try {
            let userDetails 
            const {
                title="nothing",
                description="nothing",
                featured=false,
                subcategory="650008a3e22c61453cbc9c00",
                nestedCat,
                keywords,
                category="650008a3e22c61453cbc9c00",
                userId="662b845fc95a3a35c4ab5680",
                price=12132,
                listedBy="Owner",
                locality="sada",
                district="dasd",
                state="asdas",
                region="dsad"
            } = req.body
            
            // const parsedDetails = JSON.parse(otherDetails);
            // const Upload = req.files.map((file) => {
            //     let locaFilePath = file.path;
            //     return (
            //         cloudUpload(locaFilePath, toString(title))
            //     )
            // })


            // for (const key in parsedDetails) {
            //     console.log(parsedDetails[key]);
            //     if (isNaN(parsedDetails[key])) {
            //         continue;
            //     } else {
            //         parsedDetails[key] = parseInt(parsedDetails[key])
            //     }
            // }



            // const results = await Promise.all(Upload);
            // if (results) {
                const productTemplate = new PRODUCT({
                    title: title,
                    description: description,
                    locality: locality,
                    district: district,
                    state: state,
                    region: region,
                    listedBy: listedBy,
                    keywords: keywords,
                    featured: featured,
                    // location:{
                    //     type:"Point",
                    //     coordinates:[Number(longitude),Number(latitude)]
                    // },
                    category: category,
                    SubCategory: subcategory,
                    nested:nestedCat,
                    // otherDetails: { ...parsedDetails },
                    // images: [...results],
                    userId: userId,
                    price: price,
                })
                const SavedData = await productTemplate.save()
                if (SavedData) {
                    console.log(userId);
                    USER.findOne({ _id: userId }).then((response) => {
                        console.log(response);
                        userDetails = response
                        if (response.AdCount <= 0) {
                            USER.updateOne({ _id: userId }, {
                                AdCount: 0
                            }).then(async (response) => {
                                console.log(SavedData.title,"heee")
                                // console.log(userDetails,"h,mmm");
                                await sendNotification({email:userDetails.email,subject:"Ad live right now",link:`https://www.dealnbuy.in/product/${SavedData._id}`,product:SavedData.title})
                                res.status(200).json({ message: 'ad posted successfully' })
                            }).catch((err) => {
                                res.status(400).json({ message: "problem with updating user", error: err })
                            })
                        } else {
                            USER.updateOne({ _id: userId }, {
                                $inc: { AdCount: -1 }
                            }).then(async(response) => {
                                console.log(SavedData.title,"heee")
                                await sendNotification({email:userDetails.email,subject:"Ad live right now",link:`https://www.dealnbuy.in/product/${SavedData._id}`,product:SavedData.title})
                                res.status(200).json({ message: 'ad posted successfully' })
                            })
                                .catch((err) => {
                                    res.status(400).json({ message: "problem with updating user", error: err })
                                })
                        }
                    })
                } else {
                    res.status(200).json({ message: 'add failed to post' })
                }
            // }
            //  else {
            //     res.status(400).json({ message: "something error with images" })
            // }
        } catch (error) {
            res.status(500).json({ message: "something went wrong", error: error.message })
        }
    },



    addProduct: async (req, res) => {
        try {
            let userDetails 
            const {
                title,
                description,
                otherDetails,
                featured,
                subcategory,
                nestedCat,
                keywords,
                category,
                userId,
                price,
                listedBy,
                locality,
                district,
                state,
                region
            } = req.body
            const parsedDetails = JSON.parse(otherDetails);
            const Upload = req.files.map((file) => {
                let locaFilePath = file.path;
                return (
                    cloudUpload(locaFilePath, toString(title))
                )
            })


            for (const key in parsedDetails) {
                console.log(parsedDetails[key]);
                if (isNaN(parsedDetails[key])) {
                    continue;
                } else {
                    parsedDetails[key] = parseInt(parsedDetails[key])
                }
            }



            const results = await Promise.all(Upload);
            if (results) {
                const productTemplate = new PRODUCT({
                    title: title,
                    description: description,
                    locality: locality,
                    district: district,
                    state: state,
                    region: region,
                    listedBy: listedBy,
                    keywords: keywords,
                    featured: featured,
                    // location:{
                    //     type:"Point",
                    //     coordinates:[Number(longitude),Number(latitude)]
                    // },
                    category: category,
                    SubCategory: subcategory,
                    nested:nestedCat,
                    otherDetails: { ...parsedDetails },
                    images: [...results],
                    userId: userId,
                    price: price,
                })
                const SavedData = await productTemplate.save()
                if (SavedData) {
                    USER.findOne({ _id: userId }).then((response) => {
                        userDetails = response
                        if (response.AdCount <= 0) {
                            USER.updateOne({ _id: userId }, {
                                AdCount: 0
                            }).then(async (response) => {
                                await sendNotification({email:userDetails.email,subject:"Ad live right now",link:`https://www.dealnbuy.in/product/${SavedData._id}`,product:SavedData.title})
                                res.status(200).json({ message: 'ad posted successfully' })
                            }).catch((err) => {
                                res.status(400).json({ message: "problem with updating user", error: err })
                            })
                        } else {
                            USER.updateOne({ _id: userId }, {
                                $inc: { AdCount: -1 }
                            }).then(async(response) => {
                                await sendNotification({email:userDetails.email,subject:"Ad live right now",link:`https://www.dealnbuy.in/product/${SavedData._id}`,product:SavedData.title})
                                res.status(200).json({ message: 'ad posted successfully' })
                            })
                                .catch((err) => {
                                    res.status(400).json({ message: "problem with updating user", error: err })
                                })
                        }
                    })
                } else {
                    res.status(200).json({ message: 'add failed to post' })
                }
            } else {
                res.status(400).json({ message: "something error with images" })
            }
        } catch (error) {
            res.status(500).json({ message: "something went wrong", error: error.message })
        }
    },

    //get single products
    getSinlgeProduct: async (req, res) => {
        try {
            const { productId } = req.query
            const productDetails = await PRODUCT.findOne({ _id: productId, deleted: false }).populate('userId')
            if (productDetails) {
                res.status(200).json(productDetails)
            } else {
                res.status(404).json({ messagge: "product not found" })
            }

        } catch (error) {
            res.status(500).json({ message: "something went wrong" })
        }
    },

    //get all Product products
    getProducts: async (req, res) => {
        try {

            const { page } = req.query
            let lastPage = false
            const limit = 12
            let productDetails = await PRODUCT.find({ deleted: false }).populate('userId').skip(page).limit(limit).sort({ createdAt: -1 })

            if (productDetails) {
                res.status(200).json(productDetails)
            } else {
                res.status(404).json({ message: "products not found" })
            }

        } catch (error) {
            res.status(500).json({ message: "something went wrong" })
        }
    },

    //get lastpage
    getLastPage: async (req, res) => {
        try {
            const { page } = req.query
            const limit = 12
            const totalCount = await PRODUCT.count()
            const totalPage = await totalCount / limit
            if (totalPage <= parseInt(page) + 1) {
                res.status(200).json({ lastPage: true })
            } else {
                res.status(200).json({ lastPage: false })
            }
        } catch (error) {
            res.status(500).json({ message: "something went wrong" })
        }

    },

    //block product
    blockProducts: async (req, res) => {
        try {
            const { productId } = req.params
            const productDetails = await PRODUCT.findOne({ _id: productId, deleted: false })
            if (productDetails) {
                PRODUCT.updateOne({ _id: productDetails._id }, { deleted: true }).then(() => {
                    res.status(200).json(productDetails)
                }).catch(() => {
                    res.status(404).json({ messagge: "failed to block" })
                })
            } else {
                res.status(404).json({ messagge: "products not found" })
            }
        } catch (error) {
            res.status(500).json({ message: "something went wrong" })
        }
    },

    //specific products
    getUserProduct: async (req, res) => {
        try {
            const { userId } = req.params
            const userProducts = await PRODUCT.find({ userId: userId, deleted: false })
            if (userProducts) {
                res.status(200).json(userProducts)
            } else {
                res.status(404).json({ message: "products not found" })
            }
        } catch (error) {
            res.status(500).json({ message: "something went wrong" })
        }
    },

    soldProduct: async (req, res) => {
        try {
            const { productId, userId } = req.query
            const productDetails = await PRODUCT.findOne({ _id: productId, userId: userId, deleted: false })
            if (productDetails) {
                PRODUCT.findByIdAndUpdate(productId, { deleted: true }).then(() => {
                    res.status(200).json({ message: "product marked as sold" })
                }).catch(err => { res.status(200).json(err.message) });
            } else {
                res.status(401).json({ message: "this product does not belongs to this user" })
            }
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    },
    // advertisement section






    addAdvertisement: async (req, res) => {
        try {
            console.log(req.body);
            const {
                title,
                subcategory,
                category,
                userId,
                locality,
                district,
                state,
                region,
                advSize,
                redirectionUrl,
                featured
            } = req.body
            const Upload = req.files.map((file) => {
                let locaFilePath = file.path;
                return (
                    cloudUpload(locaFilePath, toString(title))
                )
            })

            const results = await Promise.all(Upload);

            if (results) {
                const productTemplate = new PRODUCT({
                    title: title,
                    locality: locality,
                    district: district,
                    state: state,
                    region: region,
                    featured: featured,
                    // location:{
                    //     type:"Point",
                    //     coordinates:[Number(longitude),Number(latitude)]
                    // },
                    category: category,
                    SubCategory: subcategory,
                    images: [...results],
                    userId: userId,
                    advSize: parseInt(advSize),
                    redirectionUrl:redirectionUrl,
                    price:0,
                    type:"advertisement"
                })
                const SavedData = await productTemplate.save()
                if (SavedData) {
                    res.status(200).json({ message: 'ad posted successfully' })
                } else {
                    res.status(200).json({ message: 'add failed to post' })
                }
            } else {
                res.status(400).json({ message: "something error with image" })
            }
        } catch (error) {
            console.log(error.message);
            res.status(500).json({ message: "something went wrong" })
        }
    }




}