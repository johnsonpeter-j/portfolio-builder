import mongoose, { Schema, model, models } from "mongoose";

const PortfolioSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        templateId: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            unique: true,
            required: true,
        },
        title: {
            type: String,
            default: "My Portfolio",
        },
        description: {
            type: String,
        },
        content: {
            personalInfo: {
                name: String,
                title: String,
                bio: String,
                email: String,
                profilePhoto: String, // Profile photo URL
                socials: [
                    {
                        platform: String,
                        link: String,
                    },
                ],
            },
            projects: [
                {
                    title: String,
                    description: String,
                    link: String,
                    githubLink: String,
                    image: String, // New field for project images
                },
            ],
            skills: Schema.Types.Mixed, // Can be string[], object[], etc.
            experience: [
                {
                    company: String,
                    position: String,
                    startDate: String,
                    endDate: String, // Optional for current positions
                    description: String,
                    location: String,
                    current: Boolean, // True if this is the current position
                },
            ],
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        hasBeenEdited: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Portfolio = models.Portfolio || model("Portfolio", PortfolioSchema);

export default Portfolio;
