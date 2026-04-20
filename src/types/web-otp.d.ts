// Web OTP API type declarations
// https://wicg.github.io/web-otp/

interface OTPCredential extends Credential {
  readonly code: string;
}

interface OTPCredentialRequestOptions {
  transport: "sms"[];
}

interface CredentialRequestOptions {
  otp?: OTPCredentialRequestOptions;
}
