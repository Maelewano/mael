import { CheckCircle, Lock } from 'lucide-react';
import { FaShieldAlt, FaUsers, FaClock, FaCheckCircle } from 'react-icons/fa'; // Import icons

import { Badge } from "@/app/Components/UI/badge";

const securityFeatures = [
    "End-to-end encryption",
    "Audit trails for all actions",
    "Compliance monitoring",
];

export default function Features() {
    return (
        <>
                <section id="features" className="relative w-full overflow-hidden py-3 lg:py-8">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                        <div
                            className="size-full bg-gradient-to-br from-blue-50 to-indigo-50"
                            style={{
                                backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.4) 1px, transparent 0)`,
                                backgroundSize: "20px 20px",
                            }}
                        />
                    </div>

                    {/* Section Header */}
                    <div className="mb-16 text-center">
                        <Badge variant="secondary" className="mb-4 bg-blue-100 text-blue-700">
                            <CheckCircle className="mr-1 size-3 text-red-500" />
                            Powerful Features
                        </Badge>
                        <p className="mx-auto max-w-3xl text-xl text-gray-600">
                            By leveraging modern technologies and intuitive design, Mael provides a robust platform that ensures your documents are handled with the utmost confidentiality and professionalism.
                        </p>
                    </div>

                    <main className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                <div className="mb-4 flex items-center justify-between">
                                    <FaShieldAlt className="mr-3 text-2xl text-emerald-600" />
                                    <h3 className="text-xl font-semibold text-gray-800">Secure</h3>
                                </div>
                                <p className="text-gray-600">
                                    We employ state-of-the-art encryption and authentication protocols to safeguard your sensitive documents.
                                </p>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                <div className="mb-4 flex items-center justify-between">
                                    <FaUsers className="mr-3 text-2xl text-indigo-600" />
                                    <h3 className="text-xl font-semibold text-gray-800">Collaborate</h3>
                                </div>
                                <p className="text-gray-600">
                                    Facilitate seamless collaboration between all parties involved, ensuring everyone stays informed and aligned.
                                </p>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                <div className="mb-4 flex items-center justify-between">
                                    <FaClock className="mr-3 text-2xl text-yellow-600" />
                                    <h3 className="text-xl font-semibold text-gray-800">Streamlined</h3>
                                </div>
                                <p className="text-gray-600">
                                    Reduce turnaround times with our streamlined e-signature and document sharing processes.
                                </p>
                            </div>

                            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-lg">
                                <div className="mb-4 flex items-center justify-between">
                                    <FaCheckCircle className="mr-3 text-2xl text-red-600" />
                                    <h3 className="text-xl font-semibold text-gray-800">Compliance</h3>
                                </div>
                                <p className="text-gray-600">
                                    Built in compliance with relevant laws, regulations and standards for a secure and compliant experience.
                                </p>
                            </div>
                        </div>
                    </main>

                </section>
        </>
    );
}