import mongoose, { Schema, model, models } from "mongoose";
import { PortfolioData } from "@/app/types/portfolio";

const ProfileSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
            default: "My Profile",
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
                phoneNo: String,
                profilePhoto: String,
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
                    image: String,
                },
            ],
            skills: Schema.Types.Mixed,
            experience: [
                {
                    company: String,
                    position: String,
                    startDate: String,
                    endDate: String,
                    description: String,
                    location: String,
                    current: Boolean,
                },
            ],
            certificates: [
                {
                    name: String,
                    provider: String,
                    issuedOn: String,
                    certificateId: String,
                    certificateUrl: String,
                },
            ],
        },
    },
    {
        timestamps: true,
    }
);

const Profile = models.Profile || model("Profile", ProfileSchema);

export default Profile;

