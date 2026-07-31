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
    productImage: {
        fileName: { type: String, default: "" },
        originalName: { type: String, default: "" },
        mimeType: { type: String, default: "" },
        size: { type: Number, default: 0 },
        url: { type: String, default: "" },
        uploadedBy: { type: String, default: "" },
        uploadedAt: { type: Date, default: null },
    },
    assets: {
        type: [{
            fileName: { type: String, required: true },
            originalName: { type: String, required: true },
            mimeType: { type: String, required: true },
            size: { type: Number, required: true },
            url: { type: String, required: true },
            uploadedBy: { type: String, default: "" },
            uploadedAt: { type: Date, default: Date.now },
        }],
        default: [],
    },
    comments: {
        type: [{
            author: String,
            authorId: String,
            text: String,
            createdAt: {
                type: Date,
                default: Date.now,
            },
        }],
        default: [],
    },
    activityLog: {
        type: [{
            action: { type: String, required: true },
            description: { type: String, required: true },
            performedBy: {
                _id: { type: String, default: "" },
                name: { type: String, default: "" },
            },
            createdAt: { type: Date, default: Date.now },
        }],
        default: [],
    },
}, {
    timestamps: true,
});

const Launch = mongoose.model("Launch", launchSchema);

export default Launch;
