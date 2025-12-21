import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";

import { Button } from "@/app/Components/UI/button";
import { generateMetadata } from "@/app/config/metadata";
import * as Routes from "@/app/constants/appRoutes/routes";

// This special file is used by Next.js App Router for 404s.
// It renders for unknown routes or when notFound() is thrown.
export const metadata = generateMetadata("notFound");
export default function NotFound() {
  // Log a breadcrumb in Sentry when a 404 occurs
  Sentry.captureMessage("404 Page Not Found");

  return (
    <main>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <FaExclamationTriangle className="mx-auto size-20 text-red-500" />
          <h1 className="mt-6 text-4xl font-bold text-gray-800">404 - Page Not Found</h1>
          <p className="mt-4 text-lg text-gray-600">
            Oops! The page you&lsquo;re looking for doesn&#39;t exist.
          </p>
          <Link href={Routes.HOME} className="mt-6 inline-block rounded-lg px-6 py-3 text-white">
            <Button variant="default">Go Back Home</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
