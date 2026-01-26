import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  signOut as amplifySignOut,
  confirmSignUp as amplifyConfirmSignUp,
  resendSignUpCode as amplifyResendSignUpCode,
  getCurrentUser,
  fetchUserAttributes,
} from "aws-amplify/auth";
import type { UserInfo } from "../types";

export interface SignInResult {
  success: boolean;
  nextStep?: string;
}

export interface SignUpResult {
  success: boolean;
  nextStep?: string;
}

export async function signIn(email: string, password: string): Promise<SignInResult> {
  const { nextStep } = await amplifySignIn({ username: email, password });
  return {
    success: nextStep.signInStep === "DONE",
    nextStep: nextStep.signInStep,
  };
}

export async function signUp(email: string, password: string): Promise<SignUpResult> {
  const { nextStep } = await amplifySignUp({ username: email, password });
  return {
    success: true,
    nextStep: nextStep.signUpStep,
  };
}

export async function confirmSignUp(email: string, code: string): Promise<void> {
  await amplifyConfirmSignUp({ username: email, confirmationCode: code });
}

export async function resendSignUpCode(email: string): Promise<void> {
  await amplifyResendSignUpCode({ username: email });
}

export async function signOut(): Promise<void> {
  await amplifySignOut();
}

export async function checkAuth(): Promise<{ isAuthenticated: boolean; userInfo: UserInfo }> {
  try {
    const user = await getCurrentUser();

    // Try to get user attributes for email and name
    try {
      const attributes = await fetchUserAttributes();
      return {
        isAuthenticated: true,
        userInfo: {
          email: attributes.email || user.signInDetails?.loginId || "",
          name: attributes.name || attributes.preferred_username,
        },
      };
    } catch {
      // Fallback to signInDetails if attributes fail
      return {
        isAuthenticated: true,
        userInfo: {
          email: user.signInDetails?.loginId || "",
        },
      };
    }
  } catch {
    return {
      isAuthenticated: false,
      userInfo: { email: "" },
    };
  }
}
