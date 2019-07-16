import { Client, Message } from "discord.js";

abstract class BaseCommand {
    public abstract description: string;
    public abstract hint: string;
    public abstract name: string;

    public abstract async process(message: Message, params: string[]): Promise<void>;
}

export default BaseCommand;
