import { gql } from "@apollo/client";

export const GetBlogData = gql`
    query {
        getAllPost {
            title
            shortDescription
            _id
            updatedAt
            name
        }
    }
`;

export const PostSubscription = gql`
    subscription {
        postListSubscription {
            title
            shortDescription
            name
            updatedAt
            _id
        }
    }
`;
