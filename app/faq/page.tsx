export default async function FAQPage() {
    return (
        <>
            <section className="relative w-full overflow-hidden py-3 lg:py-8">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20 dark:opacity-10">
                    <div
                        className="size-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800"
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.4) 1px, transparent 0)`,
                            backgroundSize: "20px 20px",
                        }}
                    />
                </div>
                {/* Subtle overlay for better text contrast */}
                <div className="absolute inset-0 bg-white/30 dark:bg-gray-900/30" />

                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-screen flex flex-col justify-center">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white lg:text-4xl">
                            FAQs
                        </h2>
                        <p className="mx-auto max-w-2xl text-gray-700 dark:text-gray-200">
                            Coming Soon!!
                        </p>
                    </div>
                </div>
            </section>
        </>
    );
}