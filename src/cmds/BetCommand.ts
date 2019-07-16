import { Message, User, TextChannel, DMChannel, GroupDMChannel } from "discord.js";
import BaseCommand from "./BaseCommand";
import Database from "../Database";

interface IBet {
    user: User;
    amount: number;
    channel: TextChannel | DMChannel | GroupDMChannel;
}

class HelpCommand extends BaseCommand {
    public description: string = "Place a bet that the next roll from 0-100 will be greater than 40.";
    public hint: string = "<amount>";
    public name: string = "bet";

    private _bets: IBet[] = [];

    public constructor() {
        super();

        setInterval(this.processBets.bind(this), 4000);
    }

    public async process(message: Message, params: string[]): Promise<void> {
        let amount = Number(params[0]);

        if (!amount) {
            message.reply("you need to specify a valid amount to bet!");
            return;
        }

        amount = Math.floor(amount);

        if (amount <= 0) {
            message.reply("you need to specify a valid amount to bet!");
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

        userData.balance = Math.max(userData.balance - amount, 0);
        userData.balance = Math.floor(userData.balance);
        userData.save();

        this._bets.push({
            user: message.author,
            amount: amount,
            channel: message.channel
        });

        message.channel.send("<@" + message.author.id + "> has bet " + amount + " coin(s) that the next roll will be greater than 40!");
    }

    private async processBets(): Promise<void> {
        const roll = Math.floor(Math.random() * 101);

        if (roll > 40) {
            for (let i = 0; i < this._bets.length; i++) {
                const bet = this._bets[i];
                const userData = await Database.getUserData(bet.user);

                userData.balance += bet.amount * 2;
                userData.balance = Math.floor(userData.balance);
                userData.save();

                bet.channel.send("🤑 <@" + bet.user.id + "> just won " + bet.amount + " coin(s) (rolled " + roll + "), they now have " + userData.balance + "!");
            };
        } else {
            for (let i = 0; i < this._bets.length; i++) {
                const bet = this._bets[i];
                const userData = await Database.getUserData(bet.user);

                bet.channel.send("😢 <@" + bet.user.id + "> just lost " + bet.amount + " coin(s) (rolled " + roll + "), they now have " + userData.balance + "!");
            };
        }

        this._bets = [];
    }
}

export default HelpCommand;
