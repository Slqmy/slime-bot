import { SlimeBot } from "../../classes/SlimeBot.js";

export type Event = {
    readonly name: string;
    readonly once?: boolean;
    execute(bot?: SlimeBot, ...args: any[]): void | Promise<void>;
}