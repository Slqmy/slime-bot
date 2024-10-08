import { existsSync, mkdirSync, renameSync } from "fs";
import { logFileExtension, logsFolderPath, pathSeparator } from "../../constants.js";
import winston, { format, Logger, transports } from "winston";

export class BotLogger {

    private logger: Logger;

    private logFormat = format.printf(({level, message, timestamp}) => `[${timestamp.split("T")[1]}] [${level}] ${message}`);

    private readonly id: string;

    constructor(id: string) {
        this.id = id;

        const logFilesFolderPath = logsFolderPath + pathSeparator + this.id;
        mkdirSync(logFilesFolderPath, { recursive: true })

        const currentDate = new Date();
        const dateString = currentDate.toISOString().split("T")[0];

        let logNumber = 1;
        while (existsSync(logFilesFolderPath + pathSeparator + dateString + "-" + logNumber + logFileExtension) || (logNumber === 1 && existsSync(logFilesFolderPath + pathSeparator + dateString + logFileExtension))) {
            logNumber++;
        }

        if (logNumber === 2) {
            renameSync(logFilesFolderPath + pathSeparator + dateString + logFileExtension, logFilesFolderPath + pathSeparator + dateString + "-1" + logFileExtension);
        }

        const logFilePath = logFilesFolderPath + pathSeparator + dateString + (logNumber === 1 ? "" : "-" + logNumber) + logFileExtension;

        this.logger = winston.createLogger(
            {
                transports: [
                    new transports.Console({
                        format: format.combine(
                            format.cli(),
                            format.timestamp(),
                            this.logFormat
                        ),
                    }),
                    new transports.File({
                        filename: logFilePath,
                        format: format.combine(
                            format.timestamp(),
                            this.logFormat
                        )
                    })
                ]
            }
        )
    }

    public log(object: any) {
        this.logger.info({ message: this.processMessage(object)});
    }

    public warn(object: any) {
        this.logger.warn({ message: this.processMessage(object)});
    }

    public error(object: any) {
        this.logger.error({ message: this.processMessage(object)});
    }

    private processMessage(object: any) {
        if (typeof object === "string") {
            return object;
        } else {
            return JSON.stringify(object);
        }
    }
}