import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { Voucher, CreateVoucherInput, UpdateVoucherInput, VoucherTypeValue } from "../types";

const client = generateClient<Schema>();

export async function fetchVoucherList(organizationId: string): Promise<Voucher[]> {
  const { data, errors } =
    await client.models.Voucher.listVoucherByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as Voucher[];
}

export async function fetchVoucherById(id: string): Promise<Voucher> {
  const { data, errors } = await client.models.Voucher.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Voucher not found");
  }

  return data as unknown as Voucher;
}

export async function fetchVouchersByType(
  organizationId: string,
  voucherType: VoucherTypeValue
): Promise<Voucher[]> {
  const vouchers = await fetchVoucherList(organizationId);
  return vouchers.filter((v) => v.voucherType === voucherType);
}

export async function fetchVouchersByDate(
  organizationId: string,
  date: string
): Promise<Voucher[]> {
  const vouchers = await fetchVoucherList(organizationId);
  return vouchers.filter((v) => v.date === date);
}

export async function fetchVouchersByAccount(
  organizationId: string,
  accountId: string
): Promise<Voucher[]> {
  const vouchers = await fetchVoucherList(organizationId);
  return vouchers.filter(
    (v) => v.drAccountId === accountId || v.crAccountId === accountId
  );
}

export async function createVoucher(input: CreateVoucherInput): Promise<Voucher> {
  const { data, errors } = await client.models.Voucher.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create voucher");
  }

  return data as unknown as Voucher;
}

export async function updateVoucher(input: UpdateVoucherInput): Promise<Voucher> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.Voucher.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update voucher");
  }

  return data as unknown as Voucher;
}

export async function deleteVoucher(id: string): Promise<void> {
  const { errors } = await client.models.Voucher.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

export async function getNextVoucherNo(
  organizationId: string,
  voucherType?: VoucherTypeValue
): Promise<number> {
  const vouchers = voucherType
    ? await fetchVouchersByType(organizationId, voucherType)
    : await fetchVoucherList(organizationId);

  const numbers = vouchers
    .map((v) => v.voucherNo)
    .filter((n) => !isNaN(n));

  const maxNo = numbers.length > 0 ? Math.max(...numbers) : 0;
  return maxNo + 1;
}
