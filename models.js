const users = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    name: {
        type: String
    },
    role: {
        type: String
    }
});

// Path: models.js
