import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type {
  PayPost,
  CreatePayPostInput,
  UpdatePayPostInput,
} from "../types";

const client = generateClient<Schema>();

// ==================== PayPost CRUD ====================

export async function fetchPayPostList(organizationId: string): Promise<PayPost[]> {
  const { data, errors } =
    await client.models.PayPost.listPayPostByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter((p) => p.isActive !== false) as unknown as PayPost[];
}

export async function fetchPayPostById(id: string): Promise<PayPost> {
  const { data, errors } = await client.models.PayPost.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Pay Post not found");
  }

  return data as unknown as PayPost;
}

export async function createPayPost(
  input: CreatePayPostInput
): Promise<PayPost> {
  const { data, errors } = await client.models.PayPost.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create pay post");
  }

  return data as unknown as PayPost;
}

export async function updatePayPost(
  input: UpdatePayPostInput
): Promise<PayPost> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.PayPost.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update pay post");
  }

  return data as unknown as PayPost;
}

export async function deletePayPost(id: string): Promise<void> {
  // Soft delete
  const { errors } = await client.models.PayPost.update({
    id,
    isActive: false,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}
