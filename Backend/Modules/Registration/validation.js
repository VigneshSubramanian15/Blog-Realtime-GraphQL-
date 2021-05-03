const validate = require("joi");

//registartion
const registartion = validate.object({
    name: validate.string().min(3).required(),
    email: validate.string().required(),
    password: validate.string().min(3).required(),
});

const login = validate.object({
    email: validate.string().required(),
    password: validate.string().min(3).required(),
});
module.exports = {
    registrationValidation: registartion,
    login,
};
