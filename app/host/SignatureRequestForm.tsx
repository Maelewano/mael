'use client'

import { PiFrameCornersBold } from "react-icons/pi";

import EmbedRequestForm from '@/app/pages/components/Dropbox/EmbeddedSignerView';

export default function SignatureRequestForm() {
    return (
        <div className="h-screen">
            <div className="flex flex-row items-center justify-center gap-4">
                <PiFrameCornersBold size={30} />
                <h2 className="text-2xl font-bold">Embedded Request</h2>
            </div>
            <EmbedRequestForm />
        </div>
    )
}