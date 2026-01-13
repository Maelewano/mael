"use client";

import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import { showToast } from "@/app/Components/UI/toast";
import { createMeetingLink } from "@/lib/actions/meetings.actions";
import { MeetingData, Participant } from "@/lib/types/meetingData.types";

export default function MeetingForm() {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<MeetingData>({
    defaultValues: {
      moderator: {
        email: "",
        phoneNumber: "",
      },
      participants: [{ email: "", phoneNumber: "" } as Participant],
      timeDetails: {
        meetingStartTime: "",
        meetingEndTime: "",
      },
      isLocked: true,
      summary: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "participants",
  });

  const onSubmit = async (data: MeetingData) => {
    setIsLoading(true);

    try {
      console.log("Sending request to API:", JSON.stringify(data));

      // Call API to create meeting
      data.meetingId = crypto.randomUUID().split("-")[0];
      const result = await createMeetingLink(data);

      console.log("API response:", result);

      // Check if the API call was successful
      if (result.error) {
        throw new Error(result.error || "Failed to create meeting");
      }

      console.log("Meeting created successfully:", result);

      showToast.success({
        title: "Meeting Created",
        message: "Your meeting has been scheduled successfully",
        variant: "success",
      });

      // Reset form after successful submission
      reset();
      
      // Scroll to top of the page to show the reset form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Error creating meeting:", error);

      // Get the most descriptive error message possible
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred while creating the meeting";

      showToast.error({
        title: "Error Creating Meeting",
        message: errorMessage,
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addParticipant = () => {
    append({ email: "", phoneNumber: "" } as Participant);
  };

  return (
    <div className="container mx-auto w-full">
      <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-xl transition-all duration-300 hover:shadow-2xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8 md:px-4 lg:px-8"
        >
          {/* Moderator Information */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Moderator Information
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("moderator.email", {
                    required: "Moderator email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="email@example.com"
                />
                {errors.moderator?.email && (
                  <span className="mt-1 text-sm text-red-500">
                    {errors.moderator.email.message}
                  </span>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...register("moderator.phoneNumber", {
                    required: "Moderator phone number is required",
                    pattern: {
                      value: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
                      message: "Phone format: 123-456-7890",
                    },
                  })}
                  className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="123-456-7890"
                />
                {errors.moderator?.phoneNumber && (
                  <span className="mt-1 text-sm text-red-500">
                    {errors.moderator.phoneNumber.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Participants */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Participants
              </h3>
              <button
                type="button"
                onClick={addParticipant}
                className="flex items-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-indigo-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Plus className="mr-1 size-4" />
                Add Participant
              </button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h4 className="text-14-medium text-gray-800">
                    Participant {index + 1}
                  </h4>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="flex items-center text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      {...register(`participants.${index}.email`, {
                        required: "Participant email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      })}
                      className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="email@example.com"
                    />
                    {errors.participants?.[index]?.email && (
                      <span className="mt-1 text-sm text-red-500">
                        {errors.participants[index]?.email?.message}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      {...register(`participants.${index}.phoneNumber`, {
                        required: "Participant phone number is required",
                        pattern: {
                          value: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
                          message: "Phone format: 123-456-7890",
                        },
                      })}
                      className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="123-456-7890"
                    />
                    {errors.participants?.[index]?.phoneNumber && (
                      <span className="mt-1 text-sm text-red-500">
                        {errors.participants[index]?.phoneNumber?.message}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Meeting Summary */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Meeting Summary
            </h3>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Summary
              </label>
              <textarea
                {...register("summary", {
                  required: "Meeting summary is required",
                })}
                className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter a brief summary of the meeting purpose"
                rows={3}
              />
              {errors.summary && (
                <span className="mt-1 text-sm text-red-500">
                  {errors.summary.message}
                </span>
              )}
            </div>
          </div>

          {/* Meeting Date and Time */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Meeting Date and Time
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Start Date and Time
                </label>
                <input
                  type="datetime-local"
                  {...register("timeDetails.meetingStartTime", {
                    required: "Start date and time is required",
                  })}
                  className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.timeDetails?.meetingStartTime && (
                  <span className="mt-1 text-sm text-red-500">
                    {errors.timeDetails.meetingStartTime.message}
                  </span>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  End Date and Time
                </label>
                <input
                  type="datetime-local"
                  {...register("timeDetails.meetingEndTime", {
                    required: "End date and time is required",
                    validate: (value, formValues) =>
                      new Date(value) >
                        new Date(formValues.timeDetails.meetingStartTime) ||
                      "End time must be after start time",
                  })}
                  className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.timeDetails?.meetingEndTime && (
                  <span className="mt-1 text-sm text-red-500">
                    {errors.timeDetails.meetingEndTime.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Room Lock Settings */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Room Access Settings
            </h3>

            <div className="mb-4">
              <p className="mb-2 text-sm text-gray-600">
                Lock the room for participants? (Host will always have access)
              </p>

              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="locked"
                    {...register("isLocked", {
                      setValueAs: () => true,
                    })}
                    defaultChecked
                    className="size-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="locked"
                    className="ml-2 block text-sm font-medium text-gray-700"
                  >
                    Locked (Participants wait until admitted)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    id="unlocked"
                    {...register("isLocked", {
                      setValueAs: () => false,
                    })}
                    className="size-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="unlocked"
                    className="ml-2 block text-sm font-medium text-gray-700"
                  >
                    Unlocked (Participants join directly)
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="min-w-[200px] rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:from-indigo-600 hover:to-indigo-700 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none disabled:shadow-md"
            >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 inline size-4 animate-spin" />
                Scheduling...
              </>
            ) : (
              "Schedule Meeting"
            )}
          </button>
          </div>
        </form>
      </div>
    </div>
  );
}
