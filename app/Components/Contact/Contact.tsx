"use client";

import {Mail, MessageSquare, Send, CheckCircle} from "lucide-react";
import {useState} from "react";

import {Badge} from "@/app/Components/UI/badge";
import {Button} from "@/app/Components/UI/button";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/app/Components/UI/dialog";
import {Input} from "@/app/Components/UI/input";
import {Label} from "@/app/Components/UI/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/app/Components/UI/select";
import {Textarea} from "@/app/Components/UI/textarea";
import {showToast} from "@/app/Components/UI/toast";

interface ContactModalProps {
    trigger?: React.ReactNode;
    defaultSubject?: string;
    defaultMessage?: string;
}

export default function ContactModal({
                                         trigger,
                                         defaultSubject = "",
                                         defaultMessage = ""
                                     }: ContactModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: defaultSubject,
        inquiryType: "",
        message: defaultMessage,
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // To be replaced with an API endpoint
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                showToast.success({
                    title: "Success",
                    message: "Message sent successfully! We'll get back to you soon."
                });
                setIsOpen(false);
                // Reset form
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    company: "",
                    subject: "",
                    inquiryType: "",
                    message: "",
                });
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            showToast.error({
                title: "Error",
                message: "Failed to send message. Please try again."
            });
            console.error('Contact form error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const defaultTrigger = (
        <Button className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
            <MessageSquare className="mr-2 size-4"/>
            Contact Us
        </Button>
    );

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || defaultTrigger}
            </DialogTrigger>
            <DialogContent
                className="max-h-[90vh] overflow-y-auto border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900 sm:max-w-[600px]">
                <DialogHeader>
                    <div className="flex items-center space-x-2">
                        <div
                            className="flex size-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50">
                            <Mail className="size-5 text-blue-600 dark:text-blue-400"/>
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                                Get in Touch
                            </DialogTitle>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as
                                possible.
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    {/* Contact Information */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                Full Name *
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter your full name"
                                className="w-full border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                Email Address *
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                placeholder="Enter your email"
                                className="w-full border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                Phone Number
                            </Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="Enter your phone number"
                                className="w-full border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                Company/Organization
                            </Label>
                            <Input
                                id="company"
                                type="text"
                                value={formData.company}
                                onChange={(e) => handleInputChange('company', e.target.value)}
                                placeholder="Enter your company name"
                                className="w-full border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                            />
                        </div>
                    </div>

                    {/* Inquiry Type */}
                    <div className="space-y-2">
                        <Label htmlFor="inquiryType" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            Inquiry Type
                        </Label>
                        <Select value={formData.inquiryType}
                                onValueChange={(value: string) => handleInputChange('inquiryType', value)}>
                            <SelectTrigger
                                className="border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400">
                                <SelectValue placeholder="Select inquiry type"
                                             className="text-gray-500 dark:text-gray-400"/>
                            </SelectTrigger>
                            <SelectContent className="border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
                                <SelectItem value="general"
                                            className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700">General
                                    Inquiry</SelectItem>
                                <SelectItem value="pricing"
                                            className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700">Pricing
                                    & Plans</SelectItem>
                                <SelectItem value="demo"
                                            className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700">Schedule
                                    a Demo</SelectItem>
                                <SelectItem value="support"
                                            className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700">Technical
                                    Support</SelectItem>
                                <SelectItem value="partnership"
                                            className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700">Partnership</SelectItem>
                                <SelectItem value="other"
                                            className="text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                        <Label htmlFor="subject" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            Subject *
                        </Label>
                        <Input
                            id="subject"
                            type="text"
                            required
                            value={formData.subject}
                            onChange={(e) => handleInputChange('subject', e.target.value)}
                            placeholder="Enter message subject"
                            className="w-full border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                        />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                            Message *
                        </Label>
                        <Textarea
                            id="message"
                            required
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            placeholder="Tell us more about your inquiry..."
                            className="min-h-[120px] w-full resize-none border-gray-300 bg-white text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                        />
                    </div>

                    {/* Enhanced Security Badge */}
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="size-5 text-green-500 dark:text-green-400"/>
                            <Badge variant="secondary"
                                   className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300">
                                Secure & Confidential
                            </Badge>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            Your information is protected with enterprise-grade security and will never be shared with
                            third parties.
                        </p>
                    </div>

                    {/* Enhanced Action Buttons */}
                    <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            className="flex-1 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:text-gray-200 dark:bg-blue-500 dark:hover:bg-blue-600 dark:disabled:bg-gray-600 dark:disabled:text-gray-400"
                        >
                            {isSubmitting ? (
                                <>
                                    <div
                                        className="mr-2 size-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-gray-300 dark:border-t-transparent"/>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 size-4"/>
                                    Send Message
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}