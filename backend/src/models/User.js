import { model, models, Schema } from "mongoose";


const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
}, {timestamps: true});

const User = models.User || model('User', UserSchema);
export default User;