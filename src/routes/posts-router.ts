import {Router, Request, Response} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {bloggersRepository} from "../repositories/bloggers-repository";
import {authValidationMiddleware} from "../middlewares/auth-middleware";

export const postsRouter = Router({});

const errorsCollect = (errors: FieldErrorType[], message: string, field: string) => {
    const error: FieldErrorType = {
        message: message,
        field: field
    };
    errors.push(error)
};

const errorsResult = (res: Response, errorsMessages: FieldErrorType[], status: number) => {
    const errorResult: APIErrorResultType = {
        errorsMessages: errorsMessages
    };
    res.status(status).send(errorsMessages)
};

postsRouter.get('/', (req: Request, res: Response) => {
    const posts = postsRepository.getPosts()
    res.status(200).send(posts)
});

postsRouter.post('/',
    authValidationMiddleware,
    (req: Request, res: Response) => {
    const body = req.body.title;
    const errors: FieldErrorType[] = [];
    if (!body.title || typeof body.title !== 'string' || !body.title.trim() || body.title.length > 30) {
        errorsCollect(errors, 'You should enter the correct title', 'title')
    }
    if (!body.shortDescription || body.shortDescription !== 'string' || !body.shortDescription.trim() || body.shortDescription.length > 100) {
        errorsCollect(errors, 'You should enter the correct short description', 'shortDescription')
    }
    if (!body.content || body.content !== 'string' || !body.content.trim() || body.content.length > 1000) {
        errorsCollect(errors, 'You should enter the correct content', 'content')
    }
    if (errors.length > 0) {
        errorsResult(res, errors, 400)
    } else {
        const newPost = postsRepository.createPost(
            body.title,
            body.shortDescription,
            body.content,
            body.bloggerId);
        if (!newPost) {
            errorsCollect(errors, 'You should enter correct bloggerId', 'bloggerId');
            errorsResult(res, errors, 400);
            return
        }
        res.status(201).send(newPost)
    }
});

postsRouter.get('/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const post = postsRepository.getPostById(id);
    if (!post) {
        res.sendStatus(404);
        return
    } else {
        res.status(200).send(post)
    }
});

postsRouter.put('/:id',
    authValidationMiddleware,
    (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const errors: FieldErrorType[] = [];
    const body: PostInputModelType = req.body;
    const isUpdated = postsRepository.updatePost(id, body.title, body.shortDescription, body.content, body.bloggerId);

    if (!body.title || typeof body.title !== 'string' || !body.title.trim() || body.title.length > 30) {
        errorsCollect(errors, 'You should enter the correct title', 'field')
    }
    if (!body.shortDescription || typeof body.shortDescription || !body.shortDescription.trim() || body.shortDescription.length > 100) {
        errorsCollect(errors, 'You should enter the correct short description', 'shortDescription')
    }
    if (!body.content || typeof body.content !== 'string' || !body.content.trim() || body.content.length > 1000) {
        errorsCollect(errors, 'You should enter the correct content', 'content')
    }
    if (errors.length > 0) {
        errorsResult(res, errors, 400)
    }
    if (isUpdated === null) {
        errorsCollect(errors, 'You should enter correct bloggerId', 'bloggerId');
        errorsResult(res, errors, 400);
        return
    }
    // Сделала simplify, это эквивалент isUpdated === false.
    if (!isUpdated) {
        res.sendStatus(404)
    } else {
        res.status(204).send()
    }
});

postsRouter.delete('/:id',
    authValidationMiddleware,
    (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const isDeleted = postsRepository.deletePost(id);
    if (!isDeleted) {
        res.sendStatus(404);
        return
    }
    res.status(204).send()
});

type FieldErrorType = {
    message: string
    field: string
}

type APIErrorResultType = {
    errorsMessages: FieldErrorType[]
}

type PostInputModelType = {
    title: string
    shortDescription: string
    content: string
    bloggerId: number
}