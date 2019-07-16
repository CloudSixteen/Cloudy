import { Message, User, TextChannel, DMChannel, GroupDMChannel } from "discord.js";
import BaseCommand from "./BaseCommand";
import * as mongoose from "mongoose";
import Database from "../Database";
import Cloudy from "../Cloudy";
import PlayerModel, { IPlayer } from "../models/PlayerModel";

class RichestCommand extends BaseCommand {
    public description: string = "Find out who the richest players are.";
    public hint: string = "";
    public name: string = "richest";

    public async process(message: Message, params: string[]): Promise<void> {
        const query = PlayerModel.find().sort("-balance").limit(10);

        query.exec((err, values) => {
            const richest: any[] = [];

            values.forEach((player) => {
                const client = Cloudy.client.users.get(player.userId);

                if (client) {
                    richest.push({
                        name: Cloudy.client.users.get(player.userId).username,
                        value: player.balance + " coins(s)"
                    });
                }
            });

            message.channel.send({
                embed: {
                    color: 0x00FF00,
                    author: {
                        name: Cloudy.client.user.username,
                        icon_url: Cloudy.client.user.avatarURL
                    },
                    title: "Richest Players",
                    description: "Here are the top 10 richest players:",
                    fields: richest,
                    timestamp: new Date(),
                    footer: {
                        icon_url: Cloudy.client.user.avatarURL,
                        text: "© Cloud Sixteen"
                    }
                }
            });
        });
    }
}

export default RichestCommand;
