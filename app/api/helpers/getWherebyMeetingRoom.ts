import { wherebyService } from '@/app/api/services/whereby/whereby.service';
import { DecodedMeeting } from '@/lib/types/decodedMeeting.types';

export async function getWherebyMeetingRoom(decodedMeeting: DecodedMeeting) {
    // wherebyService returns a NextResponse, but we want the data object
    const response = await wherebyService(decodedMeeting);
    // If wherebyService returns a NextResponse, extract the JSON data
    if (response && typeof response.json === 'function') {
        return await response.json();
    }
    // If wherebyService returns a plain object, just return it
    return response;
}