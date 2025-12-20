"use client";

import {
  Shield,
  FileText,
  Clock,
  CheckCircle,
  Star,
  Lock,
  Play,
} from "lucide-react";

import { useState } from "react";

import { Badge } from "@/app/Components/UI/badge";
import { Button } from "@/app/Components/UI/button";
import { Card } from "@/app/Components/UI/card";
import Team from "@/app/Components/Team/Team";
import Features from "@/app/Components/Features/Features";

export default function HomePage() {
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);

  const handlePlayDemo = () => {
    setIsPlayingDemo(true);
    // Demo logic would go here
    setTimeout(() => setIsPlayingDemo(false), 3000);
  };

  return (
    <div className="flex min-h-screen min-w-full flex-col">
      <main className="flex grow flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <section className="relative w-full overflow-hidden py-2 lg:py-6">
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Hero Content */}
            <div className="mb-16 text-center">
              {/*  Badge */}
              <Badge
                variant="secondary"
                className="mb-6 w-fit border border-blue-200 bg-blue-50 text-blue-700 shadow-sm hover:bg-blue-100"
              >
                <Shield className="mr-1 size-3 text-green-500" />
                Trusted by 500+ Users
              </Badge>

              {/* Main Heading with better contrast */}
              <div className="mb-8 space-y-4">
                <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl xl:text-6xl">
                  Mael
                </h1>
                <p className="mx-auto max-w-3xl text-lg font-semibold text-gray-700 md:text-xl lg:text-2xl">
                  Mael is a platform designed to meet the increasing demand
                  for secure, efficient, and remote video conferencing and
                  document signing solutions.
                </p>
              </div>

              {/*  Feature Highlights */}
              <div className="mb-8 flex flex-wrap justify-center gap-8">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="size-5 text-green-600" />
                  <span className="font-medium text-gray-800">
                    Video Conferencing
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="size-5 text-green-600" />
                  <span className="font-medium text-gray-800">
                    Legally-Binding E-Signature
                  </span>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mb-12 flex justify-center">
                <div className="flex items-center space-x-1">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="size-4 fill-yellow-500 text-yellow-500"
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    4.9/5 from 200+ reviews
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Demo */}
            <div className="mx-auto max-w-4xl">
              <div className="relative">
                {/* Main Demo Card */}
                <Card className="relative overflow-hidden border border-gray-200 bg-white/90 p-6 shadow-xl backdrop-blur-sm">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                  {/* Demo Header */}
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700 shadow-sm">
                        <FileText className="size-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Client Agreement.pdf
                        </h3>
                        <p className="text-sm text-gray-600">
                          Ready for signature
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="border border-green-200 bg-green-50 text-green-700"
                    >
                      <Lock className="mr-1 size-3" />
                      Secure
                    </Badge>
                  </div>
                  {/* Progress Steps */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex size-6 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-sm">
                        <CheckCircle className="size-4 text-white" />
                      </div>
                      <span className="text-sm text-gray-800">
                        Document uploaded and verified
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex size-6 items-center justify-center rounded-full bg-gradient-to-r from-green-500 to-green-600 shadow-sm">
                        <CheckCircle className="size-4 text-white" />
                      </div>
                      <span className="text-sm text-gray-800">
                        Client identity confirmed
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex size-6 animate-pulse items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm">
                        <Clock className="size-4 text-white" />
                      </div>
                      <span className="text-sm text-gray-800">
                        Awaiting e-signature
                      </span>
                    </div>
                  </div>
                  {/* Action Button */}
                  <div className="flex justify-center">
                    <Button
                      className="mt-6 border-0 bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:from-indigo-700 hover:to-indigo-800 hover:shadow-xl hover:-translate-y-0.5 hover:cursor-pointer disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed disabled:transform-none"
                      onClick={handlePlayDemo}
                      disabled={isPlayingDemo}
                    >
                      <Play className="mr-2 size-4" />
                      {isPlayingDemo ? "Processing..." : "Sign Document"}
                    </Button>
                  </div>
                </Card>
                {/* Floating Stats */}
                <div className="absolute -right-8 -top-14 rounded-lg border border-gray-200 bg-white/90 p-4 shadow-lg backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      99.9%
                    </div>
                    <div className="text-xs text-gray-600">
                      Uptime
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-8 rounded-lg border border-gray-200 bg-white/90 p-4 shadow-lg backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      30s
                    </div>
                    <div className="text-xs text-gray-600">
                      Avg. Sign Time
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Team />
        <Features />
      </main>
    </div>
  );
}
