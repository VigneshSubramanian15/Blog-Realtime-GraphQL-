import { gql } from "@apollo/client";

export const LoginGQLQuery = gql`
    query Login($email: String!, $password: String!) {
        login(loginInput: { email: $email, password: $password })
    }
`;
