'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Validates POST and GET requests for recipes route
 * @class RecipesValidation
 */
var RecipesValidation = function () {
    function RecipesValidation() {
        _classCallCheck(this, RecipesValidation);
    }

    _createClass(RecipesValidation, null, [{
        key: 'addRecipeValidations',

        /**
         * Validates all recipe details before allowing access to controller class
         * @static
         * @param {object} req
         * @param {object} res
         * @param {object} next
         * @returns {object} Validation error messages or contents of req.body
         * @memberof RecipesValidation
         */
        value: function addRecipeValidations(req, res, next) {
            var _req$body = req.body,
                title = _req$body.title,
                ingredients = _req$body.ingredients,
                procedures = _req$body.procedures,
                errors = {};

            if (title === undefined || ingredients === undefined || procedures === undefined) {
                return res.status(400).json({
                    status: 'Failed',
                    message: 'All or some fields are not defined'
                });
            }

            if (!_validator2.default.isEmpty(title)) {
                for (var character = 0; character < title.length; character += 1) {
                    if (_validator2.default.toInt(title[character])) {
                        errors.title = 'Recipe title must not contain numbers';
                        break;
                    }
                }
            } else {
                errors.title = 'Recipe title is required';
            }

            if (!_validator2.default.isEmpty(ingredients)) {
                if (!_validator2.default.isLength(ingredients, { min: 20, max: 1000 })) {
                    errors.ingredients = 'Recipe ingredients provided must be more than 20 characters';
                }
            } else {
                errors.ingredients = 'Recipe ingredients are required';
            }

            if (!_validator2.default.isEmpty(procedures)) {
                if (!_validator2.default.isLength(procedures, { min: 30, max: 1000 })) {
                    errors.procedures = 'Recipe procedures provided must be more than 30 characters';
                }
            } else {
                errors.procedures = 'Recipe procedures are required';
            }

            var result = { isValid: (0, _isEmpty2.default)(errors) };

            if (!result.isValid) {
                return res.status(400).json({ errors: errors });
            }
            next();
        }

        /**
         * Validates updated recipe detail(s) before allowing access to controller class
         * @static
         * @param {object} req
         * @param {object} res
         * @param {object} next
         * @returns {object} Validation error messages or content(s) of req.body
         * @memberof RecipesValidation
         */

    }, {
        key: 'updateRecipeValidations',
        value: function updateRecipeValidations(req, res, next) {
            var _req$body2 = req.body,
                title = _req$body2.title,
                ingredients = _req$body2.ingredients,
                procedures = _req$body2.procedures,
                errors = {};

            if (!(title || ingredients || procedures)) {
                return res.status(400).json({
                    status: 'Failed',
                    message: 'Provide a field to update'
                });
            }

            if (title) {
                for (var character = 0; character < title.length; character += 1) {
                    if (_validator2.default.toInt(title[character])) {
                        errors.title = 'Recipe title must not contain numbers';
                        break;
                    }
                }
            }

            if (ingredients) {
                if (!_validator2.default.isLength(ingredients, { min: 20, max: 1000 })) {
                    errors.ingredients = 'Recipe ingredients provided must be more than 20 characters';
                }
            }

            if (procedures) {
                if (!_validator2.default.isLength(procedures, { min: 30, max: 1000 })) {
                    errors.procedures = 'Recipe procedures provided must be more than 30 characters';
                }
            }

            var result = { isValid: (0, _isEmpty2.default)(errors) };

            if (!result.isValid) {
                return res.status(400).json({ errors: errors });
            }
            next();
        }

        /**
         * Validates query and non query routes before allowing access to controller class
         * @static
         * @param {object} req
         * @param {object} res
         * @param {object} next
         * @returns {object} Validation error messages or contents of req.query(or nothing)
         * @memberof RecipesValidation
         */

    }, {
        key: 'getSortdedRecipesValidation',
        value: function getSortdedRecipesValidation(req, res, next) {
            var _req$query = req.query,
                sort = _req$query.sort,
                order = _req$query.order,
                errors = {};

            if (!req.originalUrl.includes('?')) {
                return next();
            }

            if (sort === undefined || order === undefined) {
                return res.status(400).json({
                    status: 'Failed',
                    message: 'Sort or(and) order query parameter(s) is(are) not defined'
                });
            }

            if (!_validator2.default.isEmpty(sort)) {
                if (!(sort.toLowerCase() === 'upvotes' || sort.toLowerCase() === 'downvotes')) {
                    errors.sortType = 'Sort query must be either upvotes or downvotes';
                }
            } else {
                errors.sortType = 'Sort query is required';
            }

            if (!_validator2.default.isEmpty(order)) {
                if (!(order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc')) {
                    errors.order = 'Order query must be either asc or desc';
                }
            } else {
                errors.order = 'Order query is required';
            }

            var result = { isValid: (0, _isEmpty2.default)(errors) };

            if (!result.isValid) {
                return res.status(400).json({ errors: errors });
            }
            next();
        }
    }]);

    return RecipesValidation;
}();

exports.default = RecipesValidation;