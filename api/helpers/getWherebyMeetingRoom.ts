
import { getRoomURL } from '@/app/api/meetings/whereby/whereby';
import { DecodedMeeting } from '@/types/meetingData';

export async function getWherebyMeetingRoom(decodedMeeting: DecodedMeeting): Promise<any> {
    // getRoomURL returns a NextResponse, but we want the data object
    const response = await getRoomURL(decodedMeeting);
    // If getRoomURL returns a NextResponse, extract the JSON data
    if (response && typeof response.json === 'function') {
        const data = await response.json();
        return data;
    }
    // If getRoomURL returns a plain object, just return it
    return response;
}