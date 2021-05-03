const { gql } = require("apollo-server");

exports.commentTypeDefs = gql`
    extend type Query {
        getPostComment(postId: String!, page: Int, count: Int): CommentData!
    }

    extend type Mutation {
        createComment(description: String!, postId: String!): String!
    }

    extend type Subscription {
        commentListSubscription(postId: String!): CommentSubscription
    }

    type CommentData {
        count: Int!
        comment: [Comment]
    }
    type Comment {
        createdBy: String!
        description: String!
        createdAt: String!
        name: String!
    }

    type CommentSubscription {
        _id: String!
        createdBy: String!
        description: String!
        createdAt: String!
        name: String!
    }
`;
