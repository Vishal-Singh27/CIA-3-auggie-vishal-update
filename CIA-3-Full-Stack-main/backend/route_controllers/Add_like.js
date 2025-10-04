import Post from "../Models/Post.js";

export default async function (req, res) {
    var post = await Post.findById(req.body.id);
    if (!post) res.status(400).json({message: "Post not found"});
    await Post.findByIdAndUpdate(post._id, {like: (post.like + 1)});
    res.status(200).json({message: "Like added!"});
}