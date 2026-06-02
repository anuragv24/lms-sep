import { model, models, Schema } from "mongoose";

const BookSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,

    },
    thumbnail: {
        type: String,

    },
    pdfUrl: {
        type: String,
        required: true,
    },
    
}, {timestamps: true});

BookSchema.index({ title: 'text', author: 'text' });

const Book = models.Book || model('Book', BookSchema);

export default Book;