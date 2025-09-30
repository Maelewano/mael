import Link from "next/link";
import {
    FaSquareFacebook,
    FaSquareGithub,
    FaSquareInstagram,
    FaSquareXTwitter,
} from "react-icons/fa6";

import { fontSans } from '@/app/config/font';
import * as Routes from "@/app/Constants/appRoutes/routes";


export default function Footer() {
    return (
        <footer className={`bottom-0 min-h-10 w-full border-t-2 border-indigo-500 bg-white transition-colors duration-200 dark:border-transparent dark:bg-slate-800 ${fontSans.variable}`}>
            <div className="flex flex-col items-center justify-between gap-6 p-6 lg:flex-row">
                {/* Brand Section */}
                <div className="text-center lg:text-left">
                    <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                        <h1 className="mb-4 max-w-2xl text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl xl:text-6xl dark:text-white">
                            Mael
                        </h1>
                        <h4 className="text-sm text-gray-600 dark:text-gray-300">
                            &copy; {new Date().getFullYear()}
                        </h4>
                    </div>
                    <p className="text-center text-xs font-semibold text-indigo-600 lg:text-left dark:text-indigo-400">
                        MAELEWANO : HARMONY
                    </p>
                </div>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-2 text-sm sm:flex-row sm:gap-0 sm:text-lg">
                    <Link
                        href={Routes.DISCLAIMER}
                        className="m-2 text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                    >
                        Disclaimer
                    </Link>
                </nav>

                {/* Social Media Icons */}
                <div className="flex gap-2 sm:gap-4">
                    <Link
                        href={Routes.HOME}
                        className="text-gray-600 transition-colors hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400"
                        aria-label="Follow us on Twitter"
                    >
                        <FaSquareXTwitter size={30} />
                    </Link>
                    <Link
                        href={Routes.HOME}
                        className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        aria-label="Follow us on GitHub"
                    >
                        <FaSquareGithub size={30} />
                    </Link>
                    <Link
                        href={Routes.HOME}
                        className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                        aria-label="Follow us on Facebook"
                    >
                        <FaSquareFacebook size={30} />
                    </Link>
                    <Link
                        href={Routes.HOME}
                        className="text-gray-600 transition-colors hover:text-pink-500 dark:text-gray-400 dark:hover:text-pink-400"
                        aria-label="Follow us on Instagram"
                    >
                        <FaSquareInstagram size={30} />
                    </Link>
                </div>
            </div>
        </footer>
    );
}
