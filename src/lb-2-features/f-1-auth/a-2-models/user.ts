import mongoose, {Document, Schema, Types} from 'mongoose';

export interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    password: string;
    rememberMe: boolean;
    isAdmin: boolean;

    name: string;
    verified: string;
    avatar?: string;
    publicCardPacksCount: number;

    token?: string;
    tokenDeathTime: number;
    resetPasswordToken?: string;
    resetPasswordTokenDeathTime?: number;

    created: Date;
    updated: Date;

    _doc: object; //crutch
}

const UserSchema: Schema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        rememberMe: {
            type: Boolean,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        verified: {
            type: Boolean,
            required: true
        },
        avatar: {
            type: String,
        },
        publicCardPacksCount: {
            type: Number,
            required: true
        },
        token: {
            type: String,
        },
        tokenDeathTime: {
            type: Number,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordTokenDeathTime: {
            type: Number,
        },

    }, {
        timestamps: {
            createdAt: 'created',
            updatedAt: 'updated'
        }
    }
);

export default mongoose.model<IUser>('card-user', UserSchema);