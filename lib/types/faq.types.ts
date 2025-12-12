export interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category?: string;
    tags?: string[];
}

export interface FAQCategory {
    id: string;
    name: string;
    description?: string;
    items: FAQItem[];
}

export interface FAQPageProps {
    categories: FAQCategory[];
    searchQuery?: string;
}