import { PulseLoader } from "react-spinners";

export default function Loading() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-3 bg-background">
            <PulseLoader color="#3b82f6" size={15} />
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent font-semibold">
                Mael &nbsp; Loading...
            </span>
        </div>
    );
}
