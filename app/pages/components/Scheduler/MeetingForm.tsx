'use client'

import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'

import { showToast } from '@/components/ui/toast'
import { createMeetingLink } from '@/lib/actions/workflow.actions';
import { MeetingData, Participant } from '@/types/meetingData';


export default function MeetingForm() {
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset
    } = useForm<MeetingData>({
        defaultValues: {
            moderator: {
                email: '',
                phoneNumber: ''
            },
            participants: [
                {email: '', phoneNumber: ''} as Participant
            ],
            timeDetails: {
                meetingStartTime: '',
                meetingEndTime: '',
            },
            isLocked: true,
            summary: ''
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'participants'
    })

    const onSubmit = async (data: MeetingData) => {
        setIsLoading(true)

        try {
            console.log("Sending request to API:", JSON.stringify(data));

            // Call API to create meeting

            data.meetingId = crypto.randomUUID().split("-")[0];
            const response = await createMeetingLink(data);

            console.log("API response status:", response.status);

            // Handle non-OK responses
            if (!response.ok) {
                // Try to get error details from response
                // let errorMessage = 'Failed to create meeting';

                // try {
                //   const errorData = await response.json();
                //   console.error("API error response:", errorData);
                //   errorMessage = errorData.details || errorData.error || errorMessage;
                // } catch (parseError) {
                //   // If we can't parse JSON, try to get text
                //   // const errorText = await response.text().catch(() => '');
                //   // console.error("API error text:", errorText || errorMessage);
                //   console.error("API error text:", parseError || errorMessage);
                // }
            }

            // Parse successful response
            // const result = await response.json().catch((error: any) => {
            //   console.error("Error parsing success response:", error);
            //   throw new Error("Invalid response from server");
            // });

            console.log('Meeting created successfully:');

            showToast.success({
                title: 'Meeting Created',
                message: 'Your meeting has been scheduled successfully',
                variant: 'success'
            })

            // Reset form after successful submission
            reset()

        } catch (error) {
            console.error('Error creating meeting:', error);

            // Get the most descriptive error message possible
            const errorMessage = error instanceof Error
                ? error.message
                : 'An unknown error occurred while creating the meeting';

            showToast.error({
                title: 'Error Creating Meeting',
                message: errorMessage,
                variant: 'error'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const addParticipant = () => {
        append({email: '', phoneNumber: ''} as Participant);
    }

    return (
        <div className="container mx-auto w-full">
            <div className="rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
                <h2 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">Schedule a Meeting</h2>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8 md:px-4 lg:px-8">
                    {/* Moderator Information */}
                    <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-700">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Moderator Information</h3>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    {...register('moderator.email', {
                                        required: 'Moderator email is required',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Invalid email address'
                                        }
                                    })}
                                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                                    placeholder="email@example.com"
                                />
                                {errors.moderator?.email && (
                                    <span className="mt-1 text-sm text-red-500">{errors.moderator.email.message}</span>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    {...register('moderator.phoneNumber', {
                                        required: 'Moderator phone number is required',
                                        pattern: {
                                            value: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
                                            message: 'Phone format: 123-456-7890'
                                        }
                                    })}
                                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                                    placeholder="123-456-7890"
                                />
                                {errors.moderator?.phoneNumber && (
                                    <span className="mt-1 text-sm text-red-500">{errors.moderator.phoneNumber.message}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Participants */}
                    <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-700">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Participants</h3>
                            <button
                                type="button"
                                onClick={addParticipant}
                                className="flex items-center rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
                            >
                                <Plus className="mr-1 size-4" />
                                Add Participant
                            </button>
                        </div>

                        {fields.map((field, index) => (
                            <div key={field.id} className="mb-4 rounded-md border border-gray-200 p-4 dark:border-gray-600">
                                <div className="mb-2 flex items-center justify-between">
                                    <h4 className="text-14-medium text-gray-800 dark:text-gray-200">Participant {index + 1}</h4>
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
                                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            {...register(`participants.${index}.email`, {
                                                required: 'Participant email is required',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: 'Invalid email address'
                                                }
                                            })}
                                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                                            placeholder="email@example.com"
                                        />
                                        {errors.participants?.[index]?.email && (
                                            <span className="mt-1 text-sm text-red-500">{errors.participants[index]?.email?.message}</span>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            {...register(`participants.${index}.phoneNumber`, {
                                                required: 'Participant phone number is required',
                                                pattern: {
                                                    value: /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/,
                                                    message: 'Phone format: 123-456-7890'
                                                }
                                            })}
                                            className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                                            placeholder="123-456-7890"
                                        />
                                        {errors.participants?.[index]?.phoneNumber && (
                                            <span className="mt-1 text-sm text-red-500">{errors.participants[index]?.phoneNumber?.message}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Meeting Summary */}
                    <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-700">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Meeting Summary</h3>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                Summary
                            </label>
                            <textarea
                                {...register('summary', {
                                    required: 'Meeting summary is required'
                                })}
                                className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                                placeholder="Enter a brief summary of the meeting purpose"
                                rows={3}
                            />
                            {errors.summary && (
                                <span className="mt-1 text-sm text-red-500">{errors.summary.message}</span>
                            )}
                        </div>
                    </div>

                    {/* Meeting Date and Time */}
                    <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-700">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Meeting Date and Time</h3>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    Start Date and Time
                                </label>
                                <input
                                    type="datetime-local"
                                    {...register('timeDetails.meetingStartTime', {
                                        required: 'Start date and time is required'
                                    })}
                                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                                />
                                {errors.timeDetails?.meetingStartTime && (
                                    <span className="mt-1 text-sm text-red-500">{errors.timeDetails.meetingStartTime.message}</span>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    End Date and Time
                                </label>
                                <input
                                    type="datetime-local"
                                    {...register('timeDetails.meetingEndTime', {
                                        required: 'End date and time is required',
                                        validate: (value, formValues) =>
                                            new Date(value) > new Date(formValues.timeDetails.meetingStartTime) ||
                                            'End time must be after start time'
                                    })}
                                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                                />
                                {errors.timeDetails?.meetingEndTime && (
                                    <span className="mt-1 text-sm text-red-500">{errors.timeDetails.meetingEndTime.message}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Room Lock Settings */}
                    <div className="rounded-md bg-gray-50 p-4 dark:bg-gray-700">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Room Access Settings</h3>

                        <div className="mb-4">
                            <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">
                                Lock the room for participants? (Host will always have access)
                            </p>

                            <div className="flex items-center space-x-6">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="locked"
                                        {...register('isLocked', {
                                            setValueAs: () => true
                                        })}
                                        defaultChecked
                                        className="size-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="locked" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Locked (Participants wait until admitted)
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="unlocked"
                                        {...register('isLocked', {
                                            setValueAs: () => false
                                        })}
                                        className="size-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="unlocked" className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Unlocked (Participants join directly)
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-2 rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 inline size-4 animate-spin" />
                                Scheduling...
                            </>
                        ) : 'Schedule Meeting'}
                    </button>
                </form>
            </div>
        </div>
    )
}