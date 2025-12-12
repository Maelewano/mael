import {Types} from 'mongoose';

import FAQs from "@/app/Components/FAQs/FAQs";
import {FAQ} from "@/lib/models/faq.model";
import {connectDB} from "@/lib/utils/mongodbUtilities";
import {FAQCategory} from "@/lib/types/faq.types";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Frequently Asked Questions',
    description: 'Find answers to commonly asked questions about our services and platform.',
};

interface MongoFAQItem {
    _id: Types.ObjectId;
    question: string;
    answer: string;
    category: string;
    tags: string[];
}

interface MongoFAQCategory {
    _id: Types.ObjectId;
    name: string;
    description: string;
    items: MongoFAQItem[];
}

interface MongoFAQData {
    categories: MongoFAQCategory[];
}

async function getFAQData(): Promise<{ categories: FAQCategory[] }> {
    await connectDB();

    try {
        const faqData = await FAQ.findOne({}).sort({updatedAt: -1}).lean() as MongoFAQData | null;

        if (!faqData?.categories) {
            return {categories: []};
        }

        const categories: FAQCategory[] = faqData.categories.map((category) => ({
            id: category._id.toString(),
            name: category.name,
            description: category.description,
            items: category.items.map((item) => ({
                id: item._id.toString(),
                question: item.question,
                answer: item.answer,
                category: item.category,
                tags: item.tags
            }))
        }));

        return {categories};
    } catch (error) {
        console.error('Error fetching FAQ data:', error);
        return {categories: []};
    }
}

export default async function FAQPage() {
  const { categories } = await getFAQData();

  return (
    <>
      <FAQs categories={categories} />
    </>
  );
}
