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
        <div className="mb-12 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight lg:text-5xl">
            Frequently Asked Questions
          </h1>
          <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
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
        
        {/* Search Bar */}
        <div className="relative mx-auto mb-12 max-w-lg">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <Search className="h-5 w-5 text-indigo-400" />
          </div>
          <Input
            type="text"
            placeholder="Search for answers..."
            className="h-12 pl-12 text-foreground placeholder:text-muted-foreground bg-white dark:bg-white dark:text-black dark:placeholder:text-gray-500 border-gray-300 dark:border-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* FAQ Content */}
        <div className="mx-auto max-w-6xl">
          {!hasResults ? (
            <div className="py-16 text-center">
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
          ) : searchQuery ? (
            // Search Results View
            <div className="space-y-8">
              <h2 className="mb-6 text-2xl font-semibold">Search Results</h2>
              {filteredCategories.map((category) => (
                <div key={category.id} className="mb-12">
                  <h3 className="mb-6 text-xl font-medium text-blue-700 dark:text-blue-400">{category.name}</h3>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.items.map((item) => (
                      <AccordionItem
                        key={item.id}
                        value={item.id}
                        className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"
                      >
                        <AccordionTrigger className="px-6 py-4 text-left text-lg font-medium hover:bg-muted/50">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="bg-muted/30 px-6 py-4">
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
          ) : (
            // Tabbed Category View
            <Tabs defaultValue={categories[0]?.id || "default"} className="w-full">
              <TabsList className="mb-8 h-auto w-full justify-center bg-muted p-2">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="px-6 py-3 text-base font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category.id} value={category.id} className="mt-8">
                  <Card className="border-border bg-card shadow-sm">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-2xl font-bold">{category.name}</CardTitle>
                      {category.description && (
                        <CardDescription className="text-lg text-muted-foreground">
                          {category.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Accordion type="single" collapsible className="space-y-4">
                        {category.items.map((item) => (
                          <AccordionItem
                            key={item.id}
                            value={item.id}
                            className="overflow-hidden rounded-lg border border-border bg-background shadow-sm"
                          >
                            <AccordionTrigger className="px-6 py-4 text-left text-lg font-medium hover:bg-muted/50">
                              {item.question}
                            </AccordionTrigger>
                            <AccordionContent className="bg-muted/30 px-6 py-4">
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
            </Tabs>
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQs;
