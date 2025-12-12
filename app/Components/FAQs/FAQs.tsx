"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/app/Components/UI/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/Components/UI/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/Components/UI/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/Components/UI/card";
import { FAQPageProps } from "@/lib/types/faq.types";

const FAQs = ({ categories }: FAQPageProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter FAQ items based on the search query
  const filteredCategories = categories
    .map((category) => {
      const filteredItems = category.items.filter((item) => {
        const matchesQuestion = item.question
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesAnswer = item.answer
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return matchesQuestion || matchesAnswer;
      });

      return {
        ...category,
        items: filteredItems,
      };
    })
    .filter((category) => category.items.length > 0);

  // Check if we have any results
  const hasResults = filteredCategories.length > 0;

  return (
    <section className="relative w-full py-3 lg:py-8 min-h-screen flex flex-col justify-center">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-screen flex flex-col justify-center">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold lg:text-4xl">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto m-4 h-1 w-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          <p className="mx-auto max-w-2xl text-gray-700">
            Find answers to common questions about{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="bold text-blue-600 hover:underline dark:text-blue-400"
              href="#"
            >
              Mael
            </a>{" "}
            below
          </p>
        </div>
        {/* Search Bar */}
        <div className="relative mx-auto mb-10 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="size-5 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search for answers..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* FAQ Content */}
        {!hasResults ? (
          <div className="py-10 text-center">
            <h3 className="mb-2 text-lg font-medium">No results found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search query or browse through our categories.
            </p>
            <button
              className="mt-4 text-blue-600 hover:underline dark:text-blue-400"
              onClick={() => setSearchQuery("")}
            >
              Clear search
            </button>
          </div>
        ) : searchQuery ? (
          // Search Results View
          <div className="space-y-6">
            <h2 className="mb-4 text-xl font-semibold">Search Results</h2>
            {filteredCategories.map((category) => (
              <div key={category.id} className="mb-8">
                <h3 className="mb-4 text-lg font-medium">{category.name}</h3>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.items.map((item) => (
                    <AccordionItem
                      key={item.id}
                      value={item.id}
                      className="overflow-hidden rounded-md border"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="bg-gray-50 px-4 py-3 dark:bg-gray-800">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item.answer.replace(/\n/g, "<br />"),
                          }}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        ) : (
          // Tabbed Category View
          <Tabs defaultValue={categories[0]?.id || "default"}>
            <TabsList className="mb-8 flex flex-wrap justify-center">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="px-4 py-2"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>{category.name}</CardTitle>
                    {category.description && (
                      <CardDescription>{category.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="space-y-4">
                      {category.items.map((item) => (
                        <AccordionItem
                          key={item.id}
                          value={item.id}
                          className="overflow-hidden rounded-md border"
                        >
                          <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="bg-gray-50 px-4 py-3 dark:bg-gray-800">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: item.answer.replace(/\n/g, "<br />"),
                              }}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </section>
  );
};

export default FAQs;
