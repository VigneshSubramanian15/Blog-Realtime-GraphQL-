const { gql } = require("apollo-server");

exports.registrationTypeDefs = gql`
    extend type Query {
        login(loginInput: LoginInput!): String!
        getUserInfo: getUserInfo!
    }

    extend type Mutation {
        registration(registrationInput: RegistrationInput!): String!
    }

    type getUserInfo {
        name: String!
        email: String!
    }

    input LoginInput {
        email: String!
        password: String!
    }

    input RegistrationInput {
        name: String!
        password: String!
        email: String!
    }
`;
