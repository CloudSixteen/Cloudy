import * as mongoose from "mongoose";
import { User } from "discord.js";
import PlayerModel, { IPlayer } from "./models/PlayerModel";

mongoose.set("useCreateIndex", true);

class Database {
    private readonly _url = "mongodb://localhost:27017/cloudy";

    public connect(): Promise<any> {
        return mongoose.connect(this._url, {useNewUrlParser: true});
    }

    public disconnect(): void {
        if (mongoose.connection) {
            mongoose.connection.close();
        }
    }

    public getUserData(user: User): Promise<IPlayer> {
        return new Promise<IPlayer>((resolve, reject) => {
            PlayerModel.findOne({userId: user.id}, (err, found) => {
                if (found === null) {
                    if (!err) {
                        const data = new PlayerModel({
                            userId: user.id,
                            balance: 1000
                        });

                        data.save().then(resolve);
                    } else {
                        console.log(err);
                        reject();
                    }
                } else {
                    resolve(found);
                }
            });
        });
    }
}

export default new Database();
