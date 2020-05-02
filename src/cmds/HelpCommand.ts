import { Message } from "discord.js";
import BaseCommand from "./BaseCommand";
import Cloudy from "../Cloudy";

class HelpCommand extends BaseCommand {
    public description: string = "Get a list of available commands.";
    public hint: string = "";
    public name: string = "help";

    public async process(message: Message, params: string[]): Promise<void> {
        const commands: any[] = [];

        Cloudy.commands.forEach((cmd) => {
            let name = "!" + cmd.name;

            if (cmd.hint && cmd.hint.length > 0) {
                name += " *" + cmd.hint + "*"
            }

            commands.push({
                name: name,
                value: cmd.description
            });
        });

        message.author.send({
            embed: {
                color: 3447003,
                author: {
                    name: Cloudy.client.user.username,
                    icon_url: Cloudy.client.user.avatarURL
                },
                title: "Commands",
                description: "Here are all of my available commands:",
                fields: commands,
                timestamp: new Date(),
                footer: {
                    icon_url: Cloudy.client.user.avatarURL,
                    text: "© Cloud Sixteen"
                }
            }
        }).catch(() => message.reply("Cannot send a direct message to you, are your DMs disabled?"));

        message.reply("I have sent you a PM with my available commands.");
    }
}

export default HelpCommand;
