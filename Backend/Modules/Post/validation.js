const validate = require("joi");

//registartion
const postValidation = validate.object({
    title: validate.string().min(3).required(),
    shortDescription: validate.string().min(3).max(255).required(),
    markdown: validate.string().min(3).required(),
});

const updatePostValidation = validate.object({
    id: validate.string().min(3),
    title: validate.string().min(3),
    shortDescription: validate.string().min(3).max(255),
    markdown: validate.string().min(3),
});

module.exports = {
    postValidation,
    updatePostValidation,
};
