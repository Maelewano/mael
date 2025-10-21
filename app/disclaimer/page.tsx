export default async function PoliciesPage() {
  return (
    <>
      <section className="relative w-full py-3 lg:py-8 min-h-screen flex flex-col justify-center">
        <div className="container mx-auto min-h-screen px-4 py-8">
          <h1 className="mb-6 text-4xl font-bold">Disclaimers</h1>

          <p className="mb-4">
            Notice regarding your access to and use of{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="bold text-blue-600 hover:underline dark:text-blue-400"
              href="#"
            >
              Mael
            </a>
            , including any related media channels, mobile websites, or
            applications (collectively, the &quot;
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="semi-bold text-blue-600 hover:underline dark:text-blue-400"
              href="#"
            >
              Site
            </a>
            &quot;).
          </p>

          <div className="overview">
            <h2 className="mb-4 text-2xl font-semibold">
              1. Application Overview
            </h2>

            <p className="ml-6 mb-4">
              Mael is a tool designed to facilitate the execution of remote
              document signing and video conferencing.
            </p>
          </div>

          <div className="advice">
            <h2 className="mb-4 text-2xl font-semibold">2. No Legal Advice</h2>

            <p className="ml-6 mb-4">
              The application does not constitute legal advice and should not be
              relied upon as a substitute for independent legal counsel.
            </p>
          </div>

          <div className="responsibility">
            <h2 className="mb-4 text-2xl font-semibold">
              3. User Responsibility
            </h2>

            <p className="ml-6 mb-4">
              Users are responsible for verifying the legality, validity, and
              enforceability of electronically signed documents in their
              respective jurisdictions.
            </p>
          </div>

          <div className="warranties">
            <h2 className="mb-4 text-2xl font-semibold">
              4. Representations and Warranties
            </h2>
            <p className="ml-6 mb-4">
              Mael is provided &quot;as-is&quot; without any representations or
              warranties, express or implied, including but not limited to
              warranties of merchantability, fitness for a particular purpose,
              or non-infringement. <br />
              The developers and distributors of Mael make no guarantees
              regarding the accuracy, reliability, or performance of the
              application. <br />
              Users assume full responsibility for its use in compliance with
              applicable laws.
            </p>
          </div>

          <div className="liability">
            <h2 className="mb-4 text-2xl font-semibold">
              5. Limitation of Liability
            </h2>
            <p className="ml-6 mb-4">
              The developers and distributors of Mael accept no liability for
              any inaccuracies, errors, or disputes arising from its use. <br />
              By using Mael, you agree to assume all risks associated with its
              usage and compliance with applicable laws.
            </p>
          </div>

          <div className="contact">
            <h2 className="mb-4 text-2xl font-semibold">Contact Us</h2>
            <p className="ml-6 mb-4">
              To resolve a complaint about the Site or to receive further
              information on use of the Site, please contact us at:
            </p>
            <p className="ml-6 mb-4">
              Email:{" "}
              <a
                href="mailto:support@Mael.com"
                aria-label="Email Mael support"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                support@Mael.com
              </a>
              <br />
              Github:{" "}
              <a
                href="https://github.com/Mael"
                aria-label="Visit Mael GitHub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                Mael
              </a>
            </p>
          </div>

          <p className="text-sm text-gray-500">
            Last updated: October 20, 2025
          </p>
        </div>
      </section>
    </>
  );
}
