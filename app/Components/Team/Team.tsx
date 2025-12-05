"use client";

import TeamMemberCard from "./TeamMemberCard";
import {Badge} from "@/app/Components/UI/badge";
import {teamMembers} from "@/lib/types/team";

export default function Team() {
    return (
        <>
                <section id="team" className="relative w-full overflow-hidden py-3 lg:py-8">
                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="mb-16 text-center">
                            <Badge
                                variant="secondary"
                                className="mb-4 bg-blue-100 text-blue-700"
                            >
                                Our Team
                            </Badge>
                            <h2 className="mb-4 text-3xl font-bold text-gray-900 lg:text-4xl">
                                Meet the Team
                            </h2>
                            <p className="mx-auto max-w-3xl text-xl text-gray-600">
                                Our team has designed <strong>Mael</strong> to deliver a secure and efficient platform for conferencing and document signing.
                            </p>
                        </div>

                        {/* Team Grid */}
                        <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                            {teamMembers.map((member, index) => (
                                <TeamMemberCard
                                    key={member.name || index}
                                    member={member}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                </section>
        </>
    );
}