import { PulseLoader } from "react-spinners";

export default function Loading() {
    return (
        <div className="flex-center size-full h-screen gap-3 text-gray-800 dark:text-white">
            <PulseLoader color="#24ae7c" size={15} />
            <span>Aegis &nbsp; Loading...</span>
        </div>
    );
}
