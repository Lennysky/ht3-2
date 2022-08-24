"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRouter = void 0;
const express_1 = require("express");
const posts_repository_1 = require("../repositories/posts-repository");
const auth_middleware_1 = require("../middlewares/auth-middleware");
exports.postsRouter = (0, express_1.Router)({});
const errorsCollect = (errors, message, field) => {
    const error = {
        message: message,
        field: field
    };
    errors.push(error);
};
const errorsResult = (res, errorsMessages, status) => {
    const errorResult = {
        errorsMessages: errorsMessages
    };
    res.status(status).send(errorsMessages);
};
exports.postsRouter.get('/', (req, res) => {
    const posts = posts_repository_1.postsRepository.getPosts();
    res.status(200).send(posts);
});
exports.postsRouter.post('/', auth_middleware_1.authValidationMiddleware, (req, res) => {
    const body = req.body.title;
    const errors = [];
    if (!body.title || typeof body.title !== 'string' || !body.title.trim() || body.title.length > 30) {
        errorsCollect(errors, 'You should enter the correct title', 'title');
    }
    if (!body.shortDescription || body.shortDescription !== 'string' || !body.shortDescription.trim() || body.shortDescription.length > 100) {
        errorsCollect(errors, 'You should enter the correct short description', 'shortDescription');
    }
    if (!body.content || body.content !== 'string' || !body.content.trim() || body.content.length > 1000) {
        errorsCollect(errors, 'You should enter the correct content', 'content');
    }
    if (errors.length > 0) {
        errorsResult(res, errors, 400);
    }
    else {
        const newPost = posts_repository_1.postsRepository.createPost(body.title, body.shortDescription, body.content, body.bloggerId);
        if (!newPost) {
            errorsCollect(errors, 'You should enter correct bloggerId', 'bloggerId');
            errorsResult(res, errors, 400);
            return;
        }
        res.status(201).send(newPost);
    }
});
exports.postsRouter.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const post = posts_repository_1.postsRepository.getPostById(id);
    if (!post) {
        res.sendStatus(404);
        return;
    }
    else {
        res.status(200).send(post);
    }
});
exports.postsRouter.put('/:id', auth_middleware_1.authValidationMiddleware, (req, res) => {
    const id = parseInt(req.params.id);
    const errors = [];
    const body = req.body;
    const isUpdated = posts_repository_1.postsRepository.updatePost(id, body.title, body.shortDescription, body.content, body.bloggerId);
    if (!body.title || typeof body.title !== 'string' || !body.title.trim() || body.title.length > 30) {
        errorsCollect(errors, 'You should enter the correct title', 'field');
    }
    if (!body.shortDescription || typeof body.shortDescription || !body.shortDescription.trim() || body.shortDescription.length > 100) {
        errorsCollect(errors, 'You should enter the correct short description', 'shortDescription');
    }
    if (!body.content || typeof body.content !== 'string' || !body.content.trim() || body.content.length > 1000) {
        errorsCollect(errors, 'You should enter the correct content', 'content');
    }
    if (errors.length > 0) {
        errorsResult(res, errors, 400);
    }
    if (isUpdated === null) {
        errorsCollect(errors, 'You should enter correct bloggerId', 'bloggerId');
        errorsResult(res, errors, 400);
        return;
    }
    // Сделала simplify, это эквивалент isUpdated === false.
    if (!isUpdated) {
        res.sendStatus(404);
    }
    else {
        res.status(204).send();
    }
});
exports.postsRouter.delete('/:id', auth_middleware_1.authValidationMiddleware, (req, res) => {
    const id = parseInt(req.params.id);
    const isDeleted = posts_repository_1.postsRepository.deletePost(id);
    if (!isDeleted) {
        res.sendStatus(404);
        return;
    }
    res.status(204).send();
});
//# sourceMappingURL=posts-router.js.map