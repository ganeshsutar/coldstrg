import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type { StockTransfer, CreateStockTransferInput } from "../types";

const client = generateClient<Schema>();

export async function fetchStockTransferList(organizationId: string): Promise<StockTransfer[]> {
  const { data, errors } =
    await client.models.StockTransfer.listStockTransferByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []) as unknown as StockTransfer[];
}

export async function createStockTransfer(input: CreateStockTransferInput): Promise<StockTransfer> {
  const { data, errors } = await client.models.StockTransfer.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create stock transfer");
  }

  return data as unknown as StockTransfer;
}

export async function deleteStockTransfer(id: string): Promise<void> {
  const { errors } = await client.models.StockTransfer.delete({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

export async function getNextTransferNo(organizationId: string): Promise<number> {
  const transfers = await fetchStockTransferList(organizationId);
  const numbers = transfers
    .map((t) => t.transferNo)
    .filter((n) => !isNaN(n));

  const maxNo = numbers.length > 0 ? Math.max(...numbers) : 0;
  return maxNo + 1;
}
