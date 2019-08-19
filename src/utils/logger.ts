import * as expressWinston from "express-winston";
import winston from "winston";

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: []
});

// for production we log into files, otherwise console
if (process.env.NODE_ENV === 'production') {
    logger.add(new winston.transports.File({ filename: 'error.log', level: 'error' }));
    logger.add(new winston.transports.File({ filename: 'combined.log' }));
} else if (process.env.NODE_ENV === 'test') {
    logger.add(new winston.transports.File({ filename: 'error.log', level: 'error' }));
    logger.add(new winston.transports.Console({ level: 'error', format: winston.format.simple() }));
} else {
    logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}

const expressLoggerMessage =
    "HTTP {{res.statusCode}} {{req.method}} '{{req.url}}' ({{res.responseTime}}ms)";

export const expressLogger = expressWinston.logger({
    winstonInstance: logger,
    msg: expressLoggerMessage
});

export default logger;
