import mongoose, { Schema, Document } from 'mongoose';

export interface IMeetingRoom extends Document {
    meetingId: string;
    moderatorEmail: string;
    roomUrl: string;
    hostRoomUrl?: string;
    meetingStartDate: string;
    meetingEndDate: string;
    meetingPassword: string;
    tokenExpiryDate: string;
    createdAt?: Date;
}

const MeetingRoomSchema: Schema = new Schema({
    meetingId: { type: String, required: true, unique: true },
    moderatorEmail: { type: String, required: true },
    roomUrl: { type: String, required: true },
    hostRoomUrl: { type: String },
    meetingStartDate: { type: String, required: true },
    meetingEndDate: { type: String, required: true },
    meetingPassword: { type: String, required: true },
    tokenExpiryDate: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.MeetingRoom || mongoose.model<IMeetingRoom>('MeetingRoom', MeetingRoomSchema);
