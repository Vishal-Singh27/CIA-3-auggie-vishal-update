import Post from "../Models/Post.js";

export default async function (req, res) {
    var post = await Post.findById(req.body.id);
    if (!post) res.status(400).json({message: "Post not found"});
    await Post.findByIdAndUpdate(post.comments, {$push: {comments: req.body.comment}});
    res.status(200).json({message: "Like added!"});
}