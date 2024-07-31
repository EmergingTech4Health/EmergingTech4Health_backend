 const mongoose = require('mongoose');
const PublicationSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    authors: {
        type: [String],
        required: true
    },
    publicationDate: {
        type: Date,
        required: true
    },
    publicationType: {
        type: String,
        required: true
    },
    publicationLink: {
        type: String,
        required: true
    },
    publicationSummary: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('Publication', PublicationSchema);