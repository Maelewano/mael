import mongoose, {Schema} from 'mongoose';

import {FAQCategory, FAQItem} from '@/lib/types/faq.types';

// Extend the interfaces for Mongoose documents
export interface IFAQItemDocument extends Omit<FAQItem, 'id'> {
    _id?: string;
}

export interface IFAQCategoryDocument extends Omit<FAQCategory, 'id' | 'items'> {
    _id?: string;
    items: IFAQItemDocument[];
}

// Schema for FAQ items
const FAQItemSchema = new Schema<IFAQItemDocument>({
    question: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    answer: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000
    },
    category: {
        type: String,
        trim: true,
        maxlength: 100
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: 50
    }]
}, {
    timestamps: true
});

// Schema for FAQ categories
const FAQCategorySchema = new Schema<IFAQCategoryDocument>({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    items: [FAQItemSchema]
}, {
    timestamps: true
});

// Create a model for the entire FAQ structure
export interface IFAQDocument {
    categories: IFAQCategoryDocument[];
    lastUpdated: Date;
    updatedBy: string;
}

const FAQSchema = new Schema<IFAQDocument>({
    categories: [FAQCategorySchema],
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    updatedBy: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Export the model
export const FAQ = mongoose.models.FAQ || mongoose.model<IFAQDocument>('FAQ', FAQSchema);