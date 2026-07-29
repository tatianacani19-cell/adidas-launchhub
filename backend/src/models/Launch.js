import mongoose from "mongoose";

const launchSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        default: "",
    },
    market: {
        type: String,
        required: true,
    },
    launchDate: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Draft", "In Review", "Approved", "Published"],
        default: "Draft",
    },
}, {
    timestamps: true,
});

const Launch = mongoose.model("Launch", launchSchema);

export default Launch;
