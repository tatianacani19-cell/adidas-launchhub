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
    category: {
        type: String,
        default: "",
    },
    owner: {
        type: String,
        default: "",
    },
    currentStep: {
        type: String,
        default: "",
    },
    productCategory: {
        type: String,
        default: "",
    },
    subcategory: {
        type: String,
        default: "",
    },
    season: {
        type: String,
        default: "",
    },
    region: {
        type: String,
        default: "",
    },
    targetAudience: {
        type: String,
        default: "",
    },
    pricePoint: {
        type: String,
        default: "",
    },
    distributionChannels: {
        type: String,
        default: "",
    },
    tagline: {
        type: String,
        default: "",
    },
    assets: {
        type: [String],
        default: [],
    },
    comments: {
        type: [{
            author: String,
            text: String,
            createdAt: {
                type: Date,
                default: Date.now,
            },
        }],
        default: [],
    },
}, {
    timestamps: true,
});

const Launch = mongoose.model("Launch", launchSchema);

export default Launch;
