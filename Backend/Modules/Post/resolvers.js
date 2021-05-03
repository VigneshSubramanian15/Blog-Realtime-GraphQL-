const postSchema = require("../../Model/post");
const userSchema = require("../../Model/user");
const { postValidation, updatePostValidation } = require("./validation");
const { ApolloError } = require("apollo-server");
const AuthorizeToken = require("../../Helper/AuthorizeToken");

const CreatePost = async (_, { createPostInput }, { req, pubSub }) => {
    try {
        try {
            await postValidation.validateAsync(createPostInput);
        } catch (error) {
            throw new ApolloError("Input Validation Error", "500", error);
        }
        const { _id } = AuthorizeToken(req);
        createPostInput = { ...createPostInput, createdBy: _id };
        const postNew = await postSchema.create(createPostInput);
        const { markdown, createdBy, createdAt, ...rest } = postNew;
        let { name } = await userSchema.findById(createdBy);
        let data = { ...rest._doc, name };
        pubSub.publish("NewPost", { postListSubscription: data });
        return " Post Created Successfully";
    } catch (error) {
        console.log({ error });
        throw new ApolloError("Server Error", 500, error);
    }
};

const getAllPost = async (_, { page = 0, count = 10 }) => {
    try {
        const Post = await postSchema
            .find()
            .select(["title", "shortDescription", "updatedAt", "createdBy"]);

        let data = await Promise.all(
            Post.map(async (val) => {
                let { name } = await userSchema
                    .findById(val.createdBy)
                    .select(["name"]);
                let { createdBy, ...rest } = val._doc;
                return { ...rest, name };
            })
        );

        return data;
    } catch (error) {
        console.log({ error });
        throw new ApolloError("Server Error", 500, error);
    }
};

const getPostById = async (_, { id }) => {
    try {
        const Post = await postSchema
            .findById(id)
            .select([
                "title",
                "shortDescription",
                "updatedAt",
                "markdown",
                "createdBy",
            ]);

        let { name } = await userSchema
            .findById(Post.createdBy)
            .select(["name"]);
        let { createdBy, ...rest } = Post._doc;
        const data = { ...rest, name };

        return data;
    } catch (error) {
        console.log({ error });
        throw new ApolloError("Server Error", 500, error);
    }
};

const UpdatePost = async (_, { updatePostInput }) => {
    try {
        try {
            await updatePostValidation.validateAsync(updatePostInput);
        } catch (error) {
            throw new ApolloError("Input Validation Error", "500", error);
        }
        const { _id, ...rest } = updatePostInput;
        const post = await postSchema.findByIdAndUpdate(
            updatePostInput.id,
            rest,
            {
                useFindAndModify: false,
            }
        );
        return "Post Updated Successfully";
    } catch (error) {
        console.log({ error });
        throw new ApolloError("Server Error", 500, error);
    }
};

exports.postResolvers = {
    Query: {
        getAllPost,
        getPostById,
    },
    Mutation: {
        CreatePost,
        UpdatePost,
    },
    Subscription: {
        postListSubscription: {
            subscribe: (_, __, { pubSub }) => {
                return pubSub.asyncIterator("NewPost");
            },
        },
    },
};
