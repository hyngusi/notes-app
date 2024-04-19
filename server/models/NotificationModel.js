import mongoose, { model } from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        content: {
            type: String,
        },
    },
    { timestamps: true }
);

const NotificationModel = mongoose.model("notification", notificationSchema);

export default NotificationModel;
