const { Platform } = require("../config/const");
const AccountService = require("../services/account");
const ActorService = require("../services/actor");
const PostService = require("../services/post");
const { ApiError } = require("../utils/resp");

const handleLoadPosts = async (req, res) => {
    try {
        const { platform, actor, page, pageSize } = req.query;
        const [posts, postsCount] = await PostService.loadPostsWithPage(
            { platform: platform == Platform.ALL ? undefined : platform, actor },
            { page, pageSize: pageSize || "10" }
        )
        sendResult(res, { posts, postsCount });
    } catch (error) {
        console.error(error);
        sendError(res, error);
    }
};

const handleCreatePost = async (res, req) => {
    try {
        const { actor, platform, ...params } = req.body;
        const actorModel = await ActorService.findById(actor)
        if (!actorModel)
            throw new ApiError(`cannot find model`);
        if (platform != Platform.ALL) {
            const account = await AccountService.findByActor(platform, actor);
            if (!account)
                throw new ApiError(`cannot find model for platform(${platform})`);
            await PostService.createPost({ actor, platform, account: account._id, ...params })
        } else {
            const accounts = await AccountService.loadByActor(actor);
            if (accounts.length == 0) {
                throw new ApiError(`cannot find accounts for platform(${platform})`);
            }
            for (let acc of accounts) {
                await PostService.createPost({ actor, platform: acc.platform, account: acc._id, ...params })
            }
        }
        sendResult(res);
    } catch (error) {
        console.error(error);
        sendError(res, error);
    }
}

const handleChangePost = async (res, req) => {
    try {
        const { postId } = req.params;
        const params = req.body;
        await PostService.changePost(postId, params)
        sendResult(res);
    } catch (error) {
        console.error(error);
        sendError(res, error);
    }
}

const handleDeletePost = async (res, req) => {
    try {
        const { postId } = req.params;
        await PostService.deletePost(postId);
        sendResult(res);
    } catch (error) {
        console.error(error);
        sendError(res, error);
    }
}

const PostCtrl = {
    handleLoadPosts,
    handleCreatePost,
    handleChangePost,
    handleDeletePost,
}

module.exports = PostCtrl