"use client";

import MeetingForm from "@/app/Components/Scheduler/MeetingForm";

export default function Scheduler() {
  return (
    <div className="flex min-h-screen min-w-full flex-col">
      <div className="mx-auto flex w-full max-w-7xl grow flex-col items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <MeetingForm />
      </div>
    </div>
  );
}
