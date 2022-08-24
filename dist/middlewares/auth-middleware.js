"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidationMiddleware = void 0;
const authValidationMiddleware = (req, res, next) => {
    const encodedCreds = Buffer.from('admin:querty').toString('base64');
    const fullAuthHeaderValue = 'Basic' + encodedCreds;
    const incoumeAuthValue = req.headers['authorization'];
    if (fullAuthHeaderValue === incoumeAuthValue) {
        next();
    }
    else {
        res.status(401).send();
    }
};
exports.authValidationMiddleware = authValidationMiddleware;
//# sourceMappingURL=auth-middleware.js.map