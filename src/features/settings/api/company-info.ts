import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { Organization } from "@/features/organizations/types";

const client = generateClient<Schema>();

export interface UpdateCompanyInfoInput {
  id: string;
  name?: string;
  nameHindi?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  phone?: string | null;
  fax?: string | null;
  email?: string | null;
  gstNo?: string | null;
  panNo?: string | null;
  tanNo?: string | null;
  cinNo?: string | null;
  bankName?: string | null;
  bankAccountNo?: string | null;
  bankIfsc?: string | null;
  bankBranch?: string | null;
  financialYearStart?: number | null;
  financialYearEnd?: number | null;
}

export async function fetchOrganizationDetails(orgId: string): Promise<Organization> {
  const { data, errors } = await client.models.Organization.get({ id: orgId });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Organization not found");
  }

  return data as unknown as Organization;
}

export async function updateCompanyInfo(input: UpdateCompanyInfoInput): Promise<Organization> {
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
