import { Message } from "discord.js";
import BaseCommand from "./BaseCommand";
import Database from "../Database";

class HelpCommand extends BaseCommand {
    public description: string = "Check your coins balance.";
    public hint: string = "";
    public name: string = "balance";

    public async process(message: Message, params: string[]): Promise<void> {
        const userData = await Database.getUserData(message.author);

        message.channel.send("<@" + message.author.id + ">'s has " + userData.balance + " coin(s) in their wallet.");
    }
}

export default HelpCommand;
