import { generateClient } from "aws-amplify/data";
import type { Schema } from "../../../../amplify/data/resource";
import type {
  Employee,
  CreateEmployeeInput,
  UpdateEmployeeInput,
  EmployeeFormInput,
} from "../types";
import { getNextEmployeeCode } from "../utils";

const client = generateClient<Schema>();

// ==================== Employee CRUD ====================

export async function fetchEmployeeList(organizationId: string): Promise<Employee[]> {
  const { data, errors } =
    await client.models.Employee.listEmployeeByOrganizationId({
      organizationId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  return (data || []).filter((e) => e.isActive !== false) as unknown as Employee[];
}

export async function fetchEmployeeById(id: string): Promise<Employee> {
  const { data, errors } = await client.models.Employee.get({ id });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Employee not found");
  }

  return data as unknown as Employee;
}

export async function fetchEmployeesByPost(
  organizationId: string,
  postId: string
): Promise<Employee[]> {
  const { data, errors } =
    await client.models.Employee.listEmployeeByPostId({
      postId,
    });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  const filtered = (data || []).filter(
    (e) => e.organizationId === organizationId && e.isActive !== false
  );

  return filtered as unknown as Employee[];
}

export async function fetchActiveEmployees(
  organizationId: string
): Promise<Employee[]> {
  const employees = await fetchEmployeeList(organizationId);
  return employees.filter((e) => e.status === "ACTIVE");
}

export async function createEmployee(
  input: CreateEmployeeInput
): Promise<Employee> {
  const { data, errors } = await client.models.Employee.create(input);

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to create employee");
  }

  return data as unknown as Employee;
}

export async function updateEmployee(
  input: UpdateEmployeeInput
): Promise<Employee> {
  const { id, ...updateData } = input;
  const { data, errors } = await client.models.Employee.update({
    id,
    ...updateData,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }

  if (!data) {
    throw new Error("Failed to update employee");
  }

  return data as unknown as Employee;
}

export async function deleteEmployee(id: string): Promise<void> {
  // Soft delete
  const { errors } = await client.models.Employee.update({
    id,
    isActive: false,
  });

  if (errors && errors.length > 0) {
    throw new Error(errors[0].message);
  }
}

// ==================== Combined Operations ====================

export async function getNextEmployeeCodeFromDb(
  organizationId: string
): Promise<string> {
  const employees = await fetchEmployeeList(organizationId);
  return getNextEmployeeCode(employees);
}

export async function createEmployeeFromForm(
  organizationId: string,
  formInput: EmployeeFormInput
): Promise<Employee> {
  // Get next employee code if not provided
  const code = formInput.code || (await getNextEmployeeCodeFromDb(organizationId));

  return createEmployee({
    organizationId,
    code,
    firstName: formInput.firstName,
    lastName: formInput.lastName,
    nameHindi: formInput.nameHindi,
    fatherName: formInput.fatherName,
    dateOfBirth: formInput.dateOfBirth,
    gender: formInput.gender,
    maritalStatus: formInput.maritalStatus,
    phone: formInput.phone,
    email: formInput.email,
    address: formInput.address,
    city: formInput.city,
    state: formInput.state,
    pincode: formInput.pincode,
    aadharNo: formInput.aadharNo,
    panNo: formInput.panNo,
    postId: formInput.postId,
    postName: formInput.postName,
    joiningDate: formInput.joiningDate,
    confirmationDate: formInput.confirmationDate,
    bankName: formInput.bankName,
    bankAccountNo: formInput.bankAccountNo,
    bankIfsc: formInput.bankIfsc,
    bankBranch: formInput.bankBranch,
    basicSalary: formInput.basicSalary ?? 0,
    grossSalary: formInput.grossSalary ?? 0,
    pfNo: formInput.pfNo,
    esiNo: formInput.esiNo,
    uanNo: formInput.uanNo,
    pfApplicable: formInput.pfApplicable ?? true,
    esiApplicable: formInput.esiApplicable ?? true,
    status: formInput.status,
    remarks: formInput.remarks,
  });
}

// ==================== Statistics ====================

export async function getEmployeeStats(organizationId: string): Promise<{
  total: number;
  active: number;
  onLeave: number;
  resigned: number;
}> {
  const employees = await fetchEmployeeList(organizationId);

  return {
    total: employees.length,
    active: employees.filter((e) => e.status === "ACTIVE").length,
    onLeave: employees.filter((e) => e.status === "ON_LEAVE").length,
    resigned: employees.filter((e) => e.status === "RESIGNED").length,
  };
}
