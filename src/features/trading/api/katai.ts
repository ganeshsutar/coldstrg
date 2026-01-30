import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type {
  Katai,
  CreateKataiInput,
  UpdateKataiInput,
  KataiFormInput,
} from "../types";
import { getNextKataiNo } from "../utils/format";

const client = generateClient<Schema>();

// ==================== Katai CRUD ====================

export async function fetchKataiList(organizationId: string): Promise<Katai[]> {
  const { data, errors } =
    await client.models.Katai.listKataiByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter((k) => k.isActive !== false) as unknown as Katai[];
}

export async function fetchKataiById(id: string): Promise<Katai> {
  const { data, errors } = await client.models.Katai.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Katai not found");
  }

  return data as unknown as Katai;
}

export async function fetchKataiByParty(
  organizationId: string,
  partyId: string
): Promise<Katai[]> {
  const { data, errors } =
    await client.models.Katai.listKataiByPartyId({
      partyId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  const filtered = (data || []).filter(
    (k) => k.organizationId === organizationId && k.isActive !== false
  );

  return filtered as unknown as Katai[];
}

export async function fetchKataiByAmad(
  organizationId: string,
  amadId: string
): Promise<Katai[]> {
  const { data, errors } =
    await client.models.Katai.listKataiByAmadId({
      amadId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  const filtered = (data || []).filter(
    (k) => k.organizationId === organizationId && k.isActive !== false
  );

  return filtered as unknown as Katai[];
}

export async function createKatai(input: CreateKataiInput): Promise<Katai> {
  const { data, errors } = await client.models.Katai.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create katai");
  }

  return data as unknown as Katai;
}

export async function updateKatai(input: UpdateKataiInput): Promise<Katai> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.Katai.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update katai");
  }

  return data as unknown as Katai;
}

export async function deleteKatai(id: string): Promise<void> {
  // Soft delete
  const { errors } = await client.models.Katai.update({
    id,
    isActive: false,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// ==================== Combined Operations ====================

export async function getNextKataiNumber(organizationId: string): Promise<number> {
  const katais = await fetchKataiList(organizationId);
  return getNextKataiNo(katais);
}

export async function createKataiFromForm(
  organizationId: string,
  formInput: KataiFormInput
): Promise<Katai> {
  // Get next voucher number
  const kataiNo = await getNextKataiNumber(organizationId);

  // Calculate total graded bags
  const totalGraded =
    (formInput.motaBags || 0) +
    (formInput.chattaBags || 0) +
    (formInput.beejBags || 0) +
    (formInput.mixBags || 0) +
    (formInput.gullaBags || 0);

  // Calculate charges
  const charges = (formInput.laborRate || 0) * formInput.bagsGraded;

  // Create katai
  return createKatai({
    organizationId,
    kataiNo,
    kataiDate: formInput.kataiDate,
    partyId: formInput.partyId,
    partyName: formInput.partyName,
    amadId: formInput.amadId,
    amadNo: formInput.amadNo,
    bagsGraded: formInput.bagsGraded,
    motaBags: formInput.motaBags || 0,
    chattaBags: formInput.chattaBags || 0,
    beejBags: formInput.beejBags || 0,
    mixBags: formInput.mixBags || 0,
    gullaBags: formInput.gullaBags || 0,
    laborName: formInput.laborName,
    laborRate: formInput.laborRate || 0,
    charges,
    status: totalGraded >= formInput.bagsGraded ? "COMPLETED" : "IN_PROGRESS",
    remarks: formInput.remarks,
  });
}

export async function startKatai(kataiId: string): Promise<Katai> {
  return updateKatai({
    id: kataiId,
    status: "IN_PROGRESS",
  });
}

export async function completeKatai(kataiId: string): Promise<Katai> {
  return updateKatai({
    id: kataiId,
    status: "COMPLETED",
  });
}

// ==================== Statistics ====================

export async function getKataiStats(organizationId: string): Promise<{
  totalRecords: number;
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
  totalBagsGraded: number;
}> {
  const katais = await fetchKataiList(organizationId);

  const pending = katais.filter((k) => k.status === "PENDING");
  const inProgress = katais.filter((k) => k.status === "IN_PROGRESS");
  const completed = katais.filter((k) => k.status === "COMPLETED");

  const totalBagsGraded = katais.reduce((sum, k) => sum + (k.bagsGraded || 0), 0);

  return {
    totalRecords: katais.length,
    pendingCount: pending.length,
    inProgressCount: inProgress.length,
    completedCount: completed.length,
    totalBagsGraded,
  };
}
