const { gql } = require("apollo-server");

exports.postTypeDefs = gql`
    extend type Query {
        getAllPost(page: Int, count: Int): [PostData]!
        getPostById(id: String!): PostDataFull!
    }

    extend type Mutation {
        CreatePost(createPostInput: CreatePostInput!): String!
        UpdatePost(updatePostInput: UpdatePostInput!): String!
    }
    extend type Subscription {
        postListSubscription: PostData
    }

    input CreatePostInput {
        title: String!
        shortDescription: String!
        markdown: String!
    }

    input UpdatePostInput {
        id: String!
        title: String
        shortDescription: String
        markdown: String
    }

    type PostData {
        title: String!
        shortDescription: String!
        name: String!
        updatedAt: String!
        _id: String!
    }

    type PostDataFull {
        title: String!
        shortDescription: String!
        name: String!
        updatedAt: String!
        markdown: String!
        _id: String!
    }
`;
