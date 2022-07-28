import mongoose, {Schema, Types} from 'mongoose';

export interface ICardsPack extends Document {
    _id: Types.ObjectId;
    user_id: Types.ObjectId;
    user_name: string;
    private: boolean;

    name: string;
    path: string;
    grade: number; //back count
    shots: boolean; //back count

    cardsCount: number; //back count
    deckCover: string;

    type: string;
    rating: number; //hz
    more_id: Types.ObjectId;

    created: Date;
    updated: Date;

    _doc: object; //crutch
}

const CardsPack: Schema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            required: true
        },
        user_name: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        private: {
            type: Boolean,
            required: true
        },
        path: {
            type: String,
            required: true
        },
        grade: {
            type: Number,
            required: true
        },
        shots: {
            type: Number,
            required: true
        },
        cardsCount: {
            type: Number,
            required: true
        },
        deckCover: {
            type: String,
        },
        type: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        more_id: {
            type: Schema.Types.ObjectId,
        }
    }, {
        timestamps: {
            createdAt: 'created',
            updatedAt: 'updated'
        }
    }
);

export default mongoose.model<ICardsPack>('cards-pack', CardsPack)