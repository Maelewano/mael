"use client"

import {
    Shield,
    FileText,
    Clock,
    CheckCircle,
    Play,
    Star,
    Lock,
} from "lucide-react";
import { useState } from "react";

import Footer from "@/app/Components/Footer/Footer";
import Navbar from "@/app/Components/Navbar/Navbar";
import { Badge } from "@/app/Components/UI/badge";
import { Button } from "@/app/Components/UI/button";
import { Card } from "@/app/Components/UI/card";


export default function HomePage() {
    const [isPlayingDemo, setIsPlayingDemo] = useState(false);

    const handlePlayDemo = () => {
        setIsPlayingDemo(true);
        // Demo logic would go here
        setTimeout(() => setIsPlayingDemo(false), 3000);
    };

    return (
        <div className="flex min-h-screen min-w-full flex-col">
            <Navbar />
            <main className="flex grow items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
                <section className="relative w-full overflow-hidden bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50 py-6 dark:from-gray-950/50 dark:via-gray-900/50 dark:to-gray-800/50 lg:py-16">
                    {/* Enhanced Background Pattern */}
                    <div className="absolute inset-0 opacity-20 dark:opacity-10">
                        <div className="size-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800"
                             style={{
                                 backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.4) 1px, transparent 0)`,
                                 backgroundSize: '20px 20px'
                             }}
                        />
                    </div>

                    {/* Subtle overlay for better text contrast */}
                    <div className="absolute inset-0 bg-white/30 dark:bg-gray-900/30" />

                    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            {/* Left Column - Content */}
                            <div className="space-y-8">
                                {/* Enhanced Badge */}
                                <Badge variant="secondary" className="w-fit border border-blue-200 bg-blue-50 text-blue-700 shadow-sm hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-900/50">
                                    <Shield className="mr-1 size-3 text-green-400" />
                                    Trusted by Legal Professionals
                                </Badge>

                                {/* Main Heading with better contrast */}
                                <div className="space-y-4">
                                    <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight text-gray-900 dark:text-gray-50 md:text-5xl xl:text-6xl">
                                        Mael
                                    </h1>
                                    <p className="mb-6 max-w-2xl font-semibold text-gray-700 dark:text-gray-200 md:text-lg lg:mb-8 lg:text-xl">
                                        Maelewano is poised to emerge as a transformative tool in communication and contracts.
                                        It designed to meet the increasing demand for secure video conferencing,
                                        consultations and document signing solutions.
                                    </p>
                                </div>

                                {/* Enhanced Feature Highlights */}
                                <div className="flex flex-wrap gap-6">
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="size-5 text-green-600 dark:text-green-400" />
                                        <span className="font-medium text-gray-800 dark:text-gray-200">Video Conferencing</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="size-5 text-green-600 dark:text-green-400" />
                                        <span className="font-medium text-gray-800 dark:text-gray-200">Legally-Binding E-Signature</span>
                                    </div>
                                </div>

                                {/* Enhanced Action Buttons */}
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="border-gray-300 bg-white/80 px-8 py-3 text-lg text-gray-700 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:shadow-lg dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-200 dark:hover:border-gray-500 dark:hover:bg-gray-700"
                                        onClick={handlePlayDemo}
                                        disabled={isPlayingDemo}
                                    >
                                        <Play className="mr-2 size-4" />
                                        {isPlayingDemo ? "Playing Demo..." : "Watch Demo"}
                                    </Button>
                                </div>

                                {/* Trust Indicators */}
                                <div className="flex items-center space-x-6 pt-4">
                                    <div className="flex items-center space-x-1">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star key={star} className="size-4 fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400" />
                                            ))}
                                        </div>
                                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">4.9/5 from 200+ reviews</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Interactive Demo */}
                            <div className="relative">
                                {/* Main Demo Card */}
                                <Card className="relative overflow-hidden border border-gray-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/90 dark:shadow-2xl">
                                    <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-400 dark:to-indigo-400" />
                                    {/* Demo Header */}
                                    <div className="mb-6 flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 shadow-sm dark:from-blue-500 dark:to-blue-600">
                                                <FileText className="size-4 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900 dark:text-gray-50">Client Agreement.pdf</h3>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">Ready for signature</p>
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="border border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300">
                                            <Lock className="mr-1 size-3" />
                                            Secure
                                        </Badge>
                                    </div>
                                    {/* Progress Steps */}
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex size-6 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-sm dark:from-green-500 dark:to-green-600">
                                                <CheckCircle className="size-4 text-white" />
                                            </div>
                                            <span className="text-sm text-gray-800 dark:text-gray-200">Document uploaded and verified</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="flex size-6 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-sm dark:from-green-500 dark:to-green-600">
                                                <CheckCircle className="size-4 text-white" />
                                            </div>
                                            <span className="text-sm text-gray-800 dark:text-gray-200">Client identity confirmed</span>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="flex size-6 animate-pulse items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm dark:from-blue-500 dark:to-blue-600">
                                                <Clock className="size-4 text-white" />
                                            </div>
                                            <span className="text-sm text-gray-800 dark:text-gray-200">Awaiting e-signature</span>
                                        </div>
                                    </div>
                                    {/* Action Button */}
                                    <Button
                                        className="mt-6 w-full border-0 bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 dark:from-blue-500 dark:to-blue-600 dark:shadow-blue-900/30 dark:hover:from-blue-600 dark:hover:to-blue-700 dark:hover:shadow-blue-800/40 dark:disabled:from-gray-600 dark:disabled:to-gray-700"
                                        disabled={isPlayingDemo}
                                    >
                                        {isPlayingDemo ? "Processing..." : "Sign Document"}
                                    </Button>
                                </Card>
                                {/* Floating Stats */}
                                <div className="absolute -right-6 -bottom-4 rounded-lg border border-gray-200 bg-white/90 p-4 shadow-lg backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800/90 dark:shadow-2xl">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">99.9%</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-300">Uptime</div>
                                    </div>
                                </div>
                                <div className="absolute -bottom-4 -left-4 rounded-lg border border-gray-200 bg-white/90 p-4 shadow-lg backdrop-blur-sm dark:border-gray-600 dark:bg-gray-800/90 dark:shadow-2xl">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">30s</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-300">Avg. Sign Time</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
