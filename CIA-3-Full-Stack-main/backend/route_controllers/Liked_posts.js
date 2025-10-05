import Likes from "../Models/Likes.js"
import User from "../Models/User.js"

export default async function (req, res) {
    try {
        let user = await User.findOne({username: req.params.username})
        let likes = await Likes.find({user_id: user._id});
        if (likes.length == 0) return res.status(200).json({message: "No likes in the database!"});
        res.status(201).json(likes);
    } catch (e) {
        res.status(500).json({message: "Internal server error: " + e});
    }
}