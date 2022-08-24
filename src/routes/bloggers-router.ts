import {Router, Request, Response} from 'express';
import { bloggersRepository } from '../repositories/bloggers-repository';
import {stringify} from "querystring";
import {authValidationMiddleware} from "../middlewares/auth-middleware";

export const bloggersRouter = Router({});

/* 1. Делает объект ошибки.
* 2. Пушит в массив этот объект */
const errorsCollect = (errors: FieldErrorType[], message: string, field: string) => {
    const error: FieldErrorType = {
        message: message,
        field: field
    };
    errors.push(error)
};

const errorsResult = (errorsMessages: FieldErrorType[], res: Response, status: number) => {
    const errorResult: APIErrorResultType = {
        errorsMessages: errorsMessages
    };
    res.status(status).send(errorsMessages)
};

bloggersRouter.get ('/',(req: Request, res: Response) => {
    const bloggers = bloggersRepository.findBloggers();
    res.send(bloggers)
});

bloggersRouter.post ('/',
    authValidationMiddleware,
    (req:Request, res:Response) => {
    // По какому принципу ставить тип? Здесь какой правильно  - postViewModel || postInputModel?
    const body: BloggerInputModelType = req.body;
    const errors: FieldErrorType[] = [];
    const reg = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?")
    if (!body.name || typeof body.name !== 'string' || !body.name.trim() || body.name.length > 30) {
        errorsCollect(errors, 'You should enter correct name', 'name')
    }
    if (!body.youtubeUrl || typeof body.youtubeUrl !== 'string' || !body.youtubeUrl.trim() || body.youtubeUrl.length > 100 || reg.test(body.youtubeUrl)) {
        errorsCollect(errors, 'You should enter the correct', 'youtubeUrl' )
    }
    if (errors.length > 0) {
        errorsResult(errors, res, 400)
    } else {
        const newBlogger = bloggersRepository.createBlogger(body.name, body.youtubeUrl)
        res.status(201).send(newBlogger)
    }
});

bloggersRouter.get ('/:id',(req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const blogger = bloggersRepository.getBloggerById(id);
    if (!blogger) {
        res.status(404).send();
        return;
    } else {
        res.status(200).send(blogger)
    }
});

bloggersRouter.put ('/:id',
    authValidationMiddleware,
    (req:Request, res: Response) => {
    const id = parseInt(req.params.id);
    const errors: FieldErrorType[] = [];
    const body = req.body;
    const reg = new RegExp("^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_\+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?")
    if (!body.name || typeof body.name !== 'string' || !body.name.trim() || body.name.length > 10) {
        errorsCollect(errors, 'You should enter correct name', 'name')
    }
    if (!body.youtubeUrl || typeof body.youtubeUrl !== 'string' || body.youtubeUrl.trim() || body.youtubeUrl.length > 100 || reg.test(body.youtubeUrl)) {
        errorsCollect(errors, 'You should enter correct youtube url', 'youtubeUrl')
    }
    if (errors.length > 0) {
        errorsResult(errors, res, 400)
    }
    const blogger = bloggersRepository.updateBlogger(id, body.name, body.youtubeUrl);
    if (!blogger) {
        res.sendStatus(404)
    } else {
        res.status(204).send()
    }
});

bloggersRouter.delete ('/:id',
    authValidationMiddleware,
    (req: Request, res: Response) => {
   const id = parseInt(req.params.id);
   const blogger = bloggersRepository.deleteBlogger(id);
   if (!blogger) {
       res.sendStatus(404);
       return
   } else {
       res.sendStatus(201)
   }
});

type FieldErrorType = {
    message: string
    field: string
}

type APIErrorResultType = {
    errorsMessages: FieldErrorType[]
}

type BloggerInputModelType = {
    name: string
    youtubeUrl: string
}