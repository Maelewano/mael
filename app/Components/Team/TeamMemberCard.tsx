import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { FaLinkedin } from 'react-icons/fa6';

import { Button } from "@/app/Components/UI/button";
import { Card, CardContent } from "@/app/Components/UI/card";
import { TeamMember } from '@/lib/types/team';

interface TeamMemberCardProps {
    member: TeamMember;
    index: number;
}

export default function TeamMemberCard({ member, index }: TeamMemberCardProps) {
    return (
        <Card className="group overflow-hidden border-0 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl">
            <CardContent className="p-6">
                {/* Round Avatar */}
                <div className="relative mb-6 flex justify-center">
                    <div className="relative size-32 overflow-hidden rounded-full bg-gradient-to-br from-indigo-100 to-indigo-400 shadow-lg ring-4 ring-white transition-all duration-300 group-hover:ring-indigo-400">
                        <Image
                            src={member.imageUrl}
                            alt={member.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            priority={index === 0}
                            loading={index < 4 ? "eager" : "lazy"}
                            unoptimized
                        />
                    </div>
                    {/* Location Pin Button */}
                    <div className="absolute -bottom-2 -left-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <Button size="sm" variant="secondary" className="size-10 rounded-full p-0 shadow-lg" asChild>
                            <Link
                                href={`https://maps.google.com/?q=${encodeURIComponent(member.location)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`View ${member.location} on Google Maps`}
                                className="flex items-center justify-center"
                            >
                                <MapPin className="size-4 text-green-600" />
                            </Link>
                        </Button>
                    </div>
                    {/* LinkedIn Button */}
                    <div className="absolute -bottom-2 -right-2 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <Button size="sm" variant="secondary" className="size-10 rounded-full p-0 shadow-lg" asChild>
                            <Link
                                href={member.linkedinUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaLinkedin className="size-5 text-blue-600" />
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="text-center">
                    {/* Name & Title */}
                    <h2 className="mb-2 text-xl font-bold text-gray-900">
                        {member.name}
                    </h2>
                    <p className="mb-1 text-lg font-medium text-blue-600">
                        {member.title}
                    </p>

                    {/* Location */}
                    <div className="mb-3 flex items-center justify-center text-sm text-gray-500">
                        <MapPin className="mr-1 size-4" />
                        {member.location}
                    </div>

                    {/* Bio */}
                    <p className="mb-4 text-sm leading-relaxed text-gray-600">
                        {member.bio}
                    </p>

                    {/* LinkedIn Link (fallback for non-hover state) */}
                    <div className="mt-auto transition-opacity duration-300 group-hover:opacity-0">
                        <Link
                            href={member.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-sm text-blue-600 transition-colors duration-200 hover:text-blue-800"
                        >
                            <FaLinkedin className="text-lg" />
                            <span>Connect on LinkedIn</span>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}