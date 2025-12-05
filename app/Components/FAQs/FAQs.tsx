export default function FAQs() {
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
      </div>
    </section>
  );
}
