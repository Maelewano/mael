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
    <section className="w-full min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
            Frequently Asked Questions
          </h1>
          <div className="mx-auto mb-4 h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            Find answers to common questions about{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-blue-600 hover:underline dark:text-blue-400"
              href="#"
            >
              Mael
            </a>{" "}
            platform below
          </p>
        </div>
        
        {/* FAQ Content */}
        <div className="mx-auto max-w-6xl">
          <Tabs defaultValue={categories[0]?.id || "default"} className="w-full">
            {/* Persistent Search Bar */}
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Left side content - tabs or search header */}
              <div className="flex-1">
                {searchQuery ? (
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold">Search Results</h2>
                    <button
                      className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                      onClick={() => setSearchQuery("")}
                    >
                      ← Back to categories
                    </button>
                  </div>
                ) : (
                  <TabsList className="h-auto rounded-lg border border-gray-200 bg-gray-50 p-3">
                    {categories.map((category) => (
                      <TabsTrigger
                        key={category.id}
                        value={category.id}
                        className="px-6 py-3 text-base font-medium rounded-md transition-all duration-200 hover:bg-blue-100 hover:text-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-400 data-[state=active]:bg-white data-[state=active]:text-blue-800 data-[state=active]:shadow-sm"
                      >
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                )}
              </div>
              
              {/* Persistent Search Input - always visible */}
              <div className="relative max-w-sm lg:min-w-[300px]">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-indigo-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search FAQs..."
                  className="h-10 pl-9 text-sm text-foreground placeholder:text-muted-foreground bg-white dark:bg-white dark:text-black dark:placeholder:text-gray-500 border-gray-300 dark:border-gray-300 focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:ring-offset-1 focus-visible:border-indigo-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Content Area */}
            {searchQuery ? (
              // Search Results Content
              <div className="space-y-6">
                {!hasResults ? (
                  <div className="py-12 text-center">
                    <h3 className="mb-4 text-2xl font-semibold">No results found</h3>
                    <p className="mb-6 text-lg text-muted-foreground">
                      Try adjusting your search query or browse through our categories.
                    </p>
                    <button
                      className="inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  <div>
                    {filteredCategories.map((category) => (
                      <div key={category.id} className="mb-8">
                        <h3 className="mb-4 text-xl font-medium text-blue-700 dark:text-blue-400">{category.name}</h3>
                        <Accordion type="single" collapsible className="space-y-4">
                          {category.items.map((item) => (
                            <AccordionItem
                              key={item.id}
                              value={item.id}
                              className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                            >
                              <AccordionTrigger className="px-6 py-4 text-left text-lg font-medium hover:bg-blue-50/50 transition-all duration-200">
                                {item.question}
                              </AccordionTrigger>
                              <AccordionContent className="bg-gray-50/80 px-6 py-4">
                                <div
                                  className="text-base leading-relaxed text-muted-foreground"
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
                )}
              </div>
            ) : (
              // Category Content with Working Tabs
              <>
                {categories.map((category) => (
                  <TabsContent key={category.id} value={category.id} className="mt-0">
                    <Card className="rounded-lg border border-gray-200 bg-gray-50 shadow-sm p-6">
                      <CardHeader className="pb-4 px-0">
                        <CardTitle className="text-2xl font-bold">{category.name}</CardTitle>
                        {category.description && (
                          <CardDescription className="text-lg text-muted-foreground">
                            {category.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="pt-0 px-0">
                        <Accordion type="single" collapsible className="space-y-4">
                          {category.items.map((item) => (
                            <AccordionItem
                              key={item.id}
                              value={item.id}
                              className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md"
                            >
                              <AccordionTrigger className="px-6 py-4 text-left text-lg font-medium hover:bg-blue-50/50 transition-all duration-200">
                                {item.question}
                              </AccordionTrigger>
                              <AccordionContent className="bg-gray-50/80 px-6 py-4">
                                <div
                                  className="text-base leading-relaxed text-muted-foreground"
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
              </>
            )}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
