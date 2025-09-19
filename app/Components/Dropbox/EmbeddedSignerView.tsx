'use client'

/** This page is for public meetings, accessible to everyone
 * It contains a form for moderators to schedule a meeting
 * and send the meeting link to all participants.
 */

import MeetingForm from '@/app/Components/Scheduler/MeetingForm';
import Footer from '@/app/Components/Footer/Footer';
import Navbar from '@/app/Components/Navbar/Navbar';

export default function PublicMeetingPage() {
    return (
        <div className="flex min-h-screen min-w-full flex-col">
            <Navbar />
            <div className="mx-auto flex w-full max-w-7xl grow flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
                <MeetingForm />
            </div>
            <Footer />
        </div>
    )
}