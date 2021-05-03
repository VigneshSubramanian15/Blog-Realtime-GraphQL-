import { gql } from "@apollo/client";

export const GetPostGQLQuery = gql`
    query GetPostById($id: String!) {
        getPostById(id: $id) {
            title
            shortDescription
            markdown
            name
            updatedAt
        }
    }
`;

export const GetAllComments = gql`
    query GetPostComment($postId: String!) {
        getPostComment(postId: $postId, count: 10, page: 0) {
            count
            comment {
                description
                createdAt
                createdBy
                name
            }
        }
    }
`;

export const CommentSubscription = gql`
    subscription CommentListSubscription($postId: String!) {
        commentListSubscription(postId: $postId) {
            description
            name
            _id
            createdAt
        }
    }
`;

export const CreateComment = gql`
    mutation CreateComment($description: String!, $postId: String!) {
        createComment(description: $description, postId: $postId)
    }
`;
