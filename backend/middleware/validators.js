const { body, validationResult } = require("express-validator");

// Validation middleware for filtering products
const validateFilterProducts = [
    body("category")
        .isArray({ min: 1 }) // Ensures category is a non-empty array
        .withMessage("Category must be a non-empty array."),

    body("category.*") // Validate each item in the category array
        .isString()
        .trim()
        .notEmpty()
        .withMessage("Each category must be a valid non-empty string."),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Validation failed.",
                errors: errors.array(),
                error: true,
                success: false,
            });
        }
        next(); // Proceed to the controller if validation passes
    },
];

module.exports = { validateFilterProducts };
