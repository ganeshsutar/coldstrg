/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createAccount = /* GraphQL */ `mutation CreateAccount(
  $condition: ModelAccountConditionInput
  $input: CreateAccountInput!
) {
  createAccount(condition: $condition, input: $input) {
    aadhar
    accountType
    address1
    address2
    balance
    barCr
    barDr
    city
    code
    cr
    createdAt
    dr
    drLimit
    gst
    id
    interestRate
    intrstCr
    intrstDr
    isActive
    level
    loanCr
    loanDr
    name
    nameHindi
    nature
    openingBalance
    organizationId
    othCr
    othDr
    pan
    parentId
    partyType
    phone
    pkt1A
    pkt1N
    pkt2A
    pkt2N
    pkt3A
    pkt3N
    rentCr
    rentDr
    state
    under
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateAccountMutationVariables,
  APITypes.CreateAccountMutation
>;
export const createAdvance = /* GraphQL */ `mutation CreateAdvance(
  $condition: ModelAdvanceConditionInput
  $input: CreateAdvanceInput!
) {
  createAdvance(condition: $condition, input: $input) {
    advanceNo
    amount
    bardanaVoucherId
    convertedAmadId
    createdAt
    date
    expectedBags
    expectedDate
    id
    interestRate
    isActive
    narration
    organizationId
    partyId
    partyName
    paymentMode
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateAdvanceMutationVariables,
  APITypes.CreateAdvanceMutation
>;
export const createAmad = /* GraphQL */ `mutation CreateAmad(
  $condition: ModelAmadConditionInput
  $input: CreateAmadInput!
) {
  createAmad(condition: $condition, input: $input) {
    amadNo
    chamberId
    chamberName
    commodityId
    commodityName
    createdAt
    dalaCharges
    date
    dispatchedPackets
    district
    eWayBillDate
    eWayBillNo
    floor
    graceDays
    graceDays1
    grading
    id
    isActive
    mark1
    mark2
    organizationId
    partyId
    partyMark
    partyName
    pkt1
    pkt2
    pkt3
    position
    post
    pwt1
    pwt2
    pwt3
    rentRate
    road
    room
    status
    takpattiNo
    totalPackets
    totalWeight
    transferRef
    updatedAt
    variety
    villageName
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateAmadMutationVariables,
  APITypes.CreateAmadMutation
>;
export const createAttendance = /* GraphQL */ `mutation CreateAttendance(
  $condition: ModelAttendanceConditionInput
  $input: CreateAttendanceInput!
) {
  createAttendance(condition: $condition, input: $input) {
    createdAt
    date
    employeeCode
    employeeId
    employeeName
    hoursWorked
    id
    inTime
    isActive
    leaveType
    markedBy
    organizationId
    otHours
    outTime
    remarks
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateAttendanceMutationVariables,
  APITypes.CreateAttendanceMutation
>;
export const createAuditLog = /* GraphQL */ `mutation CreateAuditLog(
  $condition: ModelAuditLogConditionInput
  $input: CreateAuditLogInput!
) {
  createAuditLog(condition: $condition, input: $input) {
    action
    createdAt
    details
    entityId
    entityType
    id
    isActive
    module
    organizationId
    updatedAt
    userId
    userName
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateAuditLogMutationVariables,
  APITypes.CreateAuditLogMutation
>;
export const createBank = /* GraphQL */ `mutation CreateBank(
  $condition: ModelBankConditionInput
  $input: CreateBankInput!
) {
  createBank(condition: $condition, input: $input) {
    code
    createdAt
    id
    ifscPattern
    isActive
    name
    organizationId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateBankMutationVariables,
  APITypes.CreateBankMutation
>;
export const createBardanaIssueHeader = /* GraphQL */ `mutation CreateBardanaIssueHeader(
  $condition: ModelBardanaIssueHeaderConditionInput
  $input: CreateBardanaIssueHeaderInput!
) {
  createBardanaIssueHeader(condition: $condition, input: $input) {
    amadId
    amadNo
    confirmedAt
    confirmedBy
    createdAt
    expectedArrivalDate
    expectedBags
    id
    interestRatePm
    isActive
    issueDate
    issueType
    narration
    organizationId
    partyId
    partyName
    partyVillage
    referenceNo
    status
    totalAmount
    totalQuantity
    updatedAt
    voucherNo
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateBardanaIssueHeaderMutationVariables,
  APITypes.CreateBardanaIssueHeaderMutation
>;
export const createBardanaIssueItem = /* GraphQL */ `mutation CreateBardanaIssueItem(
  $condition: ModelBardanaIssueItemConditionInput
  $input: CreateBardanaIssueItemInput!
) {
  createBardanaIssueItem(condition: $condition, input: $input) {
    amount
    bardanaTypeId
    bardanaTypeName
    createdAt
    id
    isActive
    issueHeaderId
    organizationId
    quantity
    rate
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateBardanaIssueItemMutationVariables,
  APITypes.CreateBardanaIssueItemMutation
>;
export const createBardanaReceiptHeader = /* GraphQL */ `mutation CreateBardanaReceiptHeader(
  $condition: ModelBardanaReceiptHeaderConditionInput
  $input: CreateBardanaReceiptHeaderInput!
) {
  createBardanaReceiptHeader(condition: $condition, input: $input) {
    confirmedAt
    confirmedBy
    createdAt
    id
    isActive
    narration
    netAmount
    organizationId
    partyId
    partyName
    partyVillage
    receiptDate
    rentId
    rentSerialNo
    status
    totalAmount
    totalDamagedQuantity
    totalDeduction
    totalFairQuantity
    totalGoodQuantity
    totalQuantity
    updatedAt
    voucherNo
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateBardanaReceiptHeaderMutationVariables,
  APITypes.CreateBardanaReceiptHeaderMutation
>;
export const createBardanaReceiptItem = /* GraphQL */ `mutation CreateBardanaReceiptItem(
  $condition: ModelBardanaReceiptItemConditionInput
  $input: CreateBardanaReceiptItemInput!
) {
  createBardanaReceiptItem(condition: $condition, input: $input) {
    amount
    bardanaTypeId
    bardanaTypeName
    condition
    createdAt
    creditRate
    deduction
    id
    isActive
    netAmount
    organizationId
    quantity
    rate
    receiptHeaderId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateBardanaReceiptItemMutationVariables,
  APITypes.CreateBardanaReceiptItemMutation
>;
export const createBardanaStock = /* GraphQL */ `mutation CreateBardanaStock(
  $condition: ModelBardanaStockConditionInput
  $input: CreateBardanaStockInput!
) {
  createBardanaStock(condition: $condition, input: $input) {
    balance
    bardanaTypeId
    bardanaTypeName
    createdAt
    id
    isActive
    lastIssueDate
    lastReturnDate
    organizationId
    partyId
    partyName
    partyVillage
    totalIssued
    totalReturned
    totalValue
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateBardanaStockMutationVariables,
  APITypes.CreateBardanaStockMutation
>;
export const createBardanaType = /* GraphQL */ `mutation CreateBardanaType(
  $condition: ModelBardanaTypeConditionInput
  $input: CreateBardanaTypeInput!
) {
  createBardanaType(condition: $condition, input: $input) {
    code
    createdAt
    currentStock
    defaultRate
    description
    id
    isActive
    name
    nameHindi
    openingStock
    organizationId
    unit
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateBardanaTypeMutationVariables,
  APITypes.CreateBardanaTypeMutation
>;
export const createChamber = /* GraphQL */ `mutation CreateChamber(
  $condition: ModelChamberConditionInput
  $input: CreateChamberInput!
) {
  createChamber(condition: $condition, input: $input) {
    code
    createdAt
    currentTemperature
    description
    floors
    id
    isActive
    maxTemperature
    minTemperature
    name
    nameHindi
    organizationId
    rackCapacity
    racksPerRow
    roomNumber
    targetTemperature
    temperatureStatus
    totalRacks
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateChamberMutationVariables,
  APITypes.CreateChamberMutation
>;
export const createChamberFloor = /* GraphQL */ `mutation CreateChamberFloor(
  $condition: ModelChamberFloorConditionInput
  $input: CreateChamberFloorInput!
) {
  createChamberFloor(condition: $condition, input: $input) {
    chamberId
    createdAt
    description
    floorName
    floorNumber
    fromRack
    id
    isActive
    organizationId
    racksPerRow
    toRack
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateChamberFloorMutationVariables,
  APITypes.CreateChamberFloorMutation
>;
export const createCommodity = /* GraphQL */ `mutation CreateCommodity(
  $condition: ModelCommodityConditionInput
  $input: CreateCommodityInput!
) {
  createCommodity(condition: $condition, input: $input) {
    barcode
    chargeRentType
    code
    commodityType
    createdAt
    gracePeriod
    halfRentDays
    hsnCode
    id
    isActive
    loanRate
    mrp
    name
    nameHindi
    openingStock
    organizationId
    purchasePrice
    ratePerUnitField
    ratePerUnitMandi
    rateWT
    rentBasis
    rentCalculationMode
    rentOn
    rentRatePKT1
    rentRatePKT2
    rentRatePKT3
    salePrice
    updatedAt
    zeroRentDays
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateCommodityMutationVariables,
  APITypes.CreateCommodityMutation
>;
export const createDWage = /* GraphQL */ `mutation CreateDWage(
  $condition: ModelDWageConditionInput
  $input: CreateDWageInput!
) {
  createDWage(condition: $condition, input: $input) {
    createdAt
    date
    deductions
    grossAmount
    hoursWorked
    id
    isActive
    isPaid
    netAmount
    organizationId
    paidAt
    paymentMode
    paymentRef
    ratePerHour
    ratePerUnit
    remarks
    serialNo
    unitsCompleted
    updatedAt
    workType
    workerContact
    workerName
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateDWageMutationVariables,
  APITypes.CreateDWageMutation
>;
export const createDaybook = /* GraphQL */ `mutation CreateDaybook(
  $condition: ModelDaybookConditionInput
  $input: CreateDaybookInput!
) {
  createDaybook(condition: $condition, input: $input) {
    bankCloseCr
    bankCloseDr
    bankCr
    bankDr
    bankOpenCr
    bankOpenDr
    cashCloseCr
    cashCloseDr
    cashCr
    cashDr
    cashOpenCr
    cashOpenDr
    createdAt
    date
    description
    id
    isActive
    organizationId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateDaybookMutationVariables,
  APITypes.CreateDaybookMutation
>;
export const createEmployee = /* GraphQL */ `mutation CreateEmployee(
  $condition: ModelEmployeeConditionInput
  $input: CreateEmployeeInput!
) {
  createEmployee(condition: $condition, input: $input) {
    aadharNo
    address
    bankAccountNo
    bankBranch
    bankIfsc
    bankName
    basicSalary
    casualLeaveBalance
    city
    code
    confirmationDate
    createdAt
    dateOfBirth
    earnedLeaveBalance
    email
    esiApplicable
    esiNo
    fatherName
    firstName
    gender
    grossSalary
    id
    isActive
    joiningDate
    lastName
    maritalStatus
    nameHindi
    organizationId
    panNo
    pfApplicable
    pfNo
    phone
    pincode
    postId
    postName
    relievingDate
    remarks
    resignationDate
    sickLeaveBalance
    state
    status
    uanNo
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateEmployeeMutationVariables,
  APITypes.CreateEmployeeMutation
>;
export const createGatePass = /* GraphQL */ `mutation CreateGatePass(
  $condition: ModelGatePassConditionInput
  $input: CreateGatePassInput!
) {
  createGatePass(condition: $condition, input: $input) {
    amount
    biltiNo
    buyerLocation
    buyerPartyId
    buyerPartyName
    createdAt
    driverContact
    driverName
    gpDate
    gpNo
    gpTime
    id
    isActive
    organizationId
    rate
    remarks
    saudaId
    saudaNo
    sellerPartyId
    sellerPartyName
    sellerVillage
    status
    totalPackets
    totalPkt1
    totalPkt2
    totalPkt3
    totalWeight
    transport
    updatedAt
    vehicleNo
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateGatePassMutationVariables,
  APITypes.CreateGatePassMutation
>;
export const createGatePassDetail = /* GraphQL */ `mutation CreateGatePassDetail(
  $condition: ModelGatePassDetailConditionInput
  $input: CreateGatePassDetailInput!
) {
  createGatePassDetail(condition: $condition, input: $input) {
    amadDate
    amadId
    amadNo
    amount
    commodityName
    createdAt
    gatePassId
    id
    isActive
    marks
    organizationId
    pkt1
    pkt2
    pkt3
    rate
    totalPackets
    updatedAt
    variety
    weight
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateGatePassDetailMutationVariables,
  APITypes.CreateGatePassDetailMutation
>;
export const createGstRate = /* GraphQL */ `mutation CreateGstRate(
  $condition: ModelGstRateConditionInput
  $input: CreateGstRateInput!
) {
  createGstRate(condition: $condition, input: $input) {
    cgstRate
    createdAt
    description
    effectiveDate
    hsnCode
    id
    igstRate
    isActive
    organizationId
    sgstRate
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateGstRateMutationVariables,
  APITypes.CreateGstRateMutation
>;
export const createKatai = /* GraphQL */ `mutation CreateKatai(
  $condition: ModelKataiConditionInput
  $input: CreateKataiInput!
) {
  createKatai(condition: $condition, input: $input) {
    amadId
    amadNo
    bagsGraded
    beejBags
    charges
    chattaBags
    createdAt
    gullaBags
    id
    isActive
    kataiDate
    kataiNo
    laborName
    laborRate
    mixBags
    motaBags
    organizationId
    partyId
    partyName
    remarks
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateKataiMutationVariables,
  APITypes.CreateKataiMutation
>;
export const createLaborRate = /* GraphQL */ `mutation CreateLaborRate(
  $condition: ModelLaborRateConditionInput
  $input: CreateLaborRateInput!
) {
  createLaborRate(condition: $condition, input: $input) {
    createdAt
    effectiveDate
    id
    isActive
    organizationId
    ratePKT1
    ratePKT2
    ratePKT3
    rateType
    reason
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateLaborRateMutationVariables,
  APITypes.CreateLaborRateMutation
>;
export const createLoading = /* GraphQL */ `mutation CreateLoading(
  $condition: ModelLoadingConditionInput
  $input: CreateLoadingInput!
) {
  createLoading(condition: $condition, input: $input) {
    amadId
    amadNo
    chamberId
    chamberName
    commodityName
    createdAt
    date
    floorNumber
    id
    isActive
    loadingNo
    organizationId
    partyId
    partyName
    pkt1
    pkt2
    pkt3
    rackNumber
    rackStatus
    remarks
    totalQuantity
    totalWeight
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateLoadingMutationVariables,
  APITypes.CreateLoadingMutation
>;
export const createLoanAmount = /* GraphQL */ `mutation CreateLoanAmount(
  $condition: ModelLoanAmountConditionInput
  $input: CreateLoanAmountInput!
) {
  createLoanAmount(condition: $condition, input: $input) {
    amadId
    amadNo
    collateralBags
    createdAt
    date
    disbursedAmount
    id
    interestRate
    isActive
    loanNo
    narration
    organizationId
    outstandingBalance
    partyId
    partyName
    paymentMode
    repaidAmount
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateLoanAmountMutationVariables,
  APITypes.CreateLoanAmountMutation
>;
export const createLoanPartyLedger = /* GraphQL */ `mutation CreateLoanPartyLedger(
  $condition: ModelLoanPartyLedgerConditionInput
  $input: CreateLoanPartyLedgerInput!
) {
  createLoanPartyLedger(condition: $condition, input: $input) {
    advanceId
    amadId
    balance
    createdAt
    creditAmount
    date
    debitAmount
    id
    interestRate
    isActive
    loanAmountId
    narration
    organizationId
    partyId
    serialNo
    transactionType
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateLoanPartyLedgerMutationVariables,
  APITypes.CreateLoanPartyLedgerMutation
>;
export const createMeterReading = /* GraphQL */ `mutation CreateMeterReading(
  $condition: ModelMeterReadingConditionInput
  $input: CreateMeterReadingInput!
) {
  createMeterReading(condition: $condition, input: $input) {
    chamberId
    chamberName
    consumption
    createdAt
    currentReading
    id
    isActive
    meterNumber
    organizationId
    photoUrl
    previousReading
    readingDate
    readingTime
    recordedBy
    remarks
    unit
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateMeterReadingMutationVariables,
  APITypes.CreateMeterReadingMutation
>;
export const createOrganization = /* GraphQL */ `mutation CreateOrganization(
  $condition: ModelOrganizationConditionInput
  $input: CreateOrganizationInput!
) {
  createOrganization(condition: $condition, input: $input) {
    address
    bankAccountNo
    bankBranch
    bankIfsc
    bankName
    billingStatus
    cinNo
    city
    configuredAt
    createdAt
    email
    fax
    financialYearEnd
    financialYearStart
    gstNo
    id
    isActive
    isConfigured
    memberships {
      nextToken
      __typename
    }
    name
    nameHindi
    panNo
    phone
    slug
    state
    tanNo
    timezone
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateOrganizationMutationVariables,
  APITypes.CreateOrganizationMutation
>;
export const createOrganizationMembership = /* GraphQL */ `mutation CreateOrganizationMembership(
  $condition: ModelOrganizationMembershipConditionInput
  $input: CreateOrganizationMembershipInput!
) {
  createOrganizationMembership(condition: $condition, input: $input) {
    backdateEntryDays
    createdAt
    id
    isDefault
    joinedAt
    lastLoginAt
    loanPerBagLimit
    moduleAccessAccounts
    moduleAccessColdStorageReports
    moduleAccessMISReports
    moduleAccessMultiRoom
    moduleAccessPayroll
    organization {
      address
      bankAccountNo
      bankBranch
      bankIfsc
      bankName
      billingStatus
      cinNo
      city
      configuredAt
      createdAt
      email
      fax
      financialYearEnd
      financialYearStart
      gstNo
      id
      isActive
      isConfigured
      name
      nameHindi
      panNo
      phone
      slug
      state
      tanNo
      timezone
      updatedAt
      __typename
    }
    organizationId
    role
    status
    updatedAt
    userId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateOrganizationMembershipMutationVariables,
  APITypes.CreateOrganizationMembershipMutation
>;
export const createPartyLedger = /* GraphQL */ `mutation CreatePartyLedger(
  $condition: ModelPartyLedgerConditionInput
  $input: CreatePartyLedgerInput!
) {
  createPartyLedger(condition: $condition, input: $input) {
    accountCode
    accountId
    accountName
    amadId
    amadNo
    amount
    barQtyIn
    barQtyOut
    bardana
    billNo
    createdAt
    date
    gpNo
    id
    interest
    isActive
    loan
    organizationId
    other
    rent
    rentId
    rentNo
    roi
    srNo
    updatedAt
    voucherType
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePartyLedgerMutationVariables,
  APITypes.CreatePartyLedgerMutation
>;
export const createPayAllowance = /* GraphQL */ `mutation CreatePayAllowance(
  $condition: ModelPayAllowanceConditionInput
  $input: CreatePayAllowanceInput!
) {
  createPayAllowance(condition: $condition, input: $input) {
    calculationBase
    code
    componentType
    createdAt
    defaultValue
    description
    id
    isActive
    isTaxable
    name
    nameHindi
    organizationId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePayAllowanceMutationVariables,
  APITypes.CreatePayAllowanceMutation
>;
export const createPayDeduction = /* GraphQL */ `mutation CreatePayDeduction(
  $condition: ModelPayDeductionConditionInput
  $input: CreatePayDeductionInput!
) {
  createPayDeduction(condition: $condition, input: $input) {
    calculationBase
    code
    componentType
    createdAt
    defaultValue
    description
    id
    isActive
    isStatutory
    name
    nameHindi
    organizationId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePayDeductionMutationVariables,
  APITypes.CreatePayDeductionMutation
>;
export const createPayIncrements = /* GraphQL */ `mutation CreatePayIncrements(
  $condition: ModelPayIncrementsConditionInput
  $input: CreatePayIncrementsInput!
) {
  createPayIncrements(condition: $condition, input: $input) {
    approvedAt
    approvedBy
    createdAt
    employeeCode
    employeeId
    employeeName
    esiRate
    id
    incrementAmount
    incrementDate
    incrementPercent
    isActive
    newBasic
    newGross
    organizationId
    pfRate
    previousBasic
    previousGross
    reason
    remarks
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePayIncrementsMutationVariables,
  APITypes.CreatePayIncrementsMutation
>;
export const createPayLedger = /* GraphQL */ `mutation CreatePayLedger(
  $condition: ModelPayLedgerConditionInput
  $input: CreatePayLedgerInput!
) {
  createPayLedger(condition: $condition, input: $input) {
    balance
    createdAt
    creditAmount
    date
    debitAmount
    employeeCode
    employeeId
    employeeName
    id
    isActive
    month
    narration
    organizationId
    paymentMode
    paymentRef
    referenceId
    referenceNo
    serialNo
    transactionType
    updatedAt
    year
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePayLedgerMutationVariables,
  APITypes.CreatePayLedgerMutation
>;
export const createPayLoan = /* GraphQL */ `mutation CreatePayLoan(
  $condition: ModelPayLoanConditionInput
  $input: CreatePayLoanInput!
) {
  createPayLoan(condition: $condition, input: $input) {
    approvedAt
    approvedBy
    createdAt
    emiAmount
    emisPaid
    emisRemaining
    employeeCode
    employeeId
    employeeName
    endDate
    id
    interestRate
    isActive
    lastEmiDate
    loanAmount
    loanDate
    loanNo
    narration
    organizationId
    outstandingBalance
    purpose
    startDate
    status
    tenure
    totalPaid
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePayLoanMutationVariables,
  APITypes.CreatePayLoanMutation
>;
export const createPayPost = /* GraphQL */ `mutation CreatePayPost(
  $condition: ModelPayPostConditionInput
  $input: CreatePayPostInput!
) {
  createPayPost(condition: $condition, input: $input) {
    basicSalary
    casualLeave
    code
    createdAt
    description
    earnedLeave
    esiApplicable
    id
    isActive
    name
    nameHindi
    organizationId
    otMultiplier
    otRate
    pfApplicable
    sickLeave
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePayPostMutationVariables,
  APITypes.CreatePayPostMutation
>;
export const createPaySATTN = /* GraphQL */ `mutation CreatePaySATTN(
  $condition: ModelPaySATTNConditionInput
  $input: CreatePaySATTNInput!
) {
  createPaySATTN(condition: $condition, input: $input) {
    absentDays
    advanceDeduction
    approvedAt
    approvedBy
    basicSalary
    createdAt
    effectiveDays
    employeeCode
    employeeId
    employeeName
    esiAmount
    grossSalary
    halfDays
    holidays
    id
    isActive
    leaveDays
    loanDeduction
    month
    netSalary
    organizationId
    otAmount
    otHours
    paidAt
    paidBy
    paymentMode
    paymentRef
    pfAmount
    postId
    postName
    presentDays
    processedAt
    processedBy
    remarks
    status
    tdsAmount
    totalAllowances
    totalDays
    totalDeductions
    updatedAt
    weeklyOffs
    workingDays
    year
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePaySATTNMutationVariables,
  APITypes.CreatePaySATTNMutation
>;
export const createPaySAllowance = /* GraphQL */ `mutation CreatePaySAllowance(
  $condition: ModelPaySAllowanceConditionInput
  $input: CreatePaySAllowanceInput!
) {
  createPaySAllowance(condition: $condition, input: $input) {
    allowanceCode
    allowanceId
    allowanceName
    componentType
    createdAt
    effectiveFrom
    effectiveTo
    employeeCode
    employeeId
    employeeName
    id
    isActive
    organizationId
    remarks
    updatedAt
    value
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePaySAllowanceMutationVariables,
  APITypes.CreatePaySAllowanceMutation
>;
export const createPaySDeduction = /* GraphQL */ `mutation CreatePaySDeduction(
  $condition: ModelPaySDeductionConditionInput
  $input: CreatePaySDeductionInput!
) {
  createPaySDeduction(condition: $condition, input: $input) {
    componentType
    createdAt
    deductionCode
    deductionId
    deductionName
    effectiveFrom
    effectiveTo
    employeeCode
    employeeId
    employeeName
    id
    isActive
    organizationId
    remarks
    updatedAt
    value
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePaySDeductionMutationVariables,
  APITypes.CreatePaySDeductionMutation
>;
export const createPriceBreakup = /* GraphQL */ `mutation CreatePriceBreakup(
  $condition: ModelPriceBreakupConditionInput
  $input: CreatePriceBreakupInput!
) {
  createPriceBreakup(condition: $condition, input: $input) {
    amount
    component
    createdAt
    description
    hsnCode
    id
    isActive
    organizationId
    quantity
    rate
    rentBillId
    unit
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePriceBreakupMutationVariables,
  APITypes.CreatePriceBreakupMutation
>;
export const createReceipt = /* GraphQL */ `mutation CreateReceipt(
  $condition: ModelReceiptConditionInput
  $input: CreateReceiptInput!
) {
  createReceipt(condition: $condition, input: $input) {
    amount
    amountInWords
    bankName
    bankRef
    branchName
    cancelReason
    cancelledAt
    cancelledBy
    chequeClearedDate
    chequeDate
    chequeNo
    confirmedAt
    confirmedBy
    createdAt
    id
    isActive
    isChequeCleared
    isPdcCheque
    narration
    organizationId
    partyId
    partyName
    paymentMode
    receiptDate
    receiptNo
    status
    updatedAt
    upiRef
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateReceiptMutationVariables,
  APITypes.CreateReceiptMutation
>;
export const createReceiptAllocation = /* GraphQL */ `mutation CreateReceiptAllocation(
  $condition: ModelReceiptAllocationConditionInput
  $input: CreateReceiptAllocationInput!
) {
  createReceiptAllocation(condition: $condition, input: $input) {
    allocatedAmount
    billNo
    createdAt
    id
    isActive
    organizationId
    receiptId
    rentBillId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateReceiptAllocationMutationVariables,
  APITypes.CreateReceiptAllocationMutation
>;
export const createRent = /* GraphQL */ `mutation CreateRent(
  $condition: ModelRentConditionInput
  $input: CreateRentInput!
) {
  createRent(condition: $condition, input: $input) {
    amadId
    amadNo
    amount
    billAmount
    cgst
    createdAt
    date
    dumpingAmt
    id
    igst
    isActive
    loadingAmt
    organizationId
    partyId
    partyName
    pkt1
    pkt2
    pkt3
    rate
    receiverName
    rent
    serialNo
    sgst
    storageDays
    totalPackets
    totalWeight
    unloadingAmt
    updatedAt
    vehicleNo
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateRentMutationVariables,
  APITypes.CreateRentMutation
>;
export const createRentBillHeader = /* GraphQL */ `mutation CreateRentBillHeader(
  $condition: ModelRentBillHeaderConditionInput
  $input: CreateRentBillHeaderInput!
) {
  createRentBillHeader(condition: $condition, input: $input) {
    amountInWords
    balanceAmount
    billDate
    billNo
    cancelReason
    cancelledAt
    cancelledBy
    cgstAmount
    cgstRate
    confirmedAt
    confirmedBy
    createdAt
    dalaCharges
    discountAmount
    dueDate
    dumpCharges
    gstType
    id
    igstAmount
    igstRate
    insuranceAmount
    isActive
    kataiCharges
    loadingCharges
    notes
    organizationId
    otherCharges
    paidAmount
    partyGstin
    partyId
    partyName
    partyState
    partyVillage
    reloadCharges
    rentAmount
    roundOffAmount
    roundedAmount
    sgstAmount
    sgstRate
    status
    taxableAmount
    tdsAmount
    tdsRate
    totalAmount
    unloadingCharges
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateRentBillHeaderMutationVariables,
  APITypes.CreateRentBillHeaderMutation
>;
export const createRentBillItem = /* GraphQL */ `mutation CreateRentBillItem(
  $condition: ModelRentBillItemConditionInput
  $input: CreateRentBillItemInput!
) {
  createRentBillItem(condition: $condition, input: $input) {
    amadDate
    amadId
    amadNo
    arrivalDate
    bags
    billableDays
    commodityName
    createdAt
    dispatchDate
    graceDays
    id
    isActive
    organizationId
    partyName
    pkt1
    pkt2
    pkt3
    ratePerBag
    ratePerQtl
    rentAmount
    rentBillId
    storageDays
    updatedAt
    weightQtl
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateRentBillItemMutationVariables,
  APITypes.CreateRentBillItemMutation
>;
export const createRolePermission = /* GraphQL */ `mutation CreateRolePermission(
  $condition: ModelRolePermissionConditionInput
  $input: CreateRolePermissionInput!
) {
  createRolePermission(condition: $condition, input: $input) {
    accessAccounts
    accessBardana
    accessBilling
    accessInventory
    accessLoans
    accessPayroll
    accessReports
    accessSystem
    accessTrading
    canAdd
    canApproveLoans
    canBackdateEntry
    canChangeSettings
    canDelete
    canManageUsers
    canModify
    canPrint
    canYearEndClose
    createdAt
    id
    isActive
    organizationId
    role
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateRolePermissionMutationVariables,
  APITypes.CreateRolePermissionMutation
>;
export const createSauda = /* GraphQL */ `mutation CreateSauda(
  $condition: ModelSaudaConditionInput
  $input: CreateSaudaInput!
) {
  createSauda(condition: $condition, input: $input) {
    amount
    balanceQty
    buyerContact
    buyerLocation
    buyerPartyId
    buyerPartyName
    commodityId
    commodityName
    createdAt
    deliveryLocation
    dispatchedQty
    dueDate
    dueDays
    id
    isActive
    organizationId
    paymentTerms
    quantity
    rate
    remarks
    saudaDate
    saudaNo
    sellerPartyId
    sellerPartyName
    sellerVillage
    status
    updatedAt
    variety
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateSaudaMutationVariables,
  APITypes.CreateSaudaMutation
>;
export const createShifting = /* GraphQL */ `mutation CreateShifting(
  $condition: ModelShiftingConditionInput
  $input: CreateShiftingInput!
) {
  createShifting(condition: $condition, input: $input) {
    amadId
    amadNo
    commodityName
    createdAt
    fromChamberId
    fromFloorNumber
    fromRackNumber
    id
    isActive
    organizationId
    partyId
    partyName
    pkt1
    pkt2
    pkt3
    remarks
    shiftingHeaderId
    toChamberId
    toFloorNumber
    toRackNumber
    totalQuantity
    totalWeight
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateShiftingMutationVariables,
  APITypes.CreateShiftingMutation
>;
export const createShiftingHeader = /* GraphQL */ `mutation CreateShiftingHeader(
  $condition: ModelShiftingHeaderConditionInput
  $input: CreateShiftingHeaderInput!
) {
  createShiftingHeader(condition: $condition, input: $input) {
    completedAt
    createdAt
    fromChamberId
    fromChamberName
    id
    isActive
    organizationId
    reason
    remarks
    shiftDate
    shiftNo
    status
    toChamberId
    toChamberName
    totalItems
    totalQuantity
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateShiftingHeaderMutationVariables,
  APITypes.CreateShiftingHeaderMutation
>;
export const createStockTransfer = /* GraphQL */ `mutation CreateStockTransfer(
  $condition: ModelStockTransferConditionInput
  $input: CreateStockTransferInput!
) {
  createStockTransfer(condition: $condition, input: $input) {
    amadId
    amadNo
    commodityName
    createdAt
    date
    destRoom
    fromPartyId
    fromPartyName
    id
    isActive
    organizationId
    pkt1
    pkt2
    pkt3
    remarks
    sourceRoom
    status
    toPartyId
    toPartyName
    totalPackets
    totalWeight
    transferNo
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateStockTransferMutationVariables,
  APITypes.CreateStockTransferMutation
>;
export const createSystemConfig = /* GraphQL */ `mutation CreateSystemConfig(
  $condition: ModelSystemConfigConditionInput
  $input: CreateSystemConfigInput!
) {
  createSystemConfig(condition: $condition, input: $input) {
    additionalRentDays
    applyInterestOnBardana
    applyInterestOnLabor
    applyInterestOnRent
    autoCalculateInterest
    createdAt
    gradingRatePKT1
    gradingRatePKT2
    gradingRatePKT3
    id
    interestDaysInYear
    interestRate
    isActive
    loadingRatePKT1
    loadingRatePKT2
    loadingRatePKT3
    mapRequired
    mixPackets
    multiChamber
    organizationId
    partialLot
    pkt1Name
    pkt1Weight
    pkt2Name
    pkt2Weight
    pkt3Name
    pkt3Weight
    rentCalculationBasis
    rentProcessingMode
    searchOnCode
    searchOnMobile
    searchOnName
    separateVoucherNo
    showBalance
    showShadowBalance
    softwareMode
    unloadingRatePKT1
    unloadingRatePKT2
    unloadingRatePKT3
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateSystemConfigMutationVariables,
  APITypes.CreateSystemConfigMutation
>;
export const createTakpatti = /* GraphQL */ `mutation CreateTakpatti(
  $condition: ModelTakpattiConditionInput
  $input: CreateTakpattiInput!
) {
  createTakpatti(condition: $condition, input: $input) {
    amadId
    amadNo
    createdAt
    date
    id
    isActive
    organizationId
    pkt1
    pkt2
    pkt3
    room
    serialNo
    takpattiNo
    totalPackets
    totalWeight
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateTakpattiMutationVariables,
  APITypes.CreateTakpattiMutation
>;
export const createTemperatureLog = /* GraphQL */ `mutation CreateTemperatureLog(
  $condition: ModelTemperatureLogConditionInput
  $input: CreateTemperatureLogInput!
) {
  createTemperatureLog(condition: $condition, input: $input) {
    avgTemp
    chamberId
    chamberName
    createdAt
    date
    highTemp
    humidity
    id
    isActive
    lowTemp
    organizationId
    recordedBy
    remarks
    status
    time
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateTemperatureLogMutationVariables,
  APITypes.CreateTemperatureLogMutation
>;
export const createUnloading = /* GraphQL */ `mutation CreateUnloading(
  $condition: ModelUnloadingConditionInput
  $input: CreateUnloadingInput!
) {
  createUnloading(condition: $condition, input: $input) {
    amadId
    amadNo
    chamberId
    chamberName
    commodityName
    createdAt
    date
    floorNumber
    id
    isActive
    organizationId
    partyId
    partyName
    pkt1
    pkt2
    pkt3
    rackNumber
    remarks
    rentId
    rentSerialNo
    totalQuantity
    totalWeight
    unloadingNo
    updatedAt
    vehicleNo
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateUnloadingMutationVariables,
  APITypes.CreateUnloadingMutation
>;
export const createVillage = /* GraphQL */ `mutation CreateVillage(
  $condition: ModelVillageConditionInput
  $input: CreateVillageInput!
) {
  createVillage(condition: $condition, input: $input) {
    code
    createdAt
    districtName
    id
    isActive
    name
    nameHindi
    organizationId
    pincode
    road
    stateName
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateVillageMutationVariables,
  APITypes.CreateVillageMutation
>;
export const createVoucher = /* GraphQL */ `mutation CreateVoucher(
  $condition: ModelVoucherConditionInput
  $input: CreateVoucherInput!
) {
  createVoucher(condition: $condition, input: $input) {
    amount
    bankName
    bardanaAmount
    chequeDate
    chequeNo
    crAccountCode
    crAccountId
    crAccountName
    createdAt
    date
    drAccountCode
    drAccountId
    drAccountName
    id
    interestAmount
    isActive
    loanAmount
    narration
    organizationId
    otherAmount
    paymentMode
    rentAmount
    updatedAt
    voucherNo
    voucherType
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateVoucherMutationVariables,
  APITypes.CreateVoucherMutation
>;
export const deleteAccount = /* GraphQL */ `mutation DeleteAccount(
  $condition: ModelAccountConditionInput
  $input: DeleteAccountInput!
) {
  deleteAccount(condition: $condition, input: $input) {
    aadhar
    accountType
    address1
    address2
    balance
    barCr
    barDr
    city
    code
    cr
    createdAt
    dr
    drLimit
    gst
    id
    interestRate
    intrstCr
    intrstDr
    isActive
    level
    loanCr
    loanDr
    name
    nameHindi
    nature
    openingBalance
    organizationId
    othCr
    othDr
    pan
    parentId
    partyType
    phone
    pkt1A
    pkt1N
    pkt2A
    pkt2N
    pkt3A
    pkt3N
    rentCr
    rentDr
    state
    under
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteAccountMutationVariables,
  APITypes.DeleteAccountMutation
>;
export const deleteAdvance = /* GraphQL */ `mutation DeleteAdvance(
  $condition: ModelAdvanceConditionInput
  $input: DeleteAdvanceInput!
) {
  deleteAdvance(condition: $condition, input: $input) {
    advanceNo
    amount
    bardanaVoucherId
    convertedAmadId
    createdAt
    date
    expectedBags
    expectedDate
    id
    interestRate
    isActive
    narration
    organizationId
    partyId
    partyName
    paymentMode
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteAdvanceMutationVariables,
  APITypes.DeleteAdvanceMutation
>;
export const deleteAmad = /* GraphQL */ `mutation DeleteAmad(
  $condition: ModelAmadConditionInput
  $input: DeleteAmadInput!
) {
  deleteAmad(condition: $condition, input: $input) {
    amadNo
    chamberId
    chamberName
    commodityId
    commodityName
    createdAt
    dalaCharges
    date
    dispatchedPackets
    district
    eWayBillDate
    eWayBillNo
    floor
    graceDays
    graceDays1
    grading
    id
    isActive
    mark1
    mark2
    organizationId
    partyId
    partyMark
    partyName
    pkt1
    pkt2
    pkt3
    position
    post
    pwt1
    pwt2
    pwt3
    rentRate
    road
    room
    status
    takpattiNo
    totalPackets
    totalWeight
    transferRef
    updatedAt
    variety
    villageName
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteAmadMutationVariables,
  APITypes.DeleteAmadMutation
>;
export const deleteAttendance = /* GraphQL */ `mutation DeleteAttendance(
  $condition: ModelAttendanceConditionInput
  $input: DeleteAttendanceInput!
) {
  deleteAttendance(condition: $condition, input: $input) {
    createdAt
    date
    employeeCode
    employeeId
    employeeName
    hoursWorked
    id
    inTime
    isActive
    leaveType
    markedBy
    organizationId
    otHours
    outTime
    remarks
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteAttendanceMutationVariables,
  APITypes.DeleteAttendanceMutation
>;
export const deleteBank = /* GraphQL */ `mutation DeleteBank(
  $condition: ModelBankConditionInput
  $input: DeleteBankInput!
) {
  deleteBank(condition: $condition, input: $input) {
    code
    createdAt
    id
    ifscPattern
    isActive
    name
    organizationId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteBankMutationVariables,
  APITypes.DeleteBankMutation
>;
export const deleteBardanaIssueHeader = /* GraphQL */ `mutation DeleteBardanaIssueHeader(
  $condition: ModelBardanaIssueHeaderConditionInput
  $input: DeleteBardanaIssueHeaderInput!
) {
  deleteBardanaIssueHeader(condition: $condition, input: $input) {
    amadId
    amadNo
    confirmedAt
    confirmedBy
    createdAt
    expectedArrivalDate
    expectedBags
    id
    interestRatePm
    isActive
    issueDate
    issueType
    narration
    organizationId
    partyId
    partyName
    partyVillage
    referenceNo
    status
    totalAmount
    totalQuantity
    updatedAt
    voucherNo
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteBardanaIssueHeaderMutationVariables,
  APITypes.DeleteBardanaIssueHeaderMutation
>;
export const deleteBardanaIssueItem = /* GraphQL */ `mutation DeleteBardanaIssueItem(
  $condition: ModelBardanaIssueItemConditionInput
  $input: DeleteBardanaIssueItemInput!
) {
  deleteBardanaIssueItem(condition: $condition, input: $input) {
    amount
    bardanaTypeId
    bardanaTypeName
    createdAt
    id
    isActive
    issueHeaderId
    organizationId
    quantity
    rate
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteBardanaIssueItemMutationVariables,
  APITypes.DeleteBardanaIssueItemMutation
>;
export const deleteBardanaReceiptHeader = /* GraphQL */ `mutation DeleteBardanaReceiptHeader(
  $condition: ModelBardanaReceiptHeaderConditionInput
  $input: DeleteBardanaReceiptHeaderInput!
) {
  deleteBardanaReceiptHeader(condition: $condition, input: $input) {
    confirmedAt
    confirmedBy
    createdAt
    id
    isActive
    narration
    netAmount
    organizationId
    partyId
    partyName
    partyVillage
    receiptDate
    rentId
    rentSerialNo
    status
    totalAmount
    totalDamagedQuantity
    totalDeduction
    totalFairQuantity
    totalGoodQuantity
    totalQuantity
    updatedAt
    voucherNo
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteBardanaReceiptHeaderMutationVariables,
  APITypes.DeleteBardanaReceiptHeaderMutation
>;
export const deleteBardanaReceiptItem = /* GraphQL */ `mutation DeleteBardanaReceiptItem(
  $condition: ModelBardanaReceiptItemConditionInput
  $input: DeleteBardanaReceiptItemInput!
) {
  deleteBardanaReceiptItem(condition: $condition, input: $input) {
    amount
    bardanaTypeId
    bardanaTypeName
    condition
    createdAt
    creditRate
    deduction
    id
    isActive
    netAmount
    organizationId
    quantity
    rate
    receiptHeaderId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteBardanaReceiptItemMutationVariables,
  APITypes.DeleteBardanaReceiptItemMutation
>;
export const deleteBardanaStock = /* GraphQL */ `mutation DeleteBardanaStock(
  $condition: ModelBardanaStockConditionInput
  $input: DeleteBardanaStockInput!
) {
  deleteBardanaStock(condition: $condition, input: $input) {
    balance
    bardanaTypeId
    bardanaTypeName
    createdAt
    id
    isActive
    lastIssueDate
    lastReturnDate
    organizationId
    partyId
    partyName
    partyVillage
    totalIssued
    totalReturned
    totalValue
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteBardanaStockMutationVariables,
  APITypes.DeleteBardanaStockMutation
>;
export const deleteBardanaType = /* GraphQL */ `mutation DeleteBardanaType(
  $condition: ModelBardanaTypeConditionInput
  $input: DeleteBardanaTypeInput!
) {
  deleteBardanaType(condition: $condition, input: $input) {
    code
    createdAt
    currentStock
    defaultRate
    description
    id
    isActive
    name
    nameHindi
    openingStock
    organizationId
    unit
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteBardanaTypeMutationVariables,
  APITypes.DeleteBardanaTypeMutation
>;
export const deleteChamber = /* GraphQL */ `mutation DeleteChamber(
  $condition: ModelChamberConditionInput
  $input: DeleteChamberInput!
) {
  deleteChamber(condition: $condition, input: $input) {
    code
    createdAt
    currentTemperature
    description
    floors
    id
    isActive
    maxTemperature
    minTemperature
    name
    nameHindi
    organizationId
    rackCapacity
    racksPerRow
    roomNumber
    targetTemperature
    temperatureStatus
    totalRacks
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteChamberMutationVariables,
  APITypes.DeleteChamberMutation
>;
export const deleteChamberFloor = /* GraphQL */ `mutation DeleteChamberFloor(
  $condition: ModelChamberFloorConditionInput
  $input: DeleteChamberFloorInput!
) {
  deleteChamberFloor(condition: $condition, input: $input) {
    chamberId
    createdAt
    description
    floorName
    floorNumber
    fromRack
    id
    isActive
    organizationId
    racksPerRow
    toRack
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteChamberFloorMutationVariables,
  APITypes.DeleteChamberFloorMutation
>;
export const deleteCommodity = /* GraphQL */ `mutation DeleteCommodity(
  $condition: ModelCommodityConditionInput
  $input: DeleteCommodityInput!
) {
  deleteCommodity(condition: $condition, input: $input) {
    barcode
    chargeRentType
    code
    commodityType
    createdAt
    gracePeriod
    halfRentDays
    hsnCode
    id
    isActive
    loanRate
    mrp
    name
    nameHindi
    openingStock
    organizationId
    purchasePrice
    ratePerUnitField
    ratePerUnitMandi
    rateWT
    rentBasis
    rentCalculationMode
    rentOn
    rentRatePKT1
    rentRatePKT2
    rentRatePKT3
    salePrice
    updatedAt
    zeroRentDays
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteCommodityMutationVariables,
  APITypes.DeleteCommodityMutation
>;
export const deleteDWage = /* GraphQL */ `mutation DeleteDWage(
  $condition: ModelDWageConditionInput
  $input: DeleteDWageInput!
) {
  deleteDWage(condition: $condition, input: $input) {
    createdAt
    date
    deductions
    grossAmount
    hoursWorked
    id
    isActive
    isPaid
    netAmount
    organizationId
    paidAt
    paymentMode
    paymentRef
    ratePerHour
    ratePerUnit
    remarks
    serialNo
    unitsCompleted
    updatedAt
    workType
    workerContact
    workerName
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteDWageMutationVariables,
  APITypes.DeleteDWageMutation
>;
export const deleteDaybook = /* GraphQL */ `mutation DeleteDaybook(
  $condition: ModelDaybookConditionInput
  $input: DeleteDaybookInput!
) {
  deleteDaybook(condition: $condition, input: $input) {
    bankCloseCr
    bankCloseDr
    bankCr
    bankDr
    bankOpenCr
    bankOpenDr
    cashCloseCr
    cashCloseDr
    cashCr
    cashDr
    cashOpenCr
    cashOpenDr
    createdAt
    date
    description
    id
    isActive
    organizationId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteDaybookMutationVariables,
  APITypes.DeleteDaybookMutation
>;
export const deleteEmployee = /* GraphQL */ `mutation DeleteEmployee(
  $condition: ModelEmployeeConditionInput
  $input: DeleteEmployeeInput!
) {
  deleteEmployee(condition: $condition, input: $input) {
    aadharNo
    address
    bankAccountNo
    bankBranch
    bankIfsc
    bankName
    basicSalary
    casualLeaveBalance
    city
    code
    confirmationDate
    createdAt
    dateOfBirth
    earnedLeaveBalance
    email
    esiApplicable
    esiNo
    fatherName
    firstName
    gender
    grossSalary
    id
    isActive
    joiningDate
    lastName
    maritalStatus
    nameHindi
    organizationId
    panNo
    pfApplicable
    pfNo
    phone
    pincode
    postId
    postName
    relievingDate
    remarks
    resignationDate
    sickLeaveBalance
    state
    status
    uanNo
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteEmployeeMutationVariables,
  APITypes.DeleteEmployeeMutation
>;
export const deleteGatePass = /* GraphQL */ `mutation DeleteGatePass(
  $condition: ModelGatePassConditionInput
  $input: DeleteGatePassInput!
) {
  deleteGatePass(condition: $condition, input: $input) {
    amount
    biltiNo
    buyerLocation
    buyerPartyId
    buyerPartyName
    createdAt
    driverContact
    driverName
    gpDate
    gpNo
    gpTime
    id
    isActive
    organizationId
    rate
    remarks
    saudaId
    saudaNo
    sellerPartyId
    sellerPartyName
    sellerVillage
    status
    totalPackets
    totalPkt1
    totalPkt2
    totalPkt3
    totalWeight
    transport
    updatedAt
    vehicleNo
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteGatePassMutationVariables,
  APITypes.DeleteGatePassMutation
>;
export const deleteGatePassDetail = /* GraphQL */ `mutation DeleteGatePassDetail(
  $condition: ModelGatePassDetailConditionInput
  $input: DeleteGatePassDetailInput!
) {
  deleteGatePassDetail(condition: $condition, input: $input) {
    amadDate
    amadId
    amadNo
    amount
    commodityName
    createdAt
    gatePassId
    id
    isActive
    marks
    organizationId
    pkt1
    pkt2
    pkt3
    rate
    totalPackets
    updatedAt
    variety
    weight
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteGatePassDetailMutationVariables,
  APITypes.DeleteGatePassDetailMutation
>;
export const deleteGstRate = /* GraphQL */ `mutation DeleteGstRate(
  $condition: ModelGstRateConditionInput
  $input: DeleteGstRateInput!
) {
  deleteGstRate(condition: $condition, input: $input) {
    cgstRate
    createdAt
    description
    effectiveDate
    hsnCode
    id
    igstRate
    isActive
    organizationId
    sgstRate
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteGstRateMutationVariables,
  APITypes.DeleteGstRateMutation
>;
export const deleteKatai = /* GraphQL */ `mutation DeleteKatai(
  $condition: ModelKataiConditionInput
  $input: DeleteKataiInput!
) {
  deleteKatai(condition: $condition, input: $input) {
    amadId
    amadNo
    bagsGraded
    beejBags
    charges
    chattaBags
    createdAt
    gullaBags
    id
    isActive
    kataiDate
    kataiNo
    laborName
    laborRate
    mixBags
    motaBags
    organizationId
    partyId
    partyName
    remarks
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteKataiMutationVariables,
  APITypes.DeleteKataiMutation
>;
export const deleteLaborRate = /* GraphQL */ `mutation DeleteLaborRate(
  $condition: ModelLaborRateConditionInput
  $input: DeleteLaborRateInput!
) {
  deleteLaborRate(condition: $condition, input: $input) {
    createdAt
    effectiveDate
    id
    isActive
    organizationId
    ratePKT1
    ratePKT2
    ratePKT3
    rateType
    reason
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteLaborRateMutationVariables,
  APITypes.DeleteLaborRateMutation
>;
export const deleteLoading = /* GraphQL */ `mutation DeleteLoading(
  $condition: ModelLoadingConditionInput
  $input: DeleteLoadingInput!
) {
  deleteLoading(condition: $condition, input: $input) {
    amadId
    amadNo
    chamberId
    chamberName
    commodityName
    createdAt
    date
    floorNumber
    id
    isActive
    loadingNo
    organizationId
    partyId
    partyName
    pkt1
    pkt2
    pkt3
    rackNumber
    rackStatus
    remarks
    totalQuantity
    totalWeight
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteLoadingMutationVariables,
  APITypes.DeleteLoadingMutation
>;
export const deleteLoanAmount = /* GraphQL */ `mutation DeleteLoanAmount(
  $condition: ModelLoanAmountConditionInput
  $input: DeleteLoanAmountInput!
) {
  deleteLoanAmount(condition: $condition, input: $input) {
    amadId
    amadNo
    collateralBags
    createdAt
    date
    disbursedAmount
    id
    interestRate
    isActive
    loanNo
    narration
    organizationId
    outstandingBalance
    partyId
    partyName
    paymentMode
    repaidAmount
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteLoanAmountMutationVariables,
  APITypes.DeleteLoanAmountMutation
>;
export const deleteLoanPartyLedger = /* GraphQL */ `mutation DeleteLoanPartyLedger(
  $condition: ModelLoanPartyLedgerConditionInput
  $input: DeleteLoanPartyLedgerInput!
) {
  deleteLoanPartyLedger(condition: $condition, input: $input) {
    advanceId
    amadId
    balance
    createdAt
    creditAmount
    date
    debitAmount
    id
    interestRate
    isActive
    loanAmountId
    narration
    organizationId
    partyId
    serialNo
    transactionType
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteLoanPartyLedgerMutationVariables,
  APITypes.DeleteLoanPartyLedgerMutation
>;
export const deleteMeterReading = /* GraphQL */ `mutation DeleteMeterReading(
  $condition: ModelMeterReadingConditionInput
  $input: DeleteMeterReadingInput!
) {
  deleteMeterReading(condition: $condition, input: $input) {
    chamberId
    chamberName
    consumption
    createdAt
    currentReading
    id
    isActive
    meterNumber
    organizationId
    photoUrl
    previousReading
    readingDate
    readingTime
    recordedBy
    remarks
    unit
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteMeterReadingMutationVariables,
  APITypes.DeleteMeterReadingMutation
>;
export const deleteOrganization = /* GraphQL */ `mutation DeleteOrganization(
  $condition: ModelOrganizationConditionInput
  $input: DeleteOrganizationInput!
) {
  deleteOrganization(condition: $condition, input: $input) {
    address
    bankAccountNo
    bankBranch
    bankIfsc
    bankName
    billingStatus
    cinNo
    city
    configuredAt
    createdAt
    email
    fax
    financialYearEnd
    financialYearStart
    gstNo
    id
    isActive
    isConfigured
    memberships {
      nextToken
      __typename
    }
    name
    nameHindi
    panNo
    phone
    slug
    state
    tanNo
    timezone
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteOrganizationMutationVariables,
  APITypes.DeleteOrganizationMutation
>;
export const deleteOrganizationMembership = /* GraphQL */ `mutation DeleteOrganizationMembership(
  $condition: ModelOrganizationMembershipConditionInput
  $input: DeleteOrganizationMembershipInput!
) {
  deleteOrganizationMembership(condition: $condition, input: $input) {
    backdateEntryDays
    createdAt
    id
    isDefault
    joinedAt
    lastLoginAt
    loanPerBagLimit
    moduleAccessAccounts
    moduleAccessColdStorageReports
    moduleAccessMISReports
    moduleAccessMultiRoom
    moduleAccessPayroll
    organization {
      address
      bankAccountNo
      bankBranch
      bankIfsc
      bankName
      billingStatus
      cinNo
      city
      configuredAt
      createdAt
      email
      fax
      financialYearEnd
      financialYearStart
      gstNo
      id
      isActive
      isConfigured
      name
      nameHindi
      panNo
      phone
      slug
      state
      tanNo
      timezone
      updatedAt
      __typename
    }
    organizationId
    role
    status
    updatedAt
    userId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteOrganizationMembershipMutationVariables,
  APITypes.DeleteOrganizationMembershipMutation
>;
export const deletePartyLedger = /* GraphQL */ `mutation DeletePartyLedger(
  $condition: ModelPartyLedgerConditionInput
  $input: DeletePartyLedgerInput!
) {
  deletePartyLedger(condition: $condition, input: $input) {
    accountCode
    accountId
    accountName
    amadId
    amadNo
    amount
    barQtyIn
    barQtyOut
    bardana
    billNo
    createdAt
    date
    gpNo
    id
    interest
    isActive
    loan
    organizationId
    other
    rent
    rentId
    rentNo
    roi
    srNo
    updatedAt
    voucherType
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePartyLedgerMutationVariables,
  APITypes.DeletePartyLedgerMutation
>;
export const deletePayAllowance = /* GraphQL */ `mutation DeletePayAllowance(
  $condition: ModelPayAllowanceConditionInput
  $input: DeletePayAllowanceInput!
) {
  deletePayAllowance(condition: $condition, input: $input) {
    calculationBase
    code
    componentType
    createdAt
    defaultValue
    description
    id
    isActive
    isTaxable
    name
    nameHindi
    organizationId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePayAllowanceMutationVariables,
  APITypes.DeletePayAllowanceMutation
>;
export const deletePayDeduction = /* GraphQL */ `mutation DeletePayDeduction(
  $condition: ModelPayDeductionConditionInput
  $input: DeletePayDeductionInput!
) {
  deletePayDeduction(condition: $condition, input: $input) {
    calculationBase
    code
    componentType
    createdAt
    defaultValue
    description
    id
    isActive
    isStatutory
    name
    nameHindi
    organizationId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePayDeductionMutationVariables,
  APITypes.DeletePayDeductionMutation
>;
export const deletePayIncrements = /* GraphQL */ `mutation DeletePayIncrements(
  $condition: ModelPayIncrementsConditionInput
  $input: DeletePayIncrementsInput!
) {
  deletePayIncrements(condition: $condition, input: $input) {
    approvedAt
    approvedBy
    createdAt
    employeeCode
    employeeId
    employeeName
    esiRate
    id
    incrementAmount
    incrementDate
    incrementPercent
    isActive
    newBasic
    newGross
    organizationId
    pfRate
    previousBasic
    previousGross
    reason
    remarks
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePayIncrementsMutationVariables,
  APITypes.DeletePayIncrementsMutation
>;
export const deletePayLedger = /* GraphQL */ `mutation DeletePayLedger(
  $condition: ModelPayLedgerConditionInput
  $input: DeletePayLedgerInput!
) {
  deletePayLedger(condition: $condition, input: $input) {
    balance
    createdAt
    creditAmount
    date
    debitAmount
    employeeCode
    employeeId
    employeeName
    id
    isActive
    month
    narration
    organizationId
    paymentMode
    paymentRef
    referenceId
    referenceNo
    serialNo
    transactionType
    updatedAt
    year
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePayLedgerMutationVariables,
  APITypes.DeletePayLedgerMutation
>;
export const deletePayLoan = /* GraphQL */ `mutation DeletePayLoan(
  $condition: ModelPayLoanConditionInput
  $input: DeletePayLoanInput!
) {
  deletePayLoan(condition: $condition, input: $input) {
    approvedAt
    approvedBy
    createdAt
    emiAmount
    emisPaid
    emisRemaining
    employeeCode
    employeeId
    employeeName
    endDate
    id
    interestRate
    isActive
    lastEmiDate
    loanAmount
    loanDate
    loanNo
    narration
    organizationId
    outstandingBalance
    purpose
    startDate
    status
    tenure
    totalPaid
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePayLoanMutationVariables,
  APITypes.DeletePayLoanMutation
>;
export const deletePayPost = /* GraphQL */ `mutation DeletePayPost(
  $condition: ModelPayPostConditionInput
  $input: DeletePayPostInput!
) {
  deletePayPost(condition: $condition, input: $input) {
    basicSalary
    casualLeave
    code
    createdAt
    description
    earnedLeave
    esiApplicable
    id
    isActive
    name
    nameHindi
    organizationId
    otMultiplier
    otRate
    pfApplicable
    sickLeave
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePayPostMutationVariables,
  APITypes.DeletePayPostMutation
>;
export const deletePaySATTN = /* GraphQL */ `mutation DeletePaySATTN(
  $condition: ModelPaySATTNConditionInput
  $input: DeletePaySATTNInput!
) {
  deletePaySATTN(condition: $condition, input: $input) {
    absentDays
    advanceDeduction
    approvedAt
    approvedBy
    basicSalary
    createdAt
    effectiveDays
    employeeCode
    employeeId
    employeeName
    esiAmount
    grossSalary
    halfDays
    holidays
    id
    isActive
    leaveDays
    loanDeduction
    month
    netSalary
    organizationId
    otAmount
    otHours
    paidAt
    paidBy
    paymentMode
    paymentRef
    pfAmount
    postId
    postName
    presentDays
    processedAt
    processedBy
    remarks
    status
    tdsAmount
    totalAllowances
    totalDays
    totalDeductions
    updatedAt
    weeklyOffs
    workingDays
    year
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePaySATTNMutationVariables,
  APITypes.DeletePaySATTNMutation
>;
export const deletePaySAllowance = /* GraphQL */ `mutation DeletePaySAllowance(
  $condition: ModelPaySAllowanceConditionInput
  $input: DeletePaySAllowanceInput!
) {
  deletePaySAllowance(condition: $condition, input: $input) {
    allowanceCode
    allowanceId
    allowanceName
    componentType
    createdAt
    effectiveFrom
    effectiveTo
    employeeCode
    employeeId
    employeeName
    id
    isActive
    organizationId
    remarks
    updatedAt
    value
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePaySAllowanceMutationVariables,
  APITypes.DeletePaySAllowanceMutation
>;
export const deletePaySDeduction = /* GraphQL */ `mutation DeletePaySDeduction(
  $condition: ModelPaySDeductionConditionInput
  $input: DeletePaySDeductionInput!
) {
  deletePaySDeduction(condition: $condition, input: $input) {
    componentType
    createdAt
    deductionCode
    deductionId
    deductionName
    effectiveFrom
    effectiveTo
    employeeCode
    employeeId
    employeeName
    id
    isActive
    organizationId
    remarks
    updatedAt
    value
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePaySDeductionMutationVariables,
  APITypes.DeletePaySDeductionMutation
>;
export const deletePriceBreakup = /* GraphQL */ `mutation DeletePriceBreakup(
  $condition: ModelPriceBreakupConditionInput
  $input: DeletePriceBreakupInput!
) {
  deletePriceBreakup(condition: $condition, input: $input) {
    amount
    component
    createdAt
    description
    hsnCode
    id
    isActive
    organizationId
    quantity
    rate
    rentBillId
    unit
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePriceBreakupMutationVariables,
  APITypes.DeletePriceBreakupMutation
>;
export const deleteReceipt = /* GraphQL */ `mutation DeleteReceipt(
  $condition: ModelReceiptConditionInput
  $input: DeleteReceiptInput!
) {
  deleteReceipt(condition: $condition, input: $input) {
    amount
    amountInWords
    bankName
    bankRef
    branchName
    cancelReason
    cancelledAt
    cancelledBy
    chequeClearedDate
    chequeDate
    chequeNo
    confirmedAt
    confirmedBy
    createdAt
    id
    isActive
    isChequeCleared
    isPdcCheque
    narration
    organizationId
    partyId
    partyName
    paymentMode
    receiptDate
    receiptNo
    status
    updatedAt
    upiRef
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteReceiptMutationVariables,
  APITypes.DeleteReceiptMutation
>;
export const deleteReceiptAllocation = /* GraphQL */ `mutation DeleteReceiptAllocation(
  $condition: ModelReceiptAllocationConditionInput
  $input: DeleteReceiptAllocationInput!
) {
  deleteReceiptAllocation(condition: $condition, input: $input) {
    allocatedAmount
    billNo
    createdAt
    id
    isActive
    organizationId
    receiptId
    rentBillId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteReceiptAllocationMutationVariables,
  APITypes.DeleteReceiptAllocationMutation
>;
export const deleteRent = /* GraphQL */ `mutation DeleteRent(
  $condition: ModelRentConditionInput
  $input: DeleteRentInput!
) {
  deleteRent(condition: $condition, input: $input) {
    amadId
    amadNo
    amount
    billAmount
    cgst
    createdAt
    date
    dumpingAmt
    id
    igst
    isActive
    loadingAmt
    organizationId
    partyId
    partyName
    pkt1
    pkt2
    pkt3
    rate
    receiverName
    rent
    serialNo
    sgst
    storageDays
    totalPackets
    totalWeight
    unloadingAmt
    updatedAt
    vehicleNo
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteRentMutationVariables,
  APITypes.DeleteRentMutation
>;
export const deleteRentBillHeader = /* GraphQL */ `mutation DeleteRentBillHeader(
  $condition: ModelRentBillHeaderConditionInput
  $input: DeleteRentBillHeaderInput!
) {
  deleteRentBillHeader(condition: $condition, input: $input) {
    amountInWords
    balanceAmount
    billDate
    billNo
    cancelReason
    cancelledAt
    cancelledBy
    cgstAmount
    cgstRate
    confirmedAt
    confirmedBy
    createdAt
    dalaCharges
    discountAmount
    dueDate
    dumpCharges
    gstType
    id
    igstAmount
    igstRate
    insuranceAmount
    isActive
    kataiCharges
    loadingCharges
    notes
    organizationId
    otherCharges
    paidAmount
    partyGstin
    partyId
    partyName
    partyState
    partyVillage
    reloadCharges
    rentAmount
    roundOffAmount
    roundedAmount
    sgstAmount
    sgstRate
    status
    taxableAmount
    tdsAmount
    tdsRate
    totalAmount
    unloadingCharges
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteRentBillHeaderMutationVariables,
  APITypes.DeleteRentBillHeaderMutation
>;
export const deleteRentBillItem = /* GraphQL */ `mutation DeleteRentBillItem(
  $condition: ModelRentBillItemConditionInput
  $input: DeleteRentBillItemInput!
) {
  deleteRentBillItem(condition: $condition, input: $input) {
    amadDate
    amadId
    amadNo
    arrivalDate
    bags
    billableDays
    commodityName
    createdAt
    dispatchDate
    graceDays
    id
    isActive
    organizationId
    partyName
    pkt1
    pkt2
    pkt3
    ratePerBag
    ratePerQtl
    rentAmount
    rentBillId
    storageDays
    updatedAt
    weightQtl
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteRentBillItemMutationVariables,
  APITypes.DeleteRentBillItemMutation
>;
export const deleteRolePermission = /* GraphQL */ `mutation DeleteRolePermission(
  $condition: ModelRolePermissionConditionInput
  $input: DeleteRolePermissionInput!
) {
  deleteRolePermission(condition: $condition, input: $input) {
    accessAccounts
    accessBardana
    accessBilling
    accessInventory
    accessLoans
    accessPayroll
    accessReports
    accessSystem
    accessTrading
    canAdd
    canApproveLoans
    canBackdateEntry
    canChangeSettings
    canDelete
    canManageUsers
    canModify
    canPrint
    canYearEndClose
    createdAt
    id
    isActive
    organizationId
    role
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteRolePermissionMutationVariables,
  APITypes.DeleteRolePermissionMutation
>;
export const deleteSauda = /* GraphQL */ `mutation DeleteSauda(
  $condition: ModelSaudaConditionInput
  $input: DeleteSaudaInput!
) {
  deleteSauda(condition: $condition, input: $input) {
    amount
    balanceQty
    buyerContact
    buyerLocation
    buyerPartyId
    buyerPartyName
    commodityId
    commodityName
    createdAt
    deliveryLocation
    dispatchedQty
    dueDate
    dueDays
    id
    isActive
    organizationId
    paymentTerms
    quantity
    rate
    remarks
    saudaDate
    saudaNo
    sellerPartyId
    sellerPartyName
    sellerVillage
    status
    updatedAt
    variety
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteSaudaMutationVariables,
  APITypes.DeleteSaudaMutation
>;
export const deleteShifting = /* GraphQL */ `mutation DeleteShifting(
  $condition: ModelShiftingConditionInput
  $input: DeleteShiftingInput!
) {
  deleteShifting(condition: $condition, input: $input) {
    amadId
    amadNo
    commodityName
    createdAt
    fromChamberId
    fromFloorNumber
    fromRackNumber
    id
    isActive
    organizationId
    partyId
    partyName
    pkt1
    pkt2
    pkt3
    remarks
    shiftingHeaderId
    toChamberId
    toFloorNumber
    toRackNumber
    totalQuantity
    totalWeight
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteShiftingMutationVariables,
  APITypes.DeleteShiftingMutation
>;
export const deleteShiftingHeader = /* GraphQL */ `mutation DeleteShiftingHeader(
  $condition: ModelShiftingHeaderConditionInput
  $input: DeleteShiftingHeaderInput!
) {
  deleteShiftingHeader(condition: $condition, input: $input) {
    completedAt
    createdAt
    fromChamberId
    fromChamberName
    id
    isActive
    organizationId
    reason
    remarks
    shiftDate
    shiftNo
    status
    toChamberId
    toChamberName
    totalItems
    totalQuantity
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteShiftingHeaderMutationVariables,
  APITypes.DeleteShiftingHeaderMutation
>;
export const deleteStockTransfer = /* GraphQL */ `mutation DeleteStockTransfer(
  $condition: ModelStockTransferConditionInput
  $input: DeleteStockTransferInput!
) {
  deleteStockTransfer(condition: $condition, input: $input) {
    amadId
    amadNo
    commodityName
    createdAt
    date
    destRoom
    fromPartyId
    fromPartyName
    id
    isActive
    organizationId
    pkt1
    pkt2
    pkt3
    remarks
    sourceRoom
    status
    toPartyId
    toPartyName
    totalPackets
    totalWeight
    transferNo
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteStockTransferMutationVariables,
  APITypes.DeleteStockTransferMutation
>;
export const deleteSystemConfig = /* GraphQL */ `mutation DeleteSystemConfig(
  $condition: ModelSystemConfigConditionInput
  $input: DeleteSystemConfigInput!
) {
  deleteSystemConfig(condition: $condition, input: $input) {
    additionalRentDays
    applyInterestOnBardana
    applyInterestOnLabor
    applyInterestOnRent
    autoCalculateInterest
    createdAt
    gradingRatePKT1
    gradingRatePKT2
    gradingRatePKT3
    id
    interestDaysInYear
    interestRate
    isActive
    loadingRatePKT1
    loadingRatePKT2
    loadingRatePKT3
    mapRequired
    mixPackets
    multiChamber
    organizationId
    partialLot
    pkt1Name
    pkt1Weight
    pkt2Name
    pkt2Weight
    pkt3Name
    pkt3Weight
    rentCalculationBasis
    rentProcessingMode
    searchOnCode
    searchOnMobile
    searchOnName
    separateVoucherNo
    showBalance
    showShadowBalance
    softwareMode
    unloadingRatePKT1
    unloadingRatePKT2
    unloadingRatePKT3
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteSystemConfigMutationVariables,
  APITypes.DeleteSystemConfigMutation
>;
export const deleteTakpatti = /* GraphQL */ `mutation DeleteTakpatti(
  $condition: ModelTakpattiConditionInput
  $input: DeleteTakpattiInput!
) {
  deleteTakpatti(condition: $condition, input: $input) {
    amadId
    amadNo
    createdAt
    date
    id
    isActive
    organizationId
    pkt1
    pkt2
    pkt3
    room
    serialNo
    takpattiNo
    totalPackets
    totalWeight
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteTakpattiMutationVariables,
  APITypes.DeleteTakpattiMutation
>;
export const deleteTemperatureLog = /* GraphQL */ `mutation DeleteTemperatureLog(
  $condition: ModelTemperatureLogConditionInput
  $input: DeleteTemperatureLogInput!
) {
  deleteTemperatureLog(condition: $condition, input: $input) {
    avgTemp
    chamberId
    chamberName
    createdAt
    date
    highTemp
    humidity
    id
    isActive
    lowTemp
    organizationId
    recordedBy
    remarks
    status
    time
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteTemperatureLogMutationVariables,
  APITypes.DeleteTemperatureLogMutation
>;
export const deleteUnloading = /* GraphQL */ `mutation DeleteUnloading(
  $condition: ModelUnloadingConditionInput
  $input: DeleteUnloadingInput!
) {
  deleteUnloading(condition: $condition, input: $input) {
    amadId
    amadNo
    chamberId
    chamberName
    commodityName
    createdAt
    date
    floorNumber
    id
    isActive
    organizationId
    partyId
    partyName
    pkt1
    pkt2
    pkt3
    rackNumber
    remarks
    rentId
    rentSerialNo
    totalQuantity
    totalWeight
    unloadingNo
    updatedAt
    vehicleNo
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteUnloadingMutationVariables,
  APITypes.DeleteUnloadingMutation
>;
export const deleteVillage = /* GraphQL */ `mutation DeleteVillage(
  $condition: ModelVillageConditionInput
  $input: DeleteVillageInput!
) {
  deleteVillage(condition: $condition, input: $input) {
    code
    createdAt
    districtName
    id
    isActive
    name
    nameHindi
    organizationId
    pincode
    road
    stateName
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteVillageMutationVariables,
  APITypes.DeleteVillageMutation
>;
export const deleteVoucher = /* GraphQL */ `mutation DeleteVoucher(
  $condition: ModelVoucherConditionInput
  $input: DeleteVoucherInput!
) {
  deleteVoucher(condition: $condition, input: $input) {
    amount
    bankName
    bardanaAmount
    chequeDate
    chequeNo
    crAccountCode
    crAccountId
    crAccountName
    createdAt
    date
    drAccountCode
    drAccountId
    drAccountName
    id
    interestAmount
    isActive
    loanAmount
    narration
    organizationId
    otherAmount
    paymentMode
    rentAmount
    updatedAt
    voucherNo
    voucherType
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteVoucherMutationVariables,
  APITypes.DeleteVoucherMutation
>;
export const updateAccount = /* GraphQL */ `mutation UpdateAccount(
  $condition: ModelAccountConditionInput
  $input: UpdateAccountInput!
) {
  updateAccount(condition: $condition, input: $input) {
    aadhar
    accountType
    address1
    address2
    balance
    barCr
    barDr
    city
    code
    cr
    createdAt
    dr
    drLimit
    gst
    id
    interestRate
    intrstCr
    intrstDr
    isActive
    level
    loanCr
    loanDr
    name
    nameHindi
    nature
    openingBalance
    organizationId
    othCr
    othDr
    pan
    parentId
    partyType
    phone
    pkt1A
    pkt1N
    pkt2A
    pkt2N
    pkt3A
    pkt3N
    rentCr
    rentDr
    state
    under
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateAccountMutationVariables,
  APITypes.UpdateAccountMutation
>;
export const updateAdvance = /* GraphQL */ `mutation UpdateAdvance(
  $condition: ModelAdvanceConditionInput
  $input: UpdateAdvanceInput!
) {
  updateAdvance(condition: $condition, input: $input) {
    advanceNo
    amount
    bardanaVoucherId
    convertedAmadId
    createdAt
    date
    expectedBags
    expectedDate
    id
    interestRate
    isActive
    narration
    organizationId
    partyId
    partyName
    paymentMode
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateAdvanceMutationVariables,
  APITypes.UpdateAdvanceMutation
>;
export const updateAmad = /* GraphQL */ `mutation UpdateAmad(
  $condition: ModelAmadConditionInput
  $input: UpdateAmadInput!
) {
  updateAmad(condition: $condition, input: $input) {
    amadNo
    chamberId
    chamberName
    commodityId
    commodityName
    createdAt
    dalaCharges
    date
    dispatchedPackets
    district
    eWayBillDate
    eWayBillNo
    floor
    graceDays
    graceDays1
    grading
    id
    isActive
    mark1
    mark2
    organizationId
    partyId
    partyMark
    partyName
    pkt1
    pkt2
    pkt3
    position
    post
    pwt1
    pwt2
    pwt3
    rentRate
    road
    room
    status
    takpattiNo
    totalPackets
    totalWeight
    transferRef
    updatedAt
    variety
    villageName
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateAmadMutationVariables,
  APITypes.UpdateAmadMutation
>;
export const updateAttendance = /* GraphQL */ `mutation UpdateAttendance(
  $condition: ModelAttendanceConditionInput
  $input: UpdateAttendanceInput!
) {
  updateAttendance(condition: $condition, input: $input) {
    createdAt
    date
    employeeCode
    employeeId
    employeeName
    hoursWorked
    id
    inTime
    isActive
    leaveType
    markedBy
    organizationId
    otHours
    outTime
    remarks
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateAttendanceMutationVariables,
  APITypes.UpdateAttendanceMutation
>;
export const updateBank = /* GraphQL */ `mutation UpdateBank(
  $condition: ModelBankConditionInput
  $input: UpdateBankInput!
) {
  updateBank(condition: $condition, input: $input) {
    code
    createdAt
    id
    ifscPattern
    isActive
    name
    organizationId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateBankMutationVariables,
  APITypes.UpdateBankMutation
>;
export const updateBardanaIssueHeader = /* GraphQL */ `mutation UpdateBardanaIssueHeader(
  $condition: ModelBardanaIssueHeaderConditionInput
  $input: UpdateBardanaIssueHeaderInput!
) {
  updateBardanaIssueHeader(condition: $condition, input: $input) {
    amadId
    amadNo
    confirmedAt
    confirmedBy
    createdAt
    expectedArrivalDate
    expectedBags
    id
    interestRatePm
    isActive
    issueDate
    issueType
    narration
    organizationId
    partyId
    partyName
    partyVillage
    referenceNo
    status
    totalAmount
    totalQuantity
    updatedAt
    voucherNo
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateBardanaIssueHeaderMutationVariables,
  APITypes.UpdateBardanaIssueHeaderMutation
>;
export const updateBardanaIssueItem = /* GraphQL */ `mutation UpdateBardanaIssueItem(
  $condition: ModelBardanaIssueItemConditionInput
  $input: UpdateBardanaIssueItemInput!
) {
  updateBardanaIssueItem(condition: $condition, input: $input) {
    amount
    bardanaTypeId
    bardanaTypeName
    createdAt
    id
    isActive
    issueHeaderId
    organizationId
    quantity
    rate
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateBardanaIssueItemMutationVariables,
  APITypes.UpdateBardanaIssueItemMutation
>;
export const updateBardanaReceiptHeader = /* GraphQL */ `mutation UpdateBardanaReceiptHeader(
  $condition: ModelBardanaReceiptHeaderConditionInput
  $input: UpdateBardanaReceiptHeaderInput!
) {
  updateBardanaReceiptHeader(condition: $condition, input: $input) {
    confirmedAt
    confirmedBy
    createdAt
    id
    isActive
    narration
    netAmount
    organizationId
    partyId
    partyName
    partyVillage
    receiptDate
    rentId
    rentSerialNo
    status
    totalAmount
    totalDamagedQuantity
    totalDeduction
    totalFairQuantity
    totalGoodQuantity
    totalQuantity
    updatedAt
    voucherNo
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateBardanaReceiptHeaderMutationVariables,
  APITypes.UpdateBardanaReceiptHeaderMutation
>;
export const updateBardanaReceiptItem = /* GraphQL */ `mutation UpdateBardanaReceiptItem(
  $condition: ModelBardanaReceiptItemConditionInput
  $input: UpdateBardanaReceiptItemInput!
) {
  updateBardanaReceiptItem(condition: $condition, input: $input) {
    amount
    bardanaTypeId
    bardanaTypeName
    condition
    createdAt
    creditRate
    deduction
    id
    isActive
    netAmount
    organizationId
    quantity
    rate
    receiptHeaderId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateBardanaReceiptItemMutationVariables,
  APITypes.UpdateBardanaReceiptItemMutation
>;
export const updateBardanaStock = /* GraphQL */ `mutation UpdateBardanaStock(
  $condition: ModelBardanaStockConditionInput
  $input: UpdateBardanaStockInput!
) {
  updateBardanaStock(condition: $condition, input: $input) {
    balance
    bardanaTypeId
    bardanaTypeName
    createdAt
    id
    isActive
    lastIssueDate
    lastReturnDate
    organizationId
    partyId
    partyName
    partyVillage
    totalIssued
    totalReturned
    totalValue
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateBardanaStockMutationVariables,
  APITypes.UpdateBardanaStockMutation
>;
export const updateBardanaType = /* GraphQL */ `mutation UpdateBardanaType(
  $condition: ModelBardanaTypeConditionInput
  $input: UpdateBardanaTypeInput!
) {
  updateBardanaType(condition: $condition, input: $input) {
    code
    createdAt
    currentStock
    defaultRate
    description
    id
    isActive
    name
    nameHindi
    openingStock
    organizationId
    unit
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateBardanaTypeMutationVariables,
  APITypes.UpdateBardanaTypeMutation
>;
export const updateChamber = /* GraphQL */ `mutation UpdateChamber(
  $condition: ModelChamberConditionInput
  $input: UpdateChamberInput!
) {
  updateChamber(condition: $condition, input: $input) {
    code
    createdAt
    currentTemperature
    description
    floors
    id
    isActive
    maxTemperature
    minTemperature
    name
    nameHindi
    organizationId
    rackCapacity
    racksPerRow
    roomNumber
    targetTemperature
    temperatureStatus
    totalRacks
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateChamberMutationVariables,
  APITypes.UpdateChamberMutation
>;
export const updateChamberFloor = /* GraphQL */ `mutation UpdateChamberFloor(
  $condition: ModelChamberFloorConditionInput
  $input: UpdateChamberFloorInput!
) {
  updateChamberFloor(condition: $condition, input: $input) {
    chamberId
    createdAt
    description
    floorName
    floorNumber
    fromRack
    id
    isActive
    organizationId
    racksPerRow
    toRack
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateChamberFloorMutationVariables,
  APITypes.UpdateChamberFloorMutation
>;
export const updateCommodity = /* GraphQL */ `mutation UpdateCommodity(
  $condition: ModelCommodityConditionInput
  $input: UpdateCommodityInput!
) {
  updateCommodity(condition: $condition, input: $input) {
    barcode
    chargeRentType
    code
    commodityType
    createdAt
    gracePeriod
    halfRentDays
    hsnCode
    id
    isActive
    loanRate
    mrp
    name
    nameHindi
    openingStock
    organizationId
    purchasePrice
    ratePerUnitField
    ratePerUnitMandi
    rateWT
    rentBasis
    rentCalculationMode
    rentOn
    rentRatePKT1
    rentRatePKT2
    rentRatePKT3
    salePrice
    updatedAt
    zeroRentDays
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateCommodityMutationVariables,
  APITypes.UpdateCommodityMutation
>;
export const updateDWage = /* GraphQL */ `mutation UpdateDWage(
  $condition: ModelDWageConditionInput
  $input: UpdateDWageInput!
) {
  updateDWage(condition: $condition, input: $input) {
    createdAt
    date
    deductions
    grossAmount
    hoursWorked
    id
    isActive
    isPaid
    netAmount
    organizationId
    paidAt
    paymentMode
    paymentRef
    ratePerHour
    ratePerUnit
    remarks
    serialNo
    unitsCompleted
    updatedAt
    workType
    workerContact
    workerName
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateDWageMutationVariables,
  APITypes.UpdateDWageMutation
>;
export const updateDaybook = /* GraphQL */ `mutation UpdateDaybook(
  $condition: ModelDaybookConditionInput
  $input: UpdateDaybookInput!
) {
  updateDaybook(condition: $condition, input: $input) {
    bankCloseCr
    bankCloseDr
    bankCr
    bankDr
    bankOpenCr
    bankOpenDr
    cashCloseCr
    cashCloseDr
    cashCr
    cashDr
    cashOpenCr
    cashOpenDr
    createdAt
    date
    description
    id
    isActive
    organizationId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateDaybookMutationVariables,
  APITypes.UpdateDaybookMutation
>;
export const updateEmployee = /* GraphQL */ `mutation UpdateEmployee(
  $condition: ModelEmployeeConditionInput
  $input: UpdateEmployeeInput!
) {
  updateEmployee(condition: $condition, input: $input) {
    aadharNo
    address
    bankAccountNo
    bankBranch
    bankIfsc
    bankName
    basicSalary
    casualLeaveBalance
    city
    code
    confirmationDate
    createdAt
    dateOfBirth
    earnedLeaveBalance
    email
    esiApplicable
    esiNo
    fatherName
    firstName
    gender
    grossSalary
    id
    isActive
    joiningDate
    lastName
    maritalStatus
    nameHindi
    organizationId
    panNo
    pfApplicable
    pfNo
    phone
    pincode
    postId
    postName
    relievingDate
    remarks
    resignationDate
    sickLeaveBalance
    state
    status
    uanNo
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateEmployeeMutationVariables,
  APITypes.UpdateEmployeeMutation
>;
export const updateGatePass = /* GraphQL */ `mutation UpdateGatePass(
  $condition: ModelGatePassConditionInput
  $input: UpdateGatePassInput!
) {
  updateGatePass(condition: $condition, input: $input) {
    amount
    biltiNo
    buyerLocation
    buyerPartyId
    buyerPartyName
    createdAt
    driverContact
    driverName
    gpDate
    gpNo
    gpTime
    id
    isActive
    organizationId
    rate
    remarks
    saudaId
    saudaNo
    sellerPartyId
    sellerPartyName
    sellerVillage
    status
    totalPackets
    totalPkt1
    totalPkt2
    totalPkt3
    totalWeight
    transport
    updatedAt
    vehicleNo
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateGatePassMutationVariables,
  APITypes.UpdateGatePassMutation
>;
export const updateGatePassDetail = /* GraphQL */ `mutation UpdateGatePassDetail(
  $condition: ModelGatePassDetailConditionInput
  $input: UpdateGatePassDetailInput!
) {
  updateGatePassDetail(condition: $condition, input: $input) {
    amadDate
    amadId
    amadNo
    amount
    commodityName
    createdAt
    gatePassId
    id
    isActive
    marks
    organizationId
    pkt1
    pkt2
    pkt3
    rate
    totalPackets
    updatedAt
    variety
    weight
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateGatePassDetailMutationVariables,
  APITypes.UpdateGatePassDetailMutation
>;
export const updateGstRate = /* GraphQL */ `mutation UpdateGstRate(
  $condition: ModelGstRateConditionInput
  $input: UpdateGstRateInput!
) {
  updateGstRate(condition: $condition, input: $input) {
    cgstRate
    createdAt
    description
    effectiveDate
    hsnCode
    id
    igstRate
    isActive
    organizationId
    sgstRate
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateGstRateMutationVariables,
  APITypes.UpdateGstRateMutation
>;
export const updateKatai = /* GraphQL */ `mutation UpdateKatai(
  $condition: ModelKataiConditionInput
  $input: UpdateKataiInput!
) {
  updateKatai(condition: $condition, input: $input) {
    amadId
    amadNo
    bagsGraded
    beejBags
    charges
    chattaBags
    createdAt
    gullaBags
    id
    isActive
    kataiDate
    kataiNo
    laborName
    laborRate
    mixBags
    motaBags
    organizationId
    partyId
    partyName
    remarks
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateKataiMutationVariables,
  APITypes.UpdateKataiMutation
>;
export const updateLaborRate = /* GraphQL */ `mutation UpdateLaborRate(
  $condition: ModelLaborRateConditionInput
  $input: UpdateLaborRateInput!
) {
  updateLaborRate(condition: $condition, input: $input) {
    createdAt
    effectiveDate
    id
    isActive
    organizationId
    ratePKT1
    ratePKT2
    ratePKT3
    rateType
    reason
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateLaborRateMutationVariables,
  APITypes.UpdateLaborRateMutation
>;
export const updateLoading = /* GraphQL */ `mutation UpdateLoading(
  $condition: ModelLoadingConditionInput
  $input: UpdateLoadingInput!
) {
  updateLoading(condition: $condition, input: $input) {
    amadId
    amadNo
    chamberId
    chamberName
    commodityName
    createdAt
    date
    floorNumber
    id
    isActive
    loadingNo
    organizationId
    partyId
    partyName
    pkt1
    pkt2
    pkt3
    rackNumber
    rackStatus
    remarks
    totalQuantity
    totalWeight
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateLoadingMutationVariables,
  APITypes.UpdateLoadingMutation
>;
export const updateLoanAmount = /* GraphQL */ `mutation UpdateLoanAmount(
  $condition: ModelLoanAmountConditionInput
  $input: UpdateLoanAmountInput!
) {
  updateLoanAmount(condition: $condition, input: $input) {
    amadId
    amadNo
    collateralBags
    createdAt
    date
    disbursedAmount
    id
    interestRate
    isActive
    loanNo
    narration
    organizationId
    outstandingBalance
    partyId
    partyName
    paymentMode
    repaidAmount
    status
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateLoanAmountMutationVariables,
  APITypes.UpdateLoanAmountMutation
>;
export const updateLoanPartyLedger = /* GraphQL */ `mutation UpdateLoanPartyLedger(
  $condition: ModelLoanPartyLedgerConditionInput
  $input: UpdateLoanPartyLedgerInput!
) {
  updateLoanPartyLedger(condition: $condition, input: $input) {
    advanceId
    amadId
    balance
    createdAt
    creditAmount
    date
    debitAmount
    id
    interestRate
    isActive
    loanAmountId
    narration
    organizationId
    partyId
    serialNo
    transactionType
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateLoanPartyLedgerMutationVariables,
  APITypes.UpdateLoanPartyLedgerMutation
>;
export const updateMeterReading = /* GraphQL */ `mutation UpdateMeterReading(
  $condition: ModelMeterReadingConditionInput
  $input: UpdateMeterReadingInput!
) {
  updateMeterReading(condition: $condition, input: $input) {
    chamberId
    chamberName
    consumption
    createdAt
    currentReading
    id
    isActive
    meterNumber
    organizationId
    photoUrl
    previousReading
    readingDate
    readingTime
    recordedBy
    remarks
    unit
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateMeterReadingMutationVariables,
  APITypes.UpdateMeterReadingMutation
>;
export const updateOrganization = /* GraphQL */ `mutation UpdateOrganization(
  $condition: ModelOrganizationConditionInput
  $input: UpdateOrganizationInput!
) {
  updateOrganization(condition: $condition, input: $input) {
    address
    bankAccountNo
    bankBranch
    bankIfsc
    bankName
    billingStatus
    cinNo
    city
    configuredAt
    createdAt
    email
    fax
    financialYearEnd
    financialYearStart
    gstNo
    id
    isActive
    isConfigured
    memberships {
      nextToken
      __typename
    }
    name
    nameHindi
    panNo
    phone
    slug
    state
    tanNo
    timezone
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateOrganizationMutationVariables,
  APITypes.UpdateOrganizationMutation
>;
export const updateOrganizationMembership = /* GraphQL */ `mutation UpdateOrganizationMembership(
  $condition: ModelOrganizationMembershipConditionInput
  $input: UpdateOrganizationMembershipInput!
) {
  updateOrganizationMembership(condition: $condition, input: $input) {
    backdateEntryDays
    createdAt
    id
    isDefault
    joinedAt
    lastLoginAt
    loanPerBagLimit
    moduleAccessAccounts
    moduleAccessColdStorageReports
    moduleAccessMISReports
    moduleAccessMultiRoom
    moduleAccessPayroll
    organization {
      address
      bankAccountNo
      bankBranch
      bankIfsc
      bankName
      billingStatus
      cinNo
      city
      configuredAt
      createdAt
      email
      fax
      financialYearEnd
      financialYearStart
      gstNo
      id
      isActive
      isConfigured
      name
      nameHindi
      panNo
      phone
      slug
      state
      tanNo
      timezone
      updatedAt
      __typename
    }
    organizationId
    role
    status
    updatedAt
    userId
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateOrganizationMembershipMutationVariables,
  APITypes.UpdateOrganizationMembershipMutation
>;
export const updatePartyLedger = /* GraphQL */ `mutation UpdatePartyLedger(
  $condition: ModelPartyLedgerConditionInput
  $input: UpdatePartyLedgerInput!
) {
  updatePartyLedger(condition: $condition, input: $input) {
    accountCode
    accountId
    accountName
    amadId
    amadNo
    amount
    barQtyIn
    barQtyOut
    bardana
    billNo
    createdAt
    date
    gpNo
    id
    interest
    isActive
    loan
    organizationId
    other
    rent
    rentId
    rentNo
    roi
    srNo
    updatedAt
    voucherType
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePartyLedgerMutationVariables,
  APITypes.UpdatePartyLedgerMutation
>;
export const updatePayAllowance = /* GraphQL */ `mutation UpdatePayAllowance(
  $condition: ModelPayAllowanceConditionInput
  $input: UpdatePayAllowanceInput!
) {
  updatePayAllowance(condition: $condition, input: $input) {
    calculationBase
    code
    componentType
    createdAt
    defaultValue
    description
    id
    isActive
    isTaxable
    name
    nameHindi
    organizationId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePayAllowanceMutationVariables,
  APITypes.UpdatePayAllowanceMutation
>;
export const updatePayDeduction = /* GraphQL */ `mutation UpdatePayDeduction(
  $condition: ModelPayDeductionConditionInput
  $input: UpdatePayDeductionInput!
) {
  updatePayDeduction(condition: $condition, input: $input) {
    calculationBase
    code
    componentType
    createdAt
    defaultValue
    description
    id
    isActive
    isStatutory
    name
    nameHindi
    organizationId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePayDeductionMutationVariables,
  APITypes.UpdatePayDeductionMutation
>;
export const updatePayIncrements = /* GraphQL */ `mutation UpdatePayIncrements(
  $condition: ModelPayIncrementsConditionInput
  $input: UpdatePayIncrementsInput!
) {
  updatePayIncrements(condition: $condition, input: $input) {
    approvedAt
    approvedBy
    createdAt
    employeeCode
    employeeId
    employeeName
    esiRate
    id
    incrementAmount
    incrementDate
    incrementPercent
    isActive
    newBasic
    newGross
    organizationId
    pfRate
    previousBasic
    previousGross
    reason
    remarks
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePayIncrementsMutationVariables,
  APITypes.UpdatePayIncrementsMutation
>;
export const updatePayLedger = /* GraphQL */ `mutation UpdatePayLedger(
  $condition: ModelPayLedgerConditionInput
  $input: UpdatePayLedgerInput!
) {
  updatePayLedger(condition: $condition, input: $input) {
    balance
    createdAt
    creditAmount
    date
    debitAmount
    employeeCode
    employeeId
    employeeName
    id
    isActive
    month
    narration
    organizationId
    paymentMode
    paymentRef
    referenceId
    referenceNo
    serialNo
    transactionType
    updatedAt
    year
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePayLedgerMutationVariables,
  APITypes.UpdatePayLedgerMutation
>;
export const updatePayLoan = /* GraphQL */ `mutation UpdatePayLoan(
  $condition: ModelPayLoanConditionInput
  $input: UpdatePayLoanInput!
) {
  updatePayLoan(condition: $condition, input: $input) {
    approvedAt
    approvedBy
    createdAt
    emiAmount
    emisPaid
    emisRemaining
    employeeCode
    employeeId
    employeeName
    endDate
    id
    interestRate
    isActive
    lastEmiDate
    loanAmount
    loanDate
    loanNo
    narration
    organizationId
    outstandingBalance
    purpose
    startDate
    status
    tenure
    totalPaid
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePayLoanMutationVariables,
  APITypes.UpdatePayLoanMutation
>;
export const updatePayPost = /* GraphQL */ `mutation UpdatePayPost(
  $condition: ModelPayPostConditionInput
  $input: UpdatePayPostInput!
) {
  updatePayPost(condition: $condition, input: $input) {
    basicSalary
    casualLeave
    code
    createdAt
    description
    earnedLeave
    esiApplicable
    id
    isActive
    name
    nameHindi
    organizationId
    otMultiplier
    otRate
    pfApplicable
    sickLeave
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePayPostMutationVariables,
  APITypes.UpdatePayPostMutation
>;
export const updatePaySATTN = /* GraphQL */ `mutation UpdatePaySATTN(
  $condition: ModelPaySATTNConditionInput
  $input: UpdatePaySATTNInput!
) {
  updatePaySATTN(condition: $condition, input: $input) {
    absentDays
    advanceDeduction
    approvedAt
    approvedBy
    basicSalary
    createdAt
    effectiveDays
    employeeCode
    employeeId
    employeeName
    esiAmount
    grossSalary
    halfDays
    holidays
    id
    isActive
    leaveDays
    loanDeduction
    month
    netSalary
    organizationId
    otAmount
    otHours
    paidAt
    paidBy
    paymentMode
    paymentRef
    pfAmount
    postId
    postName
    presentDays
    processedAt
    processedBy
    remarks
    status
    tdsAmount
    totalAllowances
    totalDays
    totalDeductions
    updatedAt
    weeklyOffs
    workingDays
    year
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePaySATTNMutationVariables,
  APITypes.UpdatePaySATTNMutation
>;
export const updatePaySAllowance = /* GraphQL */ `mutation UpdatePaySAllowance(
  $condition: ModelPaySAllowanceConditionInput
  $input: UpdatePaySAllowanceInput!
) {
  updatePaySAllowance(condition: $condition, input: $input) {
    allowanceCode
    allowanceId
    allowanceName
    componentType
    createdAt
    effectiveFrom
    effectiveTo
    employeeCode
    employeeId
    employeeName
    id
    isActive
    organizationId
    remarks
    updatedAt
    value
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePaySAllowanceMutationVariables,
  APITypes.UpdatePaySAllowanceMutation
>;
export const updatePaySDeduction = /* GraphQL */ `mutation UpdatePaySDeduction(
  $condition: ModelPaySDeductionConditionInput
  $input: UpdatePaySDeductionInput!
) {
  updatePaySDeduction(condition: $condition, input: $input) {
    componentType
    createdAt
    deductionCode
    deductionId
    deductionName
    effectiveFrom
    effectiveTo
    employeeCode
    employeeId
    employeeName
    id
    isActive
    organizationId
    remarks
    updatedAt
    value
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePaySDeductionMutationVariables,
  APITypes.UpdatePaySDeductionMutation
>;
export const updatePriceBreakup = /* GraphQL */ `mutation UpdatePriceBreakup(
  $condition: ModelPriceBreakupConditionInput
  $input: UpdatePriceBreakupInput!
) {
  updatePriceBreakup(condition: $condition, input: $input) {
    amount
    component
    createdAt
    description
    hsnCode
    id
    isActive
    organizationId
    quantity
    rate
    rentBillId
    unit
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePriceBreakupMutationVariables,
  APITypes.UpdatePriceBreakupMutation
>;
export const updateReceipt = /* GraphQL */ `mutation UpdateReceipt(
  $condition: ModelReceiptConditionInput
  $input: UpdateReceiptInput!
) {
  updateReceipt(condition: $condition, input: $input) {
    amount
    amountInWords
    bankName
    bankRef
    branchName
    cancelReason
    cancelledAt
    cancelledBy
    chequeClearedDate
    chequeDate
    chequeNo
    confirmedAt
    confirmedBy
    createdAt
    id
    isActive
    isChequeCleared
    isPdcCheque
    narration
    organizationId
    partyId
    partyName
    paymentMode
    receiptDate
    receiptNo
    status
    updatedAt
    upiRef
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateReceiptMutationVariables,
  APITypes.UpdateReceiptMutation
>;
export const updateReceiptAllocation = /* GraphQL */ `mutation UpdateReceiptAllocation(
  $condition: ModelReceiptAllocationConditionInput
  $input: UpdateReceiptAllocationInput!
) {
  updateReceiptAllocation(condition: $condition, input: $input) {
    allocatedAmount
    billNo
    createdAt
    id
    isActive
    organizationId
    receiptId
    rentBillId
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateReceiptAllocationMutationVariables,
  APITypes.UpdateReceiptAllocationMutation
>;
export const updateRent = /* GraphQL */ `mutation UpdateRent(
  $condition: ModelRentConditionInput
  $input: UpdateRentInput!
) {
  updateRent(condition: $condition, input: $input) {
    amadId
    amadNo
    amount
    billAmount
    cgst
    createdAt
    date
    dumpingAmt
    id
    igst
    isActive
    loadingAmt
    organizationId
    partyId
    partyName
    pkt1
    pkt2
    pkt3
    rate
    receiverName
    rent
    serialNo
    sgst
    storageDays
    totalPackets
    totalWeight
    unloadingAmt
    updatedAt
    vehicleNo
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateRentMutationVariables,
  APITypes.UpdateRentMutation
>;
export const updateRentBillHeader = /* GraphQL */ `mutation UpdateRentBillHeader(
  $condition: ModelRentBillHeaderConditionInput
  $input: UpdateRentBillHeaderInput!
) {
  updateRentBillHeader(condition: $condition, input: $input) {
    amountInWords
    balanceAmount
    billDate
    billNo
    cancelReason
    cancelledAt
    cancelledBy
    cgstAmount
    cgstRate
    confirmedAt
    confirmedBy
    createdAt
    dalaCharges
    discountAmount
    dueDate
    dumpCharges
    gstType
    id
    igstAmount
    igstRate
    insuranceAmount
    isActive
    kataiCharges
    loadingCharges
    notes
    organizationId
    otherCharges
    paidAmount
    partyGstin
    partyId
    partyName
    partyState
    partyVillage
    reloadCharges
    rentAmount
    roundOffAmount
    roundedAmount
    sgstAmount
    sgstRate
    status
    taxableAmount
    tdsAmount
    tdsRate
    totalAmount
    unloadingCharges
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateRentBillHeaderMutationVariables,
  APITypes.UpdateRentBillHeaderMutation
>;
export const updateRentBillItem = /* GraphQL */ `mutation UpdateRentBillItem(
  $condition: ModelRentBillItemConditionInput
  $input: UpdateRentBillItemInput!
) {
  updateRentBillItem(condition: $condition, input: $input) {
    amadDate
    amadId
    amadNo
    arrivalDate
    bags
    billableDays
    commodityName
    createdAt
    dispatchDate
    graceDays
    id
    isActive
    organizationId
    partyName
    pkt1
    pkt2
    pkt3
    ratePerBag
    ratePerQtl
    rentAmount
    rentBillId
    storageDays
    updatedAt
    weightQtl
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateRentBillItemMutationVariables,
  APITypes.UpdateRentBillItemMutation
>;
export const updateRolePermission = /* GraphQL */ `mutation UpdateRolePermission(
  $condition: ModelRolePermissionConditionInput
  $input: UpdateRolePermissionInput!
) {
  updateRolePermission(condition: $condition, input: $input) {
    accessAccounts
    accessBardana
    accessBilling
    accessInventory
    accessLoans
    accessPayroll
    accessReports
    accessSystem
    accessTrading
    canAdd
    canApproveLoans
    canBackdateEntry
    canChangeSettings
    canDelete
    canManageUsers
    canModify
    canPrint
    canYearEndClose
    createdAt
    id
    isActive
    organizationId
    role
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateRolePermissionMutationVariables,
  APITypes.UpdateRolePermissionMutation
>;
export const updateSauda = /* GraphQL */ `mutation UpdateSauda(
  $condition: ModelSaudaConditionInput
  $input: UpdateSaudaInput!
) {
  updateSauda(condition: $condition, input: $input) {
    amount
    balanceQty
    buyerContact
    buyerLocation
    buyerPartyId
    buyerPartyName
    commodityId
    commodityName
    createdAt
    deliveryLocation
    dispatchedQty
    dueDate
    dueDays
    id
    isActive
    organizationId
    paymentTerms
    quantity
    rate
    remarks
    saudaDate
    saudaNo
    sellerPartyId
    sellerPartyName
    sellerVillage
    status
    updatedAt
    variety
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateSaudaMutationVariables,
  APITypes.UpdateSaudaMutation
>;
export const updateShifting = /* GraphQL */ `mutation UpdateShifting(
  $condition: ModelShiftingConditionInput
  $input: UpdateShiftingInput!
) {
  updateShifting(condition: $condition, input: $input) {
    amadId
    amadNo
    commodityName
    createdAt
    fromChamberId
    fromFloorNumber
    fromRackNumber
    id
    isActive
    organizationId
    partyId
    partyName
    pkt1
    pkt2
    pkt3
    remarks
    shiftingHeaderId
    toChamberId
    toFloorNumber
    toRackNumber
    totalQuantity
    totalWeight
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateShiftingMutationVariables,
  APITypes.UpdateShiftingMutation
>;
export const updateShiftingHeader = /* GraphQL */ `mutation UpdateShiftingHeader(
  $condition: ModelShiftingHeaderConditionInput
  $input: UpdateShiftingHeaderInput!
) {
  updateShiftingHeader(condition: $condition, input: $input) {
    completedAt
    createdAt
    fromChamberId
    fromChamberName
    id
    isActive
    organizationId
    reason
    remarks
    shiftDate
    shiftNo
    status
    toChamberId
    toChamberName
    totalItems
    totalQuantity
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateShiftingHeaderMutationVariables,
  APITypes.UpdateShiftingHeaderMutation
>;
export const updateStockTransfer = /* GraphQL */ `mutation UpdateStockTransfer(
  $condition: ModelStockTransferConditionInput
  $input: UpdateStockTransferInput!
) {
  updateStockTransfer(condition: $condition, input: $input) {
    amadId
    amadNo
    commodityName
    createdAt
    date
    destRoom
    fromPartyId
    fromPartyName
    id
    isActive
    organizationId
    pkt1
    pkt2
    pkt3
    remarks
    sourceRoom
    status
    toPartyId
    toPartyName
    totalPackets
    totalWeight
    transferNo
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateStockTransferMutationVariables,
  APITypes.UpdateStockTransferMutation
>;
export const updateSystemConfig = /* GraphQL */ `mutation UpdateSystemConfig(
  $condition: ModelSystemConfigConditionInput
  $input: UpdateSystemConfigInput!
) {
  updateSystemConfig(condition: $condition, input: $input) {
    additionalRentDays
    applyInterestOnBardana
    applyInterestOnLabor
    applyInterestOnRent
    autoCalculateInterest
    createdAt
    gradingRatePKT1
    gradingRatePKT2
    gradingRatePKT3
    id
    interestDaysInYear
    interestRate
    isActive
    loadingRatePKT1
    loadingRatePKT2
    loadingRatePKT3
    mapRequired
    mixPackets
    multiChamber
    organizationId
    partialLot
    pkt1Name
    pkt1Weight
    pkt2Name
    pkt2Weight
    pkt3Name
    pkt3Weight
    rentCalculationBasis
    rentProcessingMode
    searchOnCode
    searchOnMobile
    searchOnName
    separateVoucherNo
    showBalance
    showShadowBalance
    softwareMode
    unloadingRatePKT1
    unloadingRatePKT2
    unloadingRatePKT3
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateSystemConfigMutationVariables,
  APITypes.UpdateSystemConfigMutation
>;
export const updateTakpatti = /* GraphQL */ `mutation UpdateTakpatti(
  $condition: ModelTakpattiConditionInput
  $input: UpdateTakpattiInput!
) {
  updateTakpatti(condition: $condition, input: $input) {
    amadId
    amadNo
    createdAt
    date
    id
    isActive
    organizationId
    pkt1
    pkt2
    pkt3
    room
    serialNo
    takpattiNo
    totalPackets
    totalWeight
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateTakpattiMutationVariables,
  APITypes.UpdateTakpattiMutation
>;
export const updateTemperatureLog = /* GraphQL */ `mutation UpdateTemperatureLog(
  $condition: ModelTemperatureLogConditionInput
  $input: UpdateTemperatureLogInput!
) {
  updateTemperatureLog(condition: $condition, input: $input) {
    avgTemp
    chamberId
    chamberName
    createdAt
    date
    highTemp
    humidity
    id
    isActive
    lowTemp
    organizationId
    recordedBy
    remarks
    status
    time
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateTemperatureLogMutationVariables,
  APITypes.UpdateTemperatureLogMutation
>;
export const updateUnloading = /* GraphQL */ `mutation UpdateUnloading(
  $condition: ModelUnloadingConditionInput
  $input: UpdateUnloadingInput!
) {
  updateUnloading(condition: $condition, input: $input) {
    amadId
    amadNo
    chamberId
    chamberName
    commodityName
    createdAt
    date
    floorNumber
    id
    isActive
    organizationId
    partyId
    partyName
    pkt1
    pkt2
    pkt3
    rackNumber
    remarks
    rentId
    rentSerialNo
    totalQuantity
    totalWeight
    unloadingNo
    updatedAt
    vehicleNo
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateUnloadingMutationVariables,
  APITypes.UpdateUnloadingMutation
>;
export const updateVillage = /* GraphQL */ `mutation UpdateVillage(
  $condition: ModelVillageConditionInput
  $input: UpdateVillageInput!
) {
  updateVillage(condition: $condition, input: $input) {
    code
    createdAt
    districtName
    id
    isActive
    name
    nameHindi
    organizationId
    pincode
    road
    stateName
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateVillageMutationVariables,
  APITypes.UpdateVillageMutation
>;
export const updateVoucher = /* GraphQL */ `mutation UpdateVoucher(
  $condition: ModelVoucherConditionInput
  $input: UpdateVoucherInput!
) {
  updateVoucher(condition: $condition, input: $input) {
    amount
    bankName
    bardanaAmount
    chequeDate
    chequeNo
    crAccountCode
    crAccountId
    crAccountName
    createdAt
    date
    drAccountCode
    drAccountId
    drAccountName
    id
    interestAmount
    isActive
    loanAmount
    narration
    organizationId
    otherAmount
    paymentMode
    rentAmount
    updatedAt
    voucherNo
    voucherType
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateVoucherMutationVariables,
  APITypes.UpdateVoucherMutation
>;
