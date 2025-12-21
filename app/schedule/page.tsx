"use client";

import MeetingForm from "@/app/Components/Scheduler/MeetingForm";

export default function Scheduler() {
  return (
    <div className="flex min-h-screen min-w-full flex-col">
      <div className="mx-auto flex w-full max-w-7xl grow flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Schedule a Meeting
          </h2>
          <div className="mx-auto m-4 h-1 w-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          <p className="mt-2 text-gray-600">
            Fill out the details below to create your meeting
          </p>
        </div>
        <MeetingForm />
      </div>
    </div>
  );
}
