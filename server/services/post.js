const PostModel = require("../models/post")

const loadPostsWithPage = (search, { page, pageSize }) =>
    Promise.all([
        PostModel.find(search)
            .sort("-scheduledAt")
            .skip((parseInt(page) - 1) * parseInt(pageSize))
            .limit(parseInt(pageSize))
            .populate({
                path: "actor",
                select: "number name",
            })
            .populate({
                path: "account",
                select: "alias",
            }),
        PostModel.countDocuments(search)
    ]);

const createPost = ({ actor, account, image, platform, type, title, folder, description, tags, price, scheduledAt }) =>
    PostModel.create({
        actor,
        account,
        image,
        platform,
        type,
        title,
        folder,
        description,
        tags,
        price,
        scheduledAt
    })

const changePost = (postId, { actor, account, image, platform, type, title, folder, description, tags, price, scheduledAt }) =>
    PostModel.findByIdAndUpdate(postId, { actor, account, image, platform, type, title, folder, description, tags, price, scheduledAt })

const deletePost = (postId) =>
    PostModel.findByIdAndDelete(postId)

const PostService = {
    loadPostsWithPage,
    createPost,
    changePost,
    deletePost,
}

module.exports = PostService