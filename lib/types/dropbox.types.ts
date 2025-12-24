import * as DropboxSign from "@dropbox/sign";

export interface Signer {
  emailAddress: string;
  name: string;
  order: number;
}

export interface FormData {
  title: string;
  subject: string;
  message: string;
  signers: Signer[];
  ccEmailAddresses: string | string[];
  files: Array<{ type: "url" | "upload"; value: File | string }>;
  testMode: boolean;
}

export interface SignatureRequestData {
  clientId: string;
  title: string;
  subject: string;
  message: string;
  signers: DropboxSign.SubSignatureRequestSigner[];
  ccEmailAddresses: string[];
  files: DropboxSign.RequestFile[];
  signingOptions: DropboxSign.SubSigningOptions;
  testMode: boolean;
}

export interface FieldOptions {
  dateFormat?: "DD_MM_YYYY" | "YYYY/MM/DD" | "DDMMYYYY";
}

export interface SigningOptions {
  draw?: boolean;
  type?: boolean;
  upload?: boolean;
  phone?: boolean;
  defaultType?: "draw" | "type";
}
