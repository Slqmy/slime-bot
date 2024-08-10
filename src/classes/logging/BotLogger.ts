import { existsSync, mkdirSync, renameSync } from "fs";
import { logFileExtension, logsFolderPath, pathSeparator } from "../../constants.js";
import winston, { format, Logger, transports } from "winston";

export class BotLogger {

    private logger: Logger;

    private logFormat = format.printf(({level, message, timestamp}) => `[${timestamp.split("T")[1]}] [${level}] ${message}`);

    private readonly id: string;
    private readonly name: string;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;

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

    public log(message: string) {
        this.logger.log({ level: "info", message});
    }
}