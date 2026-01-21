import mongoose from 'mongoose';
import { env } from '@/env.mjs';
import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/utils/logger';

import { getWherebyMeetingRoom } from '@/app/api/helpers/getWherebyMeetingRoom';
import { errorResponse, successResponse } from '@/app/api/helpers/responseHelper';
import { URLType } from '@/lib/types/urlType';
import { decodeToken } from '@/lib/utils/tokenUtilities';
import MeetingRoom from '@/lib/types/meetingRoom.types';

export async function POST(request: NextRequest) {
    try {
        const token = await (await request.json());
        logger.debug('[createMeetingRoom] Received token:', token);
        if (!token) {
            logger.error('[createMeetingRoom] No token found in query params', { url: request.url });
            return NextResponse.json({ error: "Token is required" }, { status: 400 });
        }


        const decodedMeeting = decodeToken(token);
        if (!decodedMeeting) {
            logger.error('[createMeetingRoom] Decoded meeting is null or invalid', { token });
            return errorResponse("Error while decoding token");
        }

        // Connect to MongoDB if not already connected
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(env.MONGODB_URI!);
        }

        // Check if room exists for this meetingId
        const meetingId = decodedMeeting.id;
        let room;
        try {
            room = await MeetingRoom.findOne({ meetingId });
            logger.debug('[createMeetingRoom] Room found:', room);
        } catch (err) {
            logger.error('[createMeetingRoom] Error querying MeetingRoom:', err);
            return errorResponse("Database error");
        }

        if (decodedMeeting.urlType === URLType.MODERATOR) {
            logger.debug('[createMeetingRoom] Token is for MODERATOR (host)');
            // Host: create room if not exists
            if (!room) {
                decodedMeeting.meetingPassword = crypto.randomUUID().split("-")[0];
                try {
                    const wherebyData = await getWherebyMeetingRoom(decodedMeeting);
                    logger.debug('[createMeetingRoom] Whereby API data:', wherebyData);
                    // Save room info to DB
                    const newRoom = new MeetingRoom({
                        meetingId,
                        moderatorEmail: decodedMeeting.email,
                        roomUrl: wherebyData.data.roomUrl || '',
                        hostRoomUrl: wherebyData.data.hostRoomUrl || '',
                        meetingStartDate: decodedMeeting.meetingStartDate,
                        meetingEndDate: decodedMeeting.meetingEndDate,
                        meetingPassword: decodedMeeting.meetingPassword,
                        tokenExpiryDate: decodedMeeting.tokenExpiryDate,
                    });
                    await newRoom.save();
                    logger.info('[createMeetingRoom] Meeting room created and saved:', newRoom);
                    // If wherebyService returned a wrapped response (success/status/data),
                    // unwrap the inner `data` so clients receive the room info directly.
                    const payload = wherebyData && typeof wherebyData === 'object' && 'data' in wherebyData
                        ? (wherebyData as any).data
                        : wherebyData;
                    return successResponse(payload, 200, 'Meeting room created');
                } catch (error) {
                    logger.error('[createMeetingRoom] Error creating/saving meeting room:', error);
                    return errorResponse('Failed to create meeting room');
                }
            } else {
                // Room already exists, return info
                logger.info('[createMeetingRoom] Room already exists for host, returning existing room.');
                return successResponse(room, 200, 'Meeting room already exists');
            }
        } else if (decodedMeeting.urlType === URLType.PARTICIPANT) {
            logger.debug('[createMeetingRoom] Token is for PARTICIPANT (join)');
            // Participant: can only join if room exists
            if (!room) {
                // Room not created yet
                logger.info('[createMeetingRoom] No room found for participant, meeting not started yet.');
                return errorResponse('The meeting has not started yet. Please return at the scheduled time.');
            } else {
                // Room exists, return info
                logger.info('[createMeetingRoom] Room found for participant, returning room info.');
                return successResponse(room, 200, 'Meeting room found');
            }
        } else {
            logger.error('[createMeetingRoom] Invalid urlType in decoded token:', decodedMeeting.urlType);
            return errorResponse('Invalid token type');
        }
    } catch (err) {
        logger.error('[createMeetingRoom] Unexpected error:', err);
        return errorResponse('Unexpected error in meeting room API');
    }
}