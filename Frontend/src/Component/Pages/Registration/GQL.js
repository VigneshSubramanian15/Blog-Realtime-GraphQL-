import { gql } from "@apollo/client";

export const RegistrationGQLQuery = gql`
    mutation Registration($email: String!, $password: String!, $name: String!) {
        registration(
            registrationInput: {
                name: $name
                password: $password
                email: $email
            }
        )
    }
`;
