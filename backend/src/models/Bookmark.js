import mongoose, { Schema, model, models } from 'mongoose';

const BookmarkSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    bookId: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
    },
}, {timestamps: true});

BookmarkSchema.index({ userId: 1, bookId: 1 }, { unique: true });

const Bookmark = models.Bookmark || model('Bookmark', BookmarkSchema);

export default Bookmark;