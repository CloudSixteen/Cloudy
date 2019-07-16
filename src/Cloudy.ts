import { Client, Message, TextChannel, Channel } from "discord.js";
import * as debug from "debug";
import * as path from "path";
import * as YAML from "yamljs";
import HelpCommand from "./cmds/HelpCommand";
import BalanceCommand from "./cmds/BalanceCommand";
import BetCommand from "./cmds/BetCommand";
import BaseCommand from "./cmds/BaseCommand";
import Database from "./Database";
import RichestCommand from "./cmds/RichestCommand";
import GiveCommand from "./cmds/GiveCommand";
import PlayerModel from "./models/PlayerModel";
import BannedCommand from "./cmds/BannedCommand";

const logSystem	= debug("bot:system");
const logEvent = debug("bot:event");
const logError = debug("bot:error");
const logWarn = debug("bot:warn");

class Cloudy {
    public client: Client;
    public config: any;

    private _commands: BaseCommand[] = [];

    constructor() {
        this.client = new Client();
        this.config = YAML.load(path.resolve(__dirname, "config.yml"));

        logSystem.enabled = true;
        logEvent.enabled = true;
        logError.enabled = true;
        logWarn.enabled = true;
		
        this._commands.push(new GiveCommand());
        this._commands.push(new HelpCommand());
        this._commands.push(new BetCommand());
        this._commands.push(new RichestCommand());
        this._commands.push(new BalanceCommand());
    }

    public get commands(): BaseCommand[] {
        return this._commands;
    }

    public getUserFromString(mention: string) {
        const matches = mention.match(/^<@!?(\d+)>$/);

        if (matches) {
            const id = matches[1];
            return this.client.users.get(id);
        } else {
            return undefined;
        }
    }

    public start(): void {
        logSystem("Starting bot...");

        this.client.on("ready", () => {
            logEvent(`[${ this.config.settings.nameBot }] Connected.`)
            logEvent(`Logged in as ${ this.client.user.tag }`)

            this.client.user.setActivity(this.config.settings.activity);

            setInterval(this.processPayday.bind(this), 1 * 1000 * 60 * 60);

            this.processPayday();
        });

        this.client.on("message", (message: Message) => {
            if (message.author.id !== this.client.user.id) {
                for (let i = 0; i < this._commands.length; i++) {
                    const cmd = this._commands[i];
                    const name = this.config.settings.prefix + cmd.name;

                    if (message.content.substr(0, name.length) === name) {
                        const paramString = message.content.substr(name.length).trim();
                        const matches = paramString.match(/"[^"\\]*(?:\\.[^"\\]*)*"|'[^'\\]*(?:\\.[^'\\]*)*'|```((.|\s)*?)```|\S+/g);
                        let params: string[] = [];

                        if (matches) {
                            params = matches.map(v => v.replace(/^"|"$|^'|'$|^```(\S*\n?)|```$/g, ""));
                        }

                        cmd.process(message,params);

                        return;
                    }
                };
            }
        });

        this.client.on("disconnect", () => {
            logWarn("Disconnecting the database...");
            Database.disconnect();
        });

        this.client.on("error", logError);
        this.client.on("warn", logWarn);

        process.on("exit", () => {
            logEvent(`[${ this.config.settings.nameBot }] Process exit.`);

            this.client.destroy()
        });

        process.on("uncaughtException", (err: Error) => {
            const errorMsg = (err ? err.stack || err : "").toString().replace(new RegExp(`${__dirname}\/`, "g"), "./");
            logError(errorMsg);
        });

        process.on("unhandledRejection", (err: Error) => {
            logError("Uncaught Promise error: \n" + err.stack);
        });

        this.client.login(this.config.settings.token);
    }

    private processPayday(): void {
        const channel = <TextChannel>this.client.channels.get(this.config.settings.channelId);

        PlayerModel.updateMany({}, {$inc: {balance: 50}}, (err, d) => {
            channel.send("🤑 **It's payday! All betting participants get 50 coins, woohoo!** 🤑");
        });
    }
}

export default new Cloudy();
