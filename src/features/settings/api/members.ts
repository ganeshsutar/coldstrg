import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { OrganizationMembership } from "@/features/organizations/types";
import type { UpdateMemberInput } from "../types";

const client = generateClient<Schema>();

export async function fetchOrgMembers(organizationId: string): Promise<OrganizationMembership[]> {
  const { data, errors } =
    await client.models.OrganizationMembership.listOrganizationMembershipByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as OrganizationMembership[];
}

export async function updateMember(input: UpdateMemberInput): Promise<OrganizationMembership> {
  const { id, ...rest } = input;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { organizationId, ...updateData } = rest;
  const { data, errors } = await client.models.OrganizationMembership.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update member");
  }

  return data as unknown as OrganizationMembership;
}
