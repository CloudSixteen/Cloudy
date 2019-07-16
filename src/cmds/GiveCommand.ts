import { Message, User, TextChannel, DMChannel, GroupDMChannel } from "discord.js";
import BaseCommand from "./BaseCommand";
import Database from "../Database";
import Cloudy from "../Cloudy";

class GiveCommand extends BaseCommand {
    public description: string = "Give the mentioned user an amount of coins.";
    public hint: string = "<@user> <amount>";
    public name: string = "give";

    public async process(message: Message, params: string[]): Promise<void> {
        const amount = Number(params[1]);

        if (!amount || amount < 0) {
            message.reply("you need to specify a valid amount to give!");
            return;
        }

        if (!isFinite(amount)) {
            message.reply("unfortunately nobody can have infinity coins.");
            return;
        }

        const userData = await Database.getUserData(message.author);

        if (userData.balance < amount) {
            message.reply("you don't have enough coins to do that. Cheeky.");
            return;
        }

        const target = Cloudy.getUserFromString(params[0]);

        if (!target) {
            message.reply("you need to mention a valid recipient!");
            return; 
        }

        const targetData = await Database.getUserData(target);

        userData.balance = Math.max(userData.balance - amount, 0);
        userData.save();

        targetData.balance += amount;
        targetData.save();

        message.channel.send("<@" + message.author.id + "> has given " + amount + " coin(s) to " + params[0] + "!");
    }
}

export default GiveCommand;
