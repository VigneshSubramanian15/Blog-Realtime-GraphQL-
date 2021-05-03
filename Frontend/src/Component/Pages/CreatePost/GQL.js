import { gql } from "@apollo/client";

export const CreateBlog = gql`
    mutation Post(
        $title: String!
        $shortDescription: String!
        $markdown: String!
    ) {
        CreatePost(
            createPostInput: {
                title: $title
                shortDescription: $shortDescription
                markdown: $markdown
            }
        )
    }
`;
