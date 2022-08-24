"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bloggersRouter = void 0;
const express_1 = require("express");
const bloggers_repository_1 = require("../repositories/bloggers-repository");
const auth_middleware_1 = require("../middlewares/auth-middleware");
exports.bloggersRouter = (0, express_1.Router)({});
/* 1. Делает объект ошибки.
* 2. Пушит в массив этот объект */
const errorsCollect = (errors, message, field) => {
    const error = {
        message: message,
        field: field
    };
    errors.push(error);
};
const errorsResult = (errorsMessages, res, status) => {
    const errorResult = {
        errorsMessages: errorsMessages
    };
    res.status(status).send(errorsMessages);
};
exports.bloggersRouter.get('/', (req, res) => {
    const bloggers = bloggers_repository_1.bloggersRepository.findBloggers();
    res.send(bloggers);
});
exports.bloggersRouter.post('/', auth_middleware_1.authValidationMiddleware, (req, res) => {
    // По какому принципу ставить тип? Здесь какой правильно  - postViewModel || postInputModel?
    const body = req.body;
    const errors = [];
    const reg = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
    if (!body.name || typeof body.name !== 'string' || !body.name.trim() || body.name.length > 30) {
        errorsCollect(errors, 'You should enter correct name', 'name');
    }
    if (!body.youtubeUrl || typeof body.youtubeUrl !== 'string' || !body.youtubeUrl.trim() || body.youtubeUrl.length > 100 || reg.test(body.youtubeUrl)) {
        errorsCollect(errors, 'You should enter the correct', 'youtubeUrl');
    }
    if (errors.length > 0) {
        errorsResult(errors, res, 400);
    }
    else {
        const newBlogger = bloggers_repository_1.bloggersRepository.createBlogger(body.name, body.youtubeUrl);
        res.status(201).send(newBlogger);
    }
});
exports.bloggersRouter.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const blogger = bloggers_repository_1.bloggersRepository.getBloggerById(id);
    if (!blogger) {
        res.status(404).send();
        return;
    }
    else {
        res.status(200).send(blogger);
    }
});
exports.bloggersRouter.put('/:id', auth_middleware_1.authValidationMiddleware, (req, res) => {
    const id = parseInt(req.params.id);
    const errors = [];
    const body = req.body;
    const reg = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?");
    if (!body.name || typeof body.name !== 'string' || !body.name.trim() || body.name.length > 10) {
        errorsCollect(errors, 'You should enter correct name', 'name');
    }
    if (!body.youtubeUrl || typeof body.youtubeUrl !== 'string' || body.youtubeUrl.trim() || body.youtubeUrl.length > 100 || reg.test(body.youtubeUrl)) {
        errorsCollect(errors, 'You should enter correct youtube url', 'youtubeUrl');
    }
    if (errors.length > 0) {
        errorsResult(errors, res, 400);
    }
    const blogger = bloggers_repository_1.bloggersRepository.updateBlogger(id, body.name, body.youtubeUrl);
    if (!blogger) {
        res.sendStatus(404);
    }
    else {
        res.status(204).send();
    }
});
exports.bloggersRouter.delete('/:id', auth_middleware_1.authValidationMiddleware, (req, res) => {
    const id = parseInt(req.params.id);
    const blogger = bloggers_repository_1.bloggersRepository.deleteBlogger(id);
    if (!blogger) {
        res.sendStatus(404);
        return;
    }
    else {
        res.sendStatus(201);
    }
});
//# sourceMappingURL=bloggers-router.js.map