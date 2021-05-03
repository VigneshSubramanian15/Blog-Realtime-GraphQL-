const userSchema = require("../../Model/user");
const {
    registrationValidation,
    login: loginValidation,
} = require("./validation");
const { ApolloError } = require("apollo-server");
const jwt = require("jsonwebtoken");
const fs = require("fs");
var md5 = require("md5");
const AuthorizeToken = require("../../Helper/AuthorizeToken");

const registration = async (_, { registrationInput }) => {
    try {
        try {
            await registrationValidation.validateAsync(registrationInput);
        } catch (error) {
            throw new ApolloError("Input Validation Error", "500", error);
        }
        let { password, ...rest } = registrationInput;
        let hash = md5(password);
        let data = { ...rest, password: hash };
        let user = new userSchema(data);
        await user.save();
        return "User Created Successfully";
    } catch (error) {
        console.log({ error });
        throw new ApolloError("Server Error", 500, error);
    }
};

const login = async (_, { loginInput }) => {
    try {
        try {
            await loginValidation.validateAsync(loginInput);
        } catch (error) {
            console.log(error);
            throw new ApolloError("Input Validation Error", "500", error);
        }
        let { email, password } = loginInput;
        const hash = md5(password);
        let user = await userSchema
            .findOne({ email, password: hash })
            .select("email");
        if (user) {
            let token = jwt.sign(
                {
                    data: user,
                },
                process.env.SALT || "superSecret",
                { expiresIn: 60 * 60 * 1 }
            );
            return token;
        } else {
            throw new ApolloError("User Not Found", 404);
        }
    } catch (error) {
        console.log({ error });
        throw new ApolloError("Server Error", 500, error);
    }
};

const getUserInfo = async (_, __, { req }) => {
    const data = AuthorizeToken(req);
    const { name, email } = await userSchema.findById(data._id);
    return { name, email };
};
exports.registrationResolvers = {
    Query: {
        login,
        getUserInfo,
    },
    Mutation: {
        registration,
    },
};
