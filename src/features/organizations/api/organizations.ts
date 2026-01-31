import { generateClient } from "aws-amplify/data";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";
import type { Schema } from "../../../../amplify/data/resource";
import type { Organization, OrganizationMembership } from "../types";

const client = generateClient<Schema>();

export async function fetchMemberships(): Promise<{
  memberships: OrganizationMembership[];
  userId: string;
}> {
  const user = await getCurrentUser();
  const userId = user.userId;

  const { data, errors } =
    await client.models.OrganizationMembership.listOrganizationMembershipByUserId(
      { userId },
      {
        selectionSet: [
          "id",
          "userId",
          "email",
          "organizationId",
          "role",
          "isDefault",
          "status",
          "joinedAt",
          "createdAt",
          "updatedAt",
          "organization.*",
        ],
      }
    );

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  const membershipsData = (data || []) as unknown as OrganizationMembership[];
  return { memberships: membershipsData, userId };
}

export interface UpdateOrganizationInput {
  id: string;
  name?: string;
  nameHindi?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  phone?: string | null;
  email?: string | null;
  gstNo?: string | null;
  panNo?: string | null;
  timezone?: string | null;
  financialYearStart?: number | null;
  bankName?: string | null;
  bankAccountNo?: string | null;
  bankIfsc?: string | null;
  bankBranch?: string | null;
}

export async function updateOrganization(
  input: UpdateOrganizationInput
): Promise<Organization> {
  const { id, ...updateData } = input;

  const { data, errors } = await client.models.Organization.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update organization");
  }

  return data as unknown as Organization;
}

export async function createOrganization(): Promise<{
  organization: Organization;
  membership: OrganizationMembership;
}> {
  const user = await getCurrentUser();
  const userId = user.userId;

  // Fetch user attributes to get email
  const userAttributes = await fetchUserAttributes();
  const userEmail = userAttributes.email;

  // Get user's email from sign-in details or use a fallback
  const emailPrefix = user.signInDetails?.loginId?.split("@")[0] || "user";
  const orgName = `${emailPrefix}'s Organization`;

  // Generate unique slug from name + timestamp
  const slugBase = orgName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const slug = `${slugBase}-${Date.now()}`;

  // Create the organization
  const { data: newOrg, errors: orgErrors } =
    await client.models.Organization.create({
      name: orgName,
      slug,
      billingStatus: "TRIAL",
      isActive: true,
    });

  if (orgErrors && orgErrors.length > 0) {
    throw new Error(orgErrors[0].message);
  }

  if (!newOrg) {
    throw new Error("Failed to create organization");
  }

  // Create the membership
  const { data: newMembership, errors: membershipErrors } =
    await client.models.OrganizationMembership.create({
      userId,
      email: userEmail,
      organizationId: newOrg.id,
      role: "ADMIN",
      isDefault: true,
      status: "ACTIVE",
      joinedAt: new Date().toISOString(),
    });

  if (membershipErrors && membershipErrors.length > 0) {
    throw new Error(membershipErrors[0].message);
  }

  if (!newMembership) {
    throw new Error("Failed to create membership");
  }

  const orgData = newOrg as unknown as Organization;
  const membershipData = {
    ...newMembership,
    organization: orgData,
  } as unknown as OrganizationMembership;

  return {
    organization: orgData,
    membership: membershipData,
  };
}

export async function markOrganizationConfigured(id: string): Promise<Organization> {
  const { data, errors } = await client.models.Organization.update({
    id,
    isConfigured: true,
    configuredAt: new Date().toISOString(),
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to mark organization as configured");
  }

  return data as unknown as Organization;
}
