import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type {
  GatePass,
  CreateGatePassInput,
  UpdateGatePassInput,
  GatePassDetail,
  CreateGatePassDetailInput,
  GatePassFormInput,
  GatePassStats,
} from "../types";
import { getNextGpNo } from "../utils/format";
import { updateSaudaDispatch } from "./sauda";

const client = generateClient<Schema>();

// ==================== GatePass CRUD ====================

export async function fetchGatePassList(organizationId: string): Promise<GatePass[]> {
  const { data, errors } =
    await client.models.GatePass.listGatePassByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter((g) => g.isActive !== false) as unknown as GatePass[];
}

export async function fetchGatePassById(id: string): Promise<GatePass> {
  const { data, errors } = await client.models.GatePass.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Gate Pass not found");
  }

  return data as unknown as GatePass;
}

export async function fetchGatePassBySeller(
  organizationId: string,
  sellerPartyId: string
): Promise<GatePass[]> {
  const { data, errors } =
    await client.models.GatePass.listGatePassBySellerPartyId({
      sellerPartyId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  const filtered = (data || []).filter(
    (g) => g.organizationId === organizationId && g.isActive !== false
  );

  return filtered as unknown as GatePass[];
}

export async function fetchGatePassBySauda(
  organizationId: string,
  saudaId: string
): Promise<GatePass[]> {
  const { data, errors } =
    await client.models.GatePass.listGatePassBySaudaId({
      saudaId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  const filtered = (data || []).filter(
    (g) => g.organizationId === organizationId && g.isActive !== false
  );

  return filtered as unknown as GatePass[];
}

export async function createGatePass(input: CreateGatePassInput): Promise<GatePass> {
  const { data, errors } = await client.models.GatePass.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create gate pass");
  }

  return data as unknown as GatePass;
}

export async function updateGatePass(input: UpdateGatePassInput): Promise<GatePass> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.GatePass.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update gate pass");
  }

  return data as unknown as GatePass;
}

export async function deleteGatePass(id: string): Promise<void> {
  // Soft delete
  const { errors } = await client.models.GatePass.update({
    id,
    isActive: false,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// ==================== GatePassDetail CRUD ====================

export async function fetchGatePassDetails(gatePassId: string): Promise<GatePassDetail[]> {
  const { data, errors } =
    await client.models.GatePassDetail.listGatePassDetailByGatePassId({
      gatePassId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter((d) => d.isActive !== false) as unknown as GatePassDetail[];
}

export async function fetchGatePassDetailsByAmad(
  amadId: string
): Promise<GatePassDetail[]> {
  const { data, errors } =
    await client.models.GatePassDetail.listGatePassDetailByAmadId({
      amadId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter((d) => d.isActive !== false) as unknown as GatePassDetail[];
}

export async function createGatePassDetail(
  input: CreateGatePassDetailInput
): Promise<GatePassDetail> {
  const { data, errors } = await client.models.GatePassDetail.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create gate pass detail");
  }

  return data as unknown as GatePassDetail;
}

export async function deleteGatePassDetail(id: string): Promise<void> {
  const { errors } = await client.models.GatePassDetail.update({
    id,
    isActive: false,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// ==================== Combined Operations ====================

export async function getNextGatePassNumber(organizationId: string): Promise<number> {
  const gatePasses = await fetchGatePassList(organizationId);
  return getNextGpNo(gatePasses);
}

export async function createGatePassFromForm(
  organizationId: string,
  formInput: GatePassFormInput
): Promise<GatePass> {
  // Get next voucher number
  const gpNo = await getNextGatePassNumber(organizationId);

  // Calculate totals from details
  let totalPkt1 = 0;
  let totalPkt2 = 0;
  let totalPkt3 = 0;
  let totalWeight = 0;
  let totalAmount = 0;

  for (const detail of formInput.details) {
    totalPkt1 += detail.pkt1 || 0;
    totalPkt2 += detail.pkt2 || 0;
    totalPkt3 += detail.pkt3 || 0;
    totalWeight += detail.weight || 0;
    if (detail.rate) {
      totalAmount += (detail.pkt1 + detail.pkt2 + detail.pkt3) * detail.rate;
    }
  }

  const totalPackets = totalPkt1 + totalPkt2 + totalPkt3;

  // Create gate pass header
  const gatePass = await createGatePass({
    organizationId,
    gpNo,
    gpDate: formInput.gpDate,
    gpTime: formInput.gpTime,
    sellerPartyId: formInput.sellerPartyId,
    sellerPartyName: formInput.sellerPartyName,
    sellerVillage: formInput.sellerVillage,
    buyerPartyId: formInput.buyerPartyId,
    buyerPartyName: formInput.buyerPartyName,
    buyerLocation: formInput.buyerLocation,
    saudaId: formInput.saudaId,
    saudaNo: formInput.saudaNo,
    transport: formInput.transport,
    vehicleNo: formInput.vehicleNo,
    driverName: formInput.driverName,
    driverContact: formInput.driverContact,
    biltiNo: formInput.biltiNo,
    totalPkt1,
    totalPkt2,
    totalPkt3,
    totalPackets,
    totalWeight,
    rate: formInput.rate,
    amount: totalAmount,
    status: "DRAFT",
    remarks: formInput.remarks,
  });

  // Create detail records
  for (const detail of formInput.details) {
    const detailTotal = (detail.pkt1 || 0) + (detail.pkt2 || 0) + (detail.pkt3 || 0);
    const detailAmount = detail.rate ? detailTotal * detail.rate : 0;

    await createGatePassDetail({
      organizationId,
      gatePassId: gatePass.id,
      amadId: detail.amadId,
      amadNo: detail.amadNo,
      amadDate: detail.amadDate,
      commodityName: detail.commodityName,
      variety: detail.variety,
      marks: detail.marks,
      pkt1: detail.pkt1 || 0,
      pkt2: detail.pkt2 || 0,
      pkt3: detail.pkt3 || 0,
      totalPackets: detailTotal,
      weight: detail.weight || 0,
      rate: detail.rate,
      amount: detailAmount,
    });
  }

  // Update sauda dispatch if linked
  if (formInput.saudaId) {
    await updateSaudaDispatch(formInput.saudaId, totalPackets);
  }

  return gatePass;
}

export async function confirmGatePass(gatePassId: string): Promise<GatePass> {
  return updateGatePass({
    id: gatePassId,
    status: "PENDING",
  });
}

export async function markGatePassDone(gatePassId: string): Promise<GatePass> {
  return updateGatePass({
    id: gatePassId,
    status: "DONE",
  });
}

export async function cancelGatePass(gatePassId: string): Promise<GatePass> {
  return updateGatePass({
    id: gatePassId,
    status: "CANCELLED",
  });
}

// ==================== Statistics ====================

export async function getGatePassStats(organizationId: string): Promise<GatePassStats> {
  const gatePasses = await fetchGatePassList(organizationId);
  const today = new Date().toISOString().split("T")[0];
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const todayPasses = gatePasses.filter((g) => g.gpDate === today);
  const pendingPrint = gatePasses.filter((g) => g.status === "DRAFT");
  const weekPasses = gatePasses.filter((g) => g.gpDate >= weekAgo);

  const totalBags = gatePasses.reduce((sum, g) => sum + (g.totalPackets || 0), 0);

  return {
    totalPasses: gatePasses.length,
    todayCount: todayPasses.length,
    pendingPrint: pendingPrint.length,
    weekCount: weekPasses.length,
    totalBags,
  };
}
