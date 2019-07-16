import { Schema, Document, model } from "mongoose";

const PlayerSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        required: true
    }
});

export interface IPlayer extends Document {
    userId: string;
    balance: number;
}

export default model<IPlayer>("player", PlayerSchema);