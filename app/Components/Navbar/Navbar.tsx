"use client";
import { Disclosure, DisclosureButton, DisclosurePanel, } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { VscLaw } from 'react-icons/vsc';

import { ThemeToggle } from '@/app/Components/UI/theme-toggle';

import * as Routes from '@/app/Constants/appRoutes/routes';
import { fontSans } from '@/app/config/font';
import { NavigationItem } from '@/lib/types/navbar.types';


const navigation: NavigationItem[] = [
    {
        name: "Features",
        href: Routes.FEATURES,
        current: false,
    },
    {
        name: "About",
        href: Routes.ABOUT,
        current: false,
    },
    {
        name: "Team",
        href: Routes.TEAM,
        current: false,
    },
    {
        name: "FAQs",
        href: Routes.FAQS,
        current: false,
    }
];

function classNames(...classes: string[]): string {
    return classes.filter(Boolean).join(" ");
}

export default function Navbar({ sidebarExpanded = false }: { sidebarExpanded?: boolean }) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    return (
        (<Disclosure as="nav" className={`border-b-2 border-indigo-500 bg-white transition-colors duration-200 dark:border-transparent dark:bg-slate-800 ${fontSans.variable}`}>
            <div className="mx-auto w-full px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <>
                        <div className="absolute inset-y-0 left-20 flex items-center sm:hidden">
                            {/* Mobile menu button */}
                            <DisclosureButton
                                onClick={() => setOpen(!open)}
                                className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-900 transition-colors duration-200 hover:bg-gray-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:text-gray-100 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-indigo-400"
                            >
                                <span className="absolute -inset-0.5" />
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon
                                    className={`${open ? "hidden" : "block"} size-6`}
                                    aria-hidden="true"
                                />
                                <XMarkIcon
                                    className={`${open ? "block" : "hidden"} size-6`}
                                    aria-hidden="true"
                                />
                            </DisclosureButton>
                            {/**
                             * <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                             <span className="absolute -inset-0.5" />
                             <span className="sr-only">Open main menu</span>
                             <Bars3Icon aria-hidden="true" className="block size-6 group-data-[open]:hidden" />
                             <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-[open]:block" />
                             </DisclosureButton>
                             */}
                        </div>
                    </>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="relative -ml-4 mr-4 flex shrink-0 items-center">
                            <Link href={Routes.HOME}>
                                <VscLaw className="text-amber-400 transition-colors duration-200 dark:text-amber-300" size={45} />
                            </Link>
                        </div>
                        <div className={`hidden sm:block ${sidebarExpanded ? 'ml-44' : 'ml-6'}`}> {/* Move links right when sidebar expands */}
                            <div className="flex space-x-4">
                                {navigation
                                    .map((item) => {
                                        const isCurrentPage = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                aria-current={isCurrentPage ? "page" : undefined}
                                                className={classNames(
                                                    isCurrentPage
                                                        ? "bg-indigo-600 dark:bg-indigo-700 text-white shadow-md"
                                                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white",
                                                    "rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out",
                                                )}
                                            >
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center gap-4 pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        {/* Theme toggle */}
                        <ThemeToggle />
                    </div>
                </div>
            </div>
            <DisclosurePanel className="absolute z-50 border-t border-gray-200 bg-white shadow-lg transition-colors duration-200 sm:hidden dark:border-gray-700 dark:bg-slate-800">
                <div className="space-y-1 px-2 pb-3 pt-2">
                    {navigation
                        .map((item) => {
                            const isCurrentPage = pathname === item.href;
                            return (
                                <DisclosureButton
                                    key={item.name}
                                    as="a"
                                    href={item.href}
                                    aria-current={isCurrentPage ? "page" : undefined}
                                    className={classNames(
                                        isCurrentPage
                                            ? "bg-indigo-600 dark:bg-indigo-700 text-white shadow-md"
                                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white",
                                        "block rounded-md px-3 py-2 text-base font-medium transition-all duration-200 ease-in-out",
                                    )}
                                >
                                    {item.name}
                                </DisclosureButton>
                            );
                        })}
                </div>
            </DisclosurePanel>
        </Disclosure>)
    );
}