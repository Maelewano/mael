import { useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";

import * as Routes from "@/app/constants/appRoutes/routes";
import type { FormData } from "@/lib/types/dropbox.types";
import { FileUploader } from "@/app/Components/Uploader/FileUploader";
import { FailedRequest } from "@/app/Components/OnError/Failed";
import { SuccessfulRequest } from "@/app/Components/OnSuccess/OnSuccess";
import { Button } from "@/app/Components/UI/button";
import { Input } from "@/app/Components/UI/input";
import { Textarea } from "@/app/Components/UI/textarea";
import { showToast } from "@/app/Components/UI/toast";
import { env } from "@/env.mjs";

export default function EmbedRequestForm() {
  const [files, setFiles] = useState<File[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Define accepted file types in the format expected by FileUploader
  const ACCEPTED_FILE_TYPES: Record<string, string[]> = {
    document: [".pdf", ".doc", ".docx"],
  };

  const handleFileChange = (newFiles: File[]) => {
    setFiles(newFiles);
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create an actual FormData object
      const formData = new FormData();
      // ...existing code for building formData...
      formData.append("client_id", env.NEXT_PUBLIC_DROPBOX_SIGN_CLIENT_ID);
      formData.append("title", data.title);
      formData.append("subject", data.subject);
      formData.append("message", data.message || "");
      if (data.signers) {
        data.signers.forEach((signer, index) => {
          if (signer.emailAddress) {
            formData.append(
              `signer[${index}][email_address]`,
              signer.emailAddress
            );
          }
          if (signer.name) {
            formData.append(`signer[${index}][name]`, signer.name);
          }
          if (signer.order !== undefined) {
            formData.append(`signer[${index}][order]`, signer.order.toString());
          }
        });
      }
      if (data.ccEmailAddresses) {
        const emailsArray =
          typeof data.ccEmailAddresses === "string"
            ? data.ccEmailAddresses.split(",").map((email) => email.trim())
            : data.ccEmailAddresses;
        emailsArray.forEach((email, index) => {
          if (email && email.includes("@")) {
            formData.append(`ccEmailAddresses[${index}]`, email);
          }
        });
      }
      files.forEach((file, index) => {
        formData.append(`file${index}`, file);
      });
      formData.append(
        "fieldOptions",
        JSON.stringify({ dateFormat: "DDMMYYYY" })
      );
      formData.append("testMode", "true");

      const response = await fetch(
        "/api/dropbox/signature_request/create_embedded",
        {
          method: "POST",
          body: formData,
        }
      );
      const responseData = await response.json();
      if (!responseData.success) {
        showToast.error({
          title: "Signature Request Failed",
          message: responseData.error || "Failed to create signature request",
        });
        throw new Error(
          responseData.error || "Failed to create signature request"
        );
      }
      setResult(responseData.data);
      showToast.success({
        title: "Document Ready",
        message: "The signature request was created successfully.",
      });
    } catch (error) {
      console.error("Error creating signature request:", error);
      setError((error as Error).message);
      showToast.error({
        title: "Error",
        message: (error as Error).message || "Error creating signature request",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    // Implement retry logic here
    console.log("Retrying the operation...");
    // For example, resubmit a form or retry an API call
  };

  return (
    <div className="container mx-auto w-full">
      <div className="p-4 shadow-xl transition-all duration-300 hover:shadow-2xl">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8 md:px-4 lg:px-8"
        >
          {/* Document Details */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Document Details
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  {...register("title", { required: "Title is required" })}
                  placeholder="Enter document title"
                  className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.title && (
                  <span className="mt-1 text-sm text-red-500">
                    {errors.title.message}
                  </span>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  {...register("subject", { required: "Subject is required" })}
                  placeholder="Enter email subject"
                  className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.subject && (
                  <span className="mt-1 text-sm text-red-500">
                    {errors.subject.message}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                {...register("message")}
                placeholder="Enter optional message for signers"
                rows={3}
                className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Participants */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Participants
            </h3>

            {/* First Signer */}
            <div className="mb-4 rounded-lg border border-gray-300 bg-white p-4 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md">
              <h4 className="mb-3 text-sm font-medium text-gray-800">
                Signer 1
              </h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register("signers.0.emailAddress", {
                      required: "Email is required",
                    })}
                    placeholder="signer1@email.com"
                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.signers?.[0]?.emailAddress && (
                    <span className="mt-1 text-sm text-red-500">
                      {errors.signers[0].emailAddress.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    {...register("signers.0.name")}
                    placeholder="Enter full name"
                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Signing Order
                  </label>
                  <input
                    type="number"
                    {...register("signers.0.order", {
                      required: "Order is required",
                      min: 0,
                      max: 1,
                    })}
                    placeholder="0"
                    min="0"
                    max="1"
                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.signers?.[0]?.order && (
                    <span className="mt-1 text-sm text-red-500">
                      {errors.signers[0].order.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Second Signer */}
            <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md">
              <h4 className="mb-3 text-sm font-medium text-gray-800">
                Signer 2
              </h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    {...register("signers.1.emailAddress", {
                      required: "Email is required",
                    })}
                    placeholder="signer2@email.com"
                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.signers?.[1]?.emailAddress && (
                    <span className="mt-1 text-sm text-red-500">
                      {errors.signers[1].emailAddress.message}
                    </span>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    {...register("signers.1.name")}
                    placeholder="Enter full name"
                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Signing Order
                  </label>
                  <input
                    type="number"
                    {...register("signers.1.order", {
                      required: "Order is required",
                      min: 0,
                      max: 1,
                    })}
                    placeholder="1"
                    min="0"
                    max="1"
                    className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  {errors.signers?.[1]?.order && (
                    <span className="mt-1 text-sm text-red-500">
                      {errors.signers[1].order.message}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Settings */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 transition-all duration-200 hover:border-blue-300 hover:bg-blue-50/50">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Additional Settings
            </h3>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                CC Email Addresses
              </label>
              <input
                type="email"
                {...register("ccEmailAddresses")}
                placeholder="email1@example.com, email2@example.com"
                className="w-full rounded-md border border-gray-300 bg-white p-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter comma-separated email addresses
              </p>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Upload Files
              </label>
              <FileUploader
                files={files}
                acceptedFileTypes={ACCEPTED_FILE_TYPES}
                onChange={handleFileChange}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[200px] rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:from-green-600 hover:to-green-700 hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:transform-none disabled:shadow-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 inline size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Signature Request"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Error State */}
      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-6">
          <FailedRequest
            title="Failed To Send Signature Request"
            message="We couldn't process your signature request."
            errorDetails="Call to API Failed"
            redirectText="Create New Request"
            retryAction={handleRetry}
            retryText="Retry"
          />
        </div>
      )}

      {/* Success State */}
      {result && (
        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-6">
          <SuccessfulRequest
            title="Document is Ready"
            message="You can close this dialog."
            redirectPath=""
            redirectText="Close"
          />
          {process.env.NODE_ENV === "development" && (
            <pre className="mt-4 text-xs text-gray-600">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
