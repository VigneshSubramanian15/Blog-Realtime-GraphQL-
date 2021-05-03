const userSchema = require("../../Model/user");
const commentSchema = require("../../Model/comment");
const { ApolloError } = require("apollo-server");
const AuthorizeToken = require("../../Helper/AuthorizeToken");
const NEW_COMMENT = "NEW_COMMENT";

const createComment = async (_, { description, postId }, { req, pubSub }) => {
    let { _id } = AuthorizeToken(req);
    let newComment = await commentSchema.create({
        postId,
        createdBy: _id,
        description,
    });
    let { name } = await userSchema.findById(_id).select(["name"]);
    pubSub.publish(NEW_COMMENT + postId, {
        commentListSubscription: { ...newComment._doc, name },
    });
    return "Comment Created Successfully ";
};

const getPostComment = async (
    _,
    { postId, page = 0, count: countOfDoc = 5 }
) => {
    // AuthorizeToken(req);
    const count = await commentSchema.find({ postId }).countDocuments();
    const comments = await commentSchema
        .find({ postId })
        .limit(countOfDoc || 10)
        .skip(page);
    const commentList = await Promise.all(
        comments.map(async (comment) => {
            let { name } = await userSchema
                .findById(comment.createdBy)
                .select(["name"]);
            return { ...comment._doc, name };
        })
    );
    return { count, comment: commentList };
};

exports.commentResolvers = {
    Query: { getPostComment },
    Mutation: {
        createComment,
    },
    Subscription: {
        commentListSubscription: {
            subscribe: (_, { postId }, { pubSub }) => {
                return pubSub.asyncIterator(NEW_COMMENT + postId);
            },
        },
    },
};
