import {NextFunction, Request, Response} from "express";


export const authValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const encodedCreds = Buffer.from('admin:querty').toString('base64');
    const fullAuthHeaderValue = 'Basic' + encodedCreds;
    const incoumeAuthValue = req.headers['authorization'];
    if (fullAuthHeaderValue === incoumeAuthValue) {
        next()
    } else {
        res.status(401).send()
    }
};