import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { confirmSignUp, resendSignUpCode } from "../api/auth";

interface ConfirmSignupFormProps extends React.ComponentProps<"div"> {
  email: string;
  onSuccess?: () => void;
  onBackClick?: () => void;
}

export function ConfirmSignupForm({
  className,
  email,
  onSuccess,
  onBackClick,
  ...props
}: ConfirmSignupFormProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await confirmSignUp(email, code);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Confirmation failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendCode() {
    setError("");
    setMessage("");
    setResending(true);

    try {
      await resendSignUpCode(email);
      setMessage("Verification code sent!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend code");
    } finally {
      setResending(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Verify Email</CardTitle>
          <CardDescription>
            Enter the verification code sent to {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              {error && (
                <div className="text-sm text-destructive">{error}</div>
              )}
              {message && (
                <div className="text-sm text-green-600">{message}</div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={loading}
                  maxLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Verifying..." : "Verify"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleResendCode}
                disabled={resending}
              >
                {resending ? "Sending..." : "Resend Code"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              <a
                href="#"
                className="underline underline-offset-4"
                onClick={(e) => {
                  e.preventDefault();
                  onBackClick?.();
                }}
              >
                Back to Sign Up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
