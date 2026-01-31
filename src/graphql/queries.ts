/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "./API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getAccount = /* GraphQL */ `query GetAccount($id: ID!) {
  getAccount(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetAccountQueryVariables,
  APITypes.GetAccountQuery
>;
export const getAdvance = /* GraphQL */ `query GetAdvance($id: ID!) {
  getAdvance(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetAdvanceQueryVariables,
  APITypes.GetAdvanceQuery
>;
export const getAmad = /* GraphQL */ `query GetAmad($id: ID!) {
  getAmad(id: $id) {
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
` as GeneratedQuery<APITypes.GetAmadQueryVariables, APITypes.GetAmadQuery>;
export const getAttendance = /* GraphQL */ `query GetAttendance($id: ID!) {
  getAttendance(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetAttendanceQueryVariables,
  APITypes.GetAttendanceQuery
>;
export const getBank = /* GraphQL */ `query GetBank($id: ID!) {
  getBank(id: $id) {
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
` as GeneratedQuery<APITypes.GetBankQueryVariables, APITypes.GetBankQuery>;
export const getBardanaIssueHeader = /* GraphQL */ `query GetBardanaIssueHeader($id: ID!) {
  getBardanaIssueHeader(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetBardanaIssueHeaderQueryVariables,
  APITypes.GetBardanaIssueHeaderQuery
>;
export const getBardanaIssueItem = /* GraphQL */ `query GetBardanaIssueItem($id: ID!) {
  getBardanaIssueItem(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetBardanaIssueItemQueryVariables,
  APITypes.GetBardanaIssueItemQuery
>;
export const getBardanaReceiptHeader = /* GraphQL */ `query GetBardanaReceiptHeader($id: ID!) {
  getBardanaReceiptHeader(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetBardanaReceiptHeaderQueryVariables,
  APITypes.GetBardanaReceiptHeaderQuery
>;
export const getBardanaReceiptItem = /* GraphQL */ `query GetBardanaReceiptItem($id: ID!) {
  getBardanaReceiptItem(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetBardanaReceiptItemQueryVariables,
  APITypes.GetBardanaReceiptItemQuery
>;
export const getBardanaStock = /* GraphQL */ `query GetBardanaStock($id: ID!) {
  getBardanaStock(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetBardanaStockQueryVariables,
  APITypes.GetBardanaStockQuery
>;
export const getBardanaType = /* GraphQL */ `query GetBardanaType($id: ID!) {
  getBardanaType(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetBardanaTypeQueryVariables,
  APITypes.GetBardanaTypeQuery
>;
export const getChamber = /* GraphQL */ `query GetChamber($id: ID!) {
  getChamber(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetChamberQueryVariables,
  APITypes.GetChamberQuery
>;
export const getChamberFloor = /* GraphQL */ `query GetChamberFloor($id: ID!) {
  getChamberFloor(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetChamberFloorQueryVariables,
  APITypes.GetChamberFloorQuery
>;
export const getCommodity = /* GraphQL */ `query GetCommodity($id: ID!) {
  getCommodity(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetCommodityQueryVariables,
  APITypes.GetCommodityQuery
>;
export const getDWage = /* GraphQL */ `query GetDWage($id: ID!) {
  getDWage(id: $id) {
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
` as GeneratedQuery<APITypes.GetDWageQueryVariables, APITypes.GetDWageQuery>;
export const getDaybook = /* GraphQL */ `query GetDaybook($id: ID!) {
  getDaybook(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetDaybookQueryVariables,
  APITypes.GetDaybookQuery
>;
export const getEmployee = /* GraphQL */ `query GetEmployee($id: ID!) {
  getEmployee(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetEmployeeQueryVariables,
  APITypes.GetEmployeeQuery
>;
export const getGatePass = /* GraphQL */ `query GetGatePass($id: ID!) {
  getGatePass(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetGatePassQueryVariables,
  APITypes.GetGatePassQuery
>;
export const getGatePassDetail = /* GraphQL */ `query GetGatePassDetail($id: ID!) {
  getGatePassDetail(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetGatePassDetailQueryVariables,
  APITypes.GetGatePassDetailQuery
>;
export const getGstRate = /* GraphQL */ `query GetGstRate($id: ID!) {
  getGstRate(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetGstRateQueryVariables,
  APITypes.GetGstRateQuery
>;
export const getKatai = /* GraphQL */ `query GetKatai($id: ID!) {
  getKatai(id: $id) {
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
` as GeneratedQuery<APITypes.GetKataiQueryVariables, APITypes.GetKataiQuery>;
export const getLaborRate = /* GraphQL */ `query GetLaborRate($id: ID!) {
  getLaborRate(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetLaborRateQueryVariables,
  APITypes.GetLaborRateQuery
>;
export const getLoading = /* GraphQL */ `query GetLoading($id: ID!) {
  getLoading(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetLoadingQueryVariables,
  APITypes.GetLoadingQuery
>;
export const getLoanAmount = /* GraphQL */ `query GetLoanAmount($id: ID!) {
  getLoanAmount(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetLoanAmountQueryVariables,
  APITypes.GetLoanAmountQuery
>;
export const getLoanPartyLedger = /* GraphQL */ `query GetLoanPartyLedger($id: ID!) {
  getLoanPartyLedger(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetLoanPartyLedgerQueryVariables,
  APITypes.GetLoanPartyLedgerQuery
>;
export const getMeterReading = /* GraphQL */ `query GetMeterReading($id: ID!) {
  getMeterReading(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetMeterReadingQueryVariables,
  APITypes.GetMeterReadingQuery
>;
export const getOrganization = /* GraphQL */ `query GetOrganization($id: ID!) {
  getOrganization(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetOrganizationQueryVariables,
  APITypes.GetOrganizationQuery
>;
export const getOrganizationMembership = /* GraphQL */ `query GetOrganizationMembership($id: ID!) {
  getOrganizationMembership(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetOrganizationMembershipQueryVariables,
  APITypes.GetOrganizationMembershipQuery
>;
export const getPartyLedger = /* GraphQL */ `query GetPartyLedger($id: ID!) {
  getPartyLedger(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetPartyLedgerQueryVariables,
  APITypes.GetPartyLedgerQuery
>;
export const getPayAllowance = /* GraphQL */ `query GetPayAllowance($id: ID!) {
  getPayAllowance(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetPayAllowanceQueryVariables,
  APITypes.GetPayAllowanceQuery
>;
export const getPayDeduction = /* GraphQL */ `query GetPayDeduction($id: ID!) {
  getPayDeduction(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetPayDeductionQueryVariables,
  APITypes.GetPayDeductionQuery
>;
export const getPayIncrements = /* GraphQL */ `query GetPayIncrements($id: ID!) {
  getPayIncrements(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetPayIncrementsQueryVariables,
  APITypes.GetPayIncrementsQuery
>;
export const getPayLedger = /* GraphQL */ `query GetPayLedger($id: ID!) {
  getPayLedger(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetPayLedgerQueryVariables,
  APITypes.GetPayLedgerQuery
>;
export const getPayLoan = /* GraphQL */ `query GetPayLoan($id: ID!) {
  getPayLoan(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetPayLoanQueryVariables,
  APITypes.GetPayLoanQuery
>;
export const getPayPost = /* GraphQL */ `query GetPayPost($id: ID!) {
  getPayPost(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetPayPostQueryVariables,
  APITypes.GetPayPostQuery
>;
export const getPaySATTN = /* GraphQL */ `query GetPaySATTN($id: ID!) {
  getPaySATTN(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetPaySATTNQueryVariables,
  APITypes.GetPaySATTNQuery
>;
export const getPaySAllowance = /* GraphQL */ `query GetPaySAllowance($id: ID!) {
  getPaySAllowance(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetPaySAllowanceQueryVariables,
  APITypes.GetPaySAllowanceQuery
>;
export const getPaySDeduction = /* GraphQL */ `query GetPaySDeduction($id: ID!) {
  getPaySDeduction(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetPaySDeductionQueryVariables,
  APITypes.GetPaySDeductionQuery
>;
export const getPriceBreakup = /* GraphQL */ `query GetPriceBreakup($id: ID!) {
  getPriceBreakup(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetPriceBreakupQueryVariables,
  APITypes.GetPriceBreakupQuery
>;
export const getReceipt = /* GraphQL */ `query GetReceipt($id: ID!) {
  getReceipt(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetReceiptQueryVariables,
  APITypes.GetReceiptQuery
>;
export const getReceiptAllocation = /* GraphQL */ `query GetReceiptAllocation($id: ID!) {
  getReceiptAllocation(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetReceiptAllocationQueryVariables,
  APITypes.GetReceiptAllocationQuery
>;
export const getRent = /* GraphQL */ `query GetRent($id: ID!) {
  getRent(id: $id) {
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
` as GeneratedQuery<APITypes.GetRentQueryVariables, APITypes.GetRentQuery>;
export const getRentBillHeader = /* GraphQL */ `query GetRentBillHeader($id: ID!) {
  getRentBillHeader(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetRentBillHeaderQueryVariables,
  APITypes.GetRentBillHeaderQuery
>;
export const getRentBillItem = /* GraphQL */ `query GetRentBillItem($id: ID!) {
  getRentBillItem(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetRentBillItemQueryVariables,
  APITypes.GetRentBillItemQuery
>;
export const getRolePermission = /* GraphQL */ `query GetRolePermission($id: ID!) {
  getRolePermission(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetRolePermissionQueryVariables,
  APITypes.GetRolePermissionQuery
>;
export const getSauda = /* GraphQL */ `query GetSauda($id: ID!) {
  getSauda(id: $id) {
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
` as GeneratedQuery<APITypes.GetSaudaQueryVariables, APITypes.GetSaudaQuery>;
export const getShifting = /* GraphQL */ `query GetShifting($id: ID!) {
  getShifting(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetShiftingQueryVariables,
  APITypes.GetShiftingQuery
>;
export const getShiftingHeader = /* GraphQL */ `query GetShiftingHeader($id: ID!) {
  getShiftingHeader(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetShiftingHeaderQueryVariables,
  APITypes.GetShiftingHeaderQuery
>;
export const getStockTransfer = /* GraphQL */ `query GetStockTransfer($id: ID!) {
  getStockTransfer(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetStockTransferQueryVariables,
  APITypes.GetStockTransferQuery
>;
export const getSystemConfig = /* GraphQL */ `query GetSystemConfig($id: ID!) {
  getSystemConfig(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetSystemConfigQueryVariables,
  APITypes.GetSystemConfigQuery
>;
export const getTakpatti = /* GraphQL */ `query GetTakpatti($id: ID!) {
  getTakpatti(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetTakpattiQueryVariables,
  APITypes.GetTakpattiQuery
>;
export const getTemperatureLog = /* GraphQL */ `query GetTemperatureLog($id: ID!) {
  getTemperatureLog(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetTemperatureLogQueryVariables,
  APITypes.GetTemperatureLogQuery
>;
export const getUnloading = /* GraphQL */ `query GetUnloading($id: ID!) {
  getUnloading(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetUnloadingQueryVariables,
  APITypes.GetUnloadingQuery
>;
export const getVillage = /* GraphQL */ `query GetVillage($id: ID!) {
  getVillage(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetVillageQueryVariables,
  APITypes.GetVillageQuery
>;
export const getVoucher = /* GraphQL */ `query GetVoucher($id: ID!) {
  getVoucher(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetVoucherQueryVariables,
  APITypes.GetVoucherQuery
>;
export const listAccountByOrganizationId = /* GraphQL */ `query ListAccountByOrganizationId(
  $filter: ModelAccountFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listAccountByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAccountByOrganizationIdQueryVariables,
  APITypes.ListAccountByOrganizationIdQuery
>;
export const listAccountByParentId = /* GraphQL */ `query ListAccountByParentId(
  $filter: ModelAccountFilterInput
  $limit: Int
  $nextToken: String
  $parentId: String!
  $sortDirection: ModelSortDirection
) {
  listAccountByParentId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    parentId: $parentId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAccountByParentIdQueryVariables,
  APITypes.ListAccountByParentIdQuery
>;
export const listAccounts = /* GraphQL */ `query ListAccounts(
  $filter: ModelAccountFilterInput
  $limit: Int
  $nextToken: String
) {
  listAccounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAccountsQueryVariables,
  APITypes.ListAccountsQuery
>;
export const listAdvanceByOrganizationId = /* GraphQL */ `query ListAdvanceByOrganizationId(
  $filter: ModelAdvanceFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listAdvanceByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAdvanceByOrganizationIdQueryVariables,
  APITypes.ListAdvanceByOrganizationIdQuery
>;
export const listAdvanceByPartyId = /* GraphQL */ `query ListAdvanceByPartyId(
  $filter: ModelAdvanceFilterInput
  $limit: Int
  $nextToken: String
  $partyId: String!
  $sortDirection: ModelSortDirection
) {
  listAdvanceByPartyId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    partyId: $partyId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAdvanceByPartyIdQueryVariables,
  APITypes.ListAdvanceByPartyIdQuery
>;
export const listAdvances = /* GraphQL */ `query ListAdvances(
  $filter: ModelAdvanceFilterInput
  $limit: Int
  $nextToken: String
) {
  listAdvances(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAdvancesQueryVariables,
  APITypes.ListAdvancesQuery
>;
export const listAmadByOrganizationId = /* GraphQL */ `query ListAmadByOrganizationId(
  $filter: ModelAmadFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listAmadByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAmadByOrganizationIdQueryVariables,
  APITypes.ListAmadByOrganizationIdQuery
>;
export const listAmads = /* GraphQL */ `query ListAmads(
  $filter: ModelAmadFilterInput
  $limit: Int
  $nextToken: String
) {
  listAmads(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListAmadsQueryVariables, APITypes.ListAmadsQuery>;
export const listAttendanceByEmployeeId = /* GraphQL */ `query ListAttendanceByEmployeeId(
  $employeeId: ID!
  $filter: ModelAttendanceFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listAttendanceByEmployeeId(
    employeeId: $employeeId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAttendanceByEmployeeIdQueryVariables,
  APITypes.ListAttendanceByEmployeeIdQuery
>;
export const listAttendanceByOrganizationId = /* GraphQL */ `query ListAttendanceByOrganizationId(
  $filter: ModelAttendanceFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listAttendanceByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAttendanceByOrganizationIdQueryVariables,
  APITypes.ListAttendanceByOrganizationIdQuery
>;
export const listAttendances = /* GraphQL */ `query ListAttendances(
  $filter: ModelAttendanceFilterInput
  $limit: Int
  $nextToken: String
) {
  listAttendances(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAttendancesQueryVariables,
  APITypes.ListAttendancesQuery
>;
export const listAuditLogByOrganizationId = /* GraphQL */ `query ListAuditLogByOrganizationId(
  $filter: ModelAuditLogFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listAuditLogByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAuditLogByOrganizationIdQueryVariables,
  APITypes.ListAuditLogByOrganizationIdQuery
>;
export const listAuditLogs = /* GraphQL */ `query ListAuditLogs(
  $filter: ModelAuditLogFilterInput
  $limit: Int
  $nextToken: String
) {
  listAuditLogs(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAuditLogsQueryVariables,
  APITypes.ListAuditLogsQuery
>;
export const listBankByOrganizationId = /* GraphQL */ `query ListBankByOrganizationId(
  $filter: ModelBankFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listBankByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBankByOrganizationIdQueryVariables,
  APITypes.ListBankByOrganizationIdQuery
>;
export const listBanks = /* GraphQL */ `query ListBanks(
  $filter: ModelBankFilterInput
  $limit: Int
  $nextToken: String
) {
  listBanks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListBanksQueryVariables, APITypes.ListBanksQuery>;
export const listBardanaIssueHeaderByOrganizationId = /* GraphQL */ `query ListBardanaIssueHeaderByOrganizationId(
  $filter: ModelBardanaIssueHeaderFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listBardanaIssueHeaderByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBardanaIssueHeaderByOrganizationIdQueryVariables,
  APITypes.ListBardanaIssueHeaderByOrganizationIdQuery
>;
export const listBardanaIssueHeaderByPartyId = /* GraphQL */ `query ListBardanaIssueHeaderByPartyId(
  $filter: ModelBardanaIssueHeaderFilterInput
  $limit: Int
  $nextToken: String
  $partyId: String!
  $sortDirection: ModelSortDirection
) {
  listBardanaIssueHeaderByPartyId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    partyId: $partyId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBardanaIssueHeaderByPartyIdQueryVariables,
  APITypes.ListBardanaIssueHeaderByPartyIdQuery
>;
export const listBardanaIssueHeaders = /* GraphQL */ `query ListBardanaIssueHeaders(
  $filter: ModelBardanaIssueHeaderFilterInput
  $limit: Int
  $nextToken: String
) {
  listBardanaIssueHeaders(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBardanaIssueHeadersQueryVariables,
  APITypes.ListBardanaIssueHeadersQuery
>;
export const listBardanaIssueItemByIssueHeaderId = /* GraphQL */ `query ListBardanaIssueItemByIssueHeaderId(
  $filter: ModelBardanaIssueItemFilterInput
  $issueHeaderId: ID!
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listBardanaIssueItemByIssueHeaderId(
    filter: $filter
    issueHeaderId: $issueHeaderId
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBardanaIssueItemByIssueHeaderIdQueryVariables,
  APITypes.ListBardanaIssueItemByIssueHeaderIdQuery
>;
export const listBardanaIssueItemByOrganizationId = /* GraphQL */ `query ListBardanaIssueItemByOrganizationId(
  $filter: ModelBardanaIssueItemFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listBardanaIssueItemByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBardanaIssueItemByOrganizationIdQueryVariables,
  APITypes.ListBardanaIssueItemByOrganizationIdQuery
>;
export const listBardanaIssueItems = /* GraphQL */ `query ListBardanaIssueItems(
  $filter: ModelBardanaIssueItemFilterInput
  $limit: Int
  $nextToken: String
) {
  listBardanaIssueItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBardanaIssueItemsQueryVariables,
  APITypes.ListBardanaIssueItemsQuery
>;
export const listBardanaReceiptHeaderByOrganizationId = /* GraphQL */ `query ListBardanaReceiptHeaderByOrganizationId(
  $filter: ModelBardanaReceiptHeaderFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listBardanaReceiptHeaderByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBardanaReceiptHeaderByOrganizationIdQueryVariables,
  APITypes.ListBardanaReceiptHeaderByOrganizationIdQuery
>;
export const listBardanaReceiptHeaderByPartyId = /* GraphQL */ `query ListBardanaReceiptHeaderByPartyId(
  $filter: ModelBardanaReceiptHeaderFilterInput
  $limit: Int
  $nextToken: String
  $partyId: String!
  $sortDirection: ModelSortDirection
) {
  listBardanaReceiptHeaderByPartyId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    partyId: $partyId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBardanaReceiptHeaderByPartyIdQueryVariables,
  APITypes.ListBardanaReceiptHeaderByPartyIdQuery
>;
export const listBardanaReceiptHeaders = /* GraphQL */ `query ListBardanaReceiptHeaders(
  $filter: ModelBardanaReceiptHeaderFilterInput
  $limit: Int
  $nextToken: String
) {
  listBardanaReceiptHeaders(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBardanaReceiptHeadersQueryVariables,
  APITypes.ListBardanaReceiptHeadersQuery
>;
export const listBardanaReceiptItemByOrganizationId = /* GraphQL */ `query ListBardanaReceiptItemByOrganizationId(
  $filter: ModelBardanaReceiptItemFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listBardanaReceiptItemByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBardanaReceiptItemByOrganizationIdQueryVariables,
  APITypes.ListBardanaReceiptItemByOrganizationIdQuery
>;
export const listBardanaReceiptItemByReceiptHeaderId = /* GraphQL */ `query ListBardanaReceiptItemByReceiptHeaderId(
  $filter: ModelBardanaReceiptItemFilterInput
  $limit: Int
  $nextToken: String
  $receiptHeaderId: ID!
  $sortDirection: ModelSortDirection
) {
  listBardanaReceiptItemByReceiptHeaderId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    receiptHeaderId: $receiptHeaderId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBardanaReceiptItemByReceiptHeaderIdQueryVariables,
  APITypes.ListBardanaReceiptItemByReceiptHeaderIdQuery
>;
export const listBardanaReceiptItems = /* GraphQL */ `query ListBardanaReceiptItems(
  $filter: ModelBardanaReceiptItemFilterInput
  $limit: Int
  $nextToken: String
) {
  listBardanaReceiptItems(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBardanaReceiptItemsQueryVariables,
  APITypes.ListBardanaReceiptItemsQuery
>;
export const listBardanaStockByBardanaTypeId = /* GraphQL */ `query ListBardanaStockByBardanaTypeId(
  $bardanaTypeId: String!
  $filter: ModelBardanaStockFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listBardanaStockByBardanaTypeId(
    bardanaTypeId: $bardanaTypeId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBardanaStockByBardanaTypeIdQueryVariables,
  APITypes.ListBardanaStockByBardanaTypeIdQuery
>;
export const listBardanaStockByOrganizationId = /* GraphQL */ `query ListBardanaStockByOrganizationId(
  $filter: ModelBardanaStockFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listBardanaStockByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBardanaStockByOrganizationIdQueryVariables,
  APITypes.ListBardanaStockByOrganizationIdQuery
>;
export const listBardanaStockByPartyId = /* GraphQL */ `query ListBardanaStockByPartyId(
  $filter: ModelBardanaStockFilterInput
  $limit: Int
  $nextToken: String
  $partyId: String!
  $sortDirection: ModelSortDirection
) {
  listBardanaStockByPartyId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    partyId: $partyId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBardanaStockByPartyIdQueryVariables,
  APITypes.ListBardanaStockByPartyIdQuery
>;
export const listBardanaStocks = /* GraphQL */ `query ListBardanaStocks(
  $filter: ModelBardanaStockFilterInput
  $limit: Int
  $nextToken: String
) {
  listBardanaStocks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBardanaStocksQueryVariables,
  APITypes.ListBardanaStocksQuery
>;
export const listBardanaTypeByOrganizationId = /* GraphQL */ `query ListBardanaTypeByOrganizationId(
  $filter: ModelBardanaTypeFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listBardanaTypeByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBardanaTypeByOrganizationIdQueryVariables,
  APITypes.ListBardanaTypeByOrganizationIdQuery
>;
export const listBardanaTypes = /* GraphQL */ `query ListBardanaTypes(
  $filter: ModelBardanaTypeFilterInput
  $limit: Int
  $nextToken: String
) {
  listBardanaTypes(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListBardanaTypesQueryVariables,
  APITypes.ListBardanaTypesQuery
>;
export const listChamberByOrganizationId = /* GraphQL */ `query ListChamberByOrganizationId(
  $filter: ModelChamberFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listChamberByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListChamberByOrganizationIdQueryVariables,
  APITypes.ListChamberByOrganizationIdQuery
>;
export const listChamberFloorByChamberId = /* GraphQL */ `query ListChamberFloorByChamberId(
  $chamberId: ID!
  $filter: ModelChamberFloorFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listChamberFloorByChamberId(
    chamberId: $chamberId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListChamberFloorByChamberIdQueryVariables,
  APITypes.ListChamberFloorByChamberIdQuery
>;
export const listChamberFloorByOrganizationId = /* GraphQL */ `query ListChamberFloorByOrganizationId(
  $filter: ModelChamberFloorFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listChamberFloorByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListChamberFloorByOrganizationIdQueryVariables,
  APITypes.ListChamberFloorByOrganizationIdQuery
>;
export const listChamberFloors = /* GraphQL */ `query ListChamberFloors(
  $filter: ModelChamberFloorFilterInput
  $limit: Int
  $nextToken: String
) {
  listChamberFloors(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListChamberFloorsQueryVariables,
  APITypes.ListChamberFloorsQuery
>;
export const listChambers = /* GraphQL */ `query ListChambers(
  $filter: ModelChamberFilterInput
  $limit: Int
  $nextToken: String
) {
  listChambers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListChambersQueryVariables,
  APITypes.ListChambersQuery
>;
export const listCommodities = /* GraphQL */ `query ListCommodities(
  $filter: ModelCommodityFilterInput
  $limit: Int
  $nextToken: String
) {
  listCommodities(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCommoditiesQueryVariables,
  APITypes.ListCommoditiesQuery
>;
export const listCommodityByOrganizationId = /* GraphQL */ `query ListCommodityByOrganizationId(
  $filter: ModelCommodityFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listCommodityByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCommodityByOrganizationIdQueryVariables,
  APITypes.ListCommodityByOrganizationIdQuery
>;
export const listDWageByOrganizationId = /* GraphQL */ `query ListDWageByOrganizationId(
  $filter: ModelDWageFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listDWageByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDWageByOrganizationIdQueryVariables,
  APITypes.ListDWageByOrganizationIdQuery
>;
export const listDWages = /* GraphQL */ `query ListDWages(
  $filter: ModelDWageFilterInput
  $limit: Int
  $nextToken: String
) {
  listDWages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDWagesQueryVariables,
  APITypes.ListDWagesQuery
>;
export const listDaybookByOrganizationId = /* GraphQL */ `query ListDaybookByOrganizationId(
  $filter: ModelDaybookFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listDaybookByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDaybookByOrganizationIdQueryVariables,
  APITypes.ListDaybookByOrganizationIdQuery
>;
export const listDaybooks = /* GraphQL */ `query ListDaybooks(
  $filter: ModelDaybookFilterInput
  $limit: Int
  $nextToken: String
) {
  listDaybooks(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDaybooksQueryVariables,
  APITypes.ListDaybooksQuery
>;
export const listEmployeeByOrganizationId = /* GraphQL */ `query ListEmployeeByOrganizationId(
  $filter: ModelEmployeeFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listEmployeeByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListEmployeeByOrganizationIdQueryVariables,
  APITypes.ListEmployeeByOrganizationIdQuery
>;
export const listEmployeeByPostId = /* GraphQL */ `query ListEmployeeByPostId(
  $filter: ModelEmployeeFilterInput
  $limit: Int
  $nextToken: String
  $postId: ID!
  $sortDirection: ModelSortDirection
) {
  listEmployeeByPostId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    postId: $postId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListEmployeeByPostIdQueryVariables,
  APITypes.ListEmployeeByPostIdQuery
>;
export const listEmployees = /* GraphQL */ `query ListEmployees(
  $filter: ModelEmployeeFilterInput
  $limit: Int
  $nextToken: String
) {
  listEmployees(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListEmployeesQueryVariables,
  APITypes.ListEmployeesQuery
>;
export const listGatePassByOrganizationId = /* GraphQL */ `query ListGatePassByOrganizationId(
  $filter: ModelGatePassFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listGatePassByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGatePassByOrganizationIdQueryVariables,
  APITypes.ListGatePassByOrganizationIdQuery
>;
export const listGatePassBySaudaId = /* GraphQL */ `query ListGatePassBySaudaId(
  $filter: ModelGatePassFilterInput
  $limit: Int
  $nextToken: String
  $saudaId: String!
  $sortDirection: ModelSortDirection
) {
  listGatePassBySaudaId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    saudaId: $saudaId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGatePassBySaudaIdQueryVariables,
  APITypes.ListGatePassBySaudaIdQuery
>;
export const listGatePassBySellerPartyId = /* GraphQL */ `query ListGatePassBySellerPartyId(
  $filter: ModelGatePassFilterInput
  $limit: Int
  $nextToken: String
  $sellerPartyId: String!
  $sortDirection: ModelSortDirection
) {
  listGatePassBySellerPartyId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sellerPartyId: $sellerPartyId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGatePassBySellerPartyIdQueryVariables,
  APITypes.ListGatePassBySellerPartyIdQuery
>;
export const listGatePassDetailByAmadId = /* GraphQL */ `query ListGatePassDetailByAmadId(
  $amadId: String!
  $filter: ModelGatePassDetailFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listGatePassDetailByAmadId(
    amadId: $amadId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGatePassDetailByAmadIdQueryVariables,
  APITypes.ListGatePassDetailByAmadIdQuery
>;
export const listGatePassDetailByGatePassId = /* GraphQL */ `query ListGatePassDetailByGatePassId(
  $filter: ModelGatePassDetailFilterInput
  $gatePassId: ID!
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listGatePassDetailByGatePassId(
    filter: $filter
    gatePassId: $gatePassId
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGatePassDetailByGatePassIdQueryVariables,
  APITypes.ListGatePassDetailByGatePassIdQuery
>;
export const listGatePassDetailByOrganizationId = /* GraphQL */ `query ListGatePassDetailByOrganizationId(
  $filter: ModelGatePassDetailFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listGatePassDetailByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGatePassDetailByOrganizationIdQueryVariables,
  APITypes.ListGatePassDetailByOrganizationIdQuery
>;
export const listGatePassDetails = /* GraphQL */ `query ListGatePassDetails(
  $filter: ModelGatePassDetailFilterInput
  $limit: Int
  $nextToken: String
) {
  listGatePassDetails(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGatePassDetailsQueryVariables,
  APITypes.ListGatePassDetailsQuery
>;
export const listGatePasses = /* GraphQL */ `query ListGatePasses(
  $filter: ModelGatePassFilterInput
  $limit: Int
  $nextToken: String
) {
  listGatePasses(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGatePassesQueryVariables,
  APITypes.ListGatePassesQuery
>;
export const listGstRateByOrganizationId = /* GraphQL */ `query ListGstRateByOrganizationId(
  $filter: ModelGstRateFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listGstRateByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGstRateByOrganizationIdQueryVariables,
  APITypes.ListGstRateByOrganizationIdQuery
>;
export const listGstRates = /* GraphQL */ `query ListGstRates(
  $filter: ModelGstRateFilterInput
  $limit: Int
  $nextToken: String
) {
  listGstRates(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGstRatesQueryVariables,
  APITypes.ListGstRatesQuery
>;
export const listKataiByAmadId = /* GraphQL */ `query ListKataiByAmadId(
  $amadId: String!
  $filter: ModelKataiFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listKataiByAmadId(
    amadId: $amadId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListKataiByAmadIdQueryVariables,
  APITypes.ListKataiByAmadIdQuery
>;
export const listKataiByOrganizationId = /* GraphQL */ `query ListKataiByOrganizationId(
  $filter: ModelKataiFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listKataiByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListKataiByOrganizationIdQueryVariables,
  APITypes.ListKataiByOrganizationIdQuery
>;
export const listKataiByPartyId = /* GraphQL */ `query ListKataiByPartyId(
  $filter: ModelKataiFilterInput
  $limit: Int
  $nextToken: String
  $partyId: String!
  $sortDirection: ModelSortDirection
) {
  listKataiByPartyId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    partyId: $partyId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListKataiByPartyIdQueryVariables,
  APITypes.ListKataiByPartyIdQuery
>;
export const listKatais = /* GraphQL */ `query ListKatais(
  $filter: ModelKataiFilterInput
  $limit: Int
  $nextToken: String
) {
  listKatais(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListKataisQueryVariables,
  APITypes.ListKataisQuery
>;
export const listLaborRateByOrganizationId = /* GraphQL */ `query ListLaborRateByOrganizationId(
  $filter: ModelLaborRateFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listLaborRateByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLaborRateByOrganizationIdQueryVariables,
  APITypes.ListLaborRateByOrganizationIdQuery
>;
export const listLaborRates = /* GraphQL */ `query ListLaborRates(
  $filter: ModelLaborRateFilterInput
  $limit: Int
  $nextToken: String
) {
  listLaborRates(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLaborRatesQueryVariables,
  APITypes.ListLaborRatesQuery
>;
export const listLoadingByAmadId = /* GraphQL */ `query ListLoadingByAmadId(
  $amadId: ID!
  $filter: ModelLoadingFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listLoadingByAmadId(
    amadId: $amadId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLoadingByAmadIdQueryVariables,
  APITypes.ListLoadingByAmadIdQuery
>;
export const listLoadingByChamberId = /* GraphQL */ `query ListLoadingByChamberId(
  $chamberId: ID!
  $filter: ModelLoadingFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listLoadingByChamberId(
    chamberId: $chamberId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLoadingByChamberIdQueryVariables,
  APITypes.ListLoadingByChamberIdQuery
>;
export const listLoadingByOrganizationId = /* GraphQL */ `query ListLoadingByOrganizationId(
  $filter: ModelLoadingFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listLoadingByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLoadingByOrganizationIdQueryVariables,
  APITypes.ListLoadingByOrganizationIdQuery
>;
export const listLoadings = /* GraphQL */ `query ListLoadings(
  $filter: ModelLoadingFilterInput
  $limit: Int
  $nextToken: String
) {
  listLoadings(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLoadingsQueryVariables,
  APITypes.ListLoadingsQuery
>;
export const listLoanAmountByAmadId = /* GraphQL */ `query ListLoanAmountByAmadId(
  $amadId: String!
  $filter: ModelLoanAmountFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listLoanAmountByAmadId(
    amadId: $amadId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLoanAmountByAmadIdQueryVariables,
  APITypes.ListLoanAmountByAmadIdQuery
>;
export const listLoanAmountByOrganizationId = /* GraphQL */ `query ListLoanAmountByOrganizationId(
  $filter: ModelLoanAmountFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listLoanAmountByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLoanAmountByOrganizationIdQueryVariables,
  APITypes.ListLoanAmountByOrganizationIdQuery
>;
export const listLoanAmountByPartyId = /* GraphQL */ `query ListLoanAmountByPartyId(
  $filter: ModelLoanAmountFilterInput
  $limit: Int
  $nextToken: String
  $partyId: String!
  $sortDirection: ModelSortDirection
) {
  listLoanAmountByPartyId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    partyId: $partyId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLoanAmountByPartyIdQueryVariables,
  APITypes.ListLoanAmountByPartyIdQuery
>;
export const listLoanAmounts = /* GraphQL */ `query ListLoanAmounts(
  $filter: ModelLoanAmountFilterInput
  $limit: Int
  $nextToken: String
) {
  listLoanAmounts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLoanAmountsQueryVariables,
  APITypes.ListLoanAmountsQuery
>;
export const listLoanPartyLedgerByOrganizationId = /* GraphQL */ `query ListLoanPartyLedgerByOrganizationId(
  $filter: ModelLoanPartyLedgerFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listLoanPartyLedgerByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLoanPartyLedgerByOrganizationIdQueryVariables,
  APITypes.ListLoanPartyLedgerByOrganizationIdQuery
>;
export const listLoanPartyLedgerByPartyId = /* GraphQL */ `query ListLoanPartyLedgerByPartyId(
  $filter: ModelLoanPartyLedgerFilterInput
  $limit: Int
  $nextToken: String
  $partyId: String!
  $sortDirection: ModelSortDirection
) {
  listLoanPartyLedgerByPartyId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    partyId: $partyId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLoanPartyLedgerByPartyIdQueryVariables,
  APITypes.ListLoanPartyLedgerByPartyIdQuery
>;
export const listLoanPartyLedgers = /* GraphQL */ `query ListLoanPartyLedgers(
  $filter: ModelLoanPartyLedgerFilterInput
  $limit: Int
  $nextToken: String
) {
  listLoanPartyLedgers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListLoanPartyLedgersQueryVariables,
  APITypes.ListLoanPartyLedgersQuery
>;
export const listMeterReadingByChamberId = /* GraphQL */ `query ListMeterReadingByChamberId(
  $chamberId: ID!
  $filter: ModelMeterReadingFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listMeterReadingByChamberId(
    chamberId: $chamberId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMeterReadingByChamberIdQueryVariables,
  APITypes.ListMeterReadingByChamberIdQuery
>;
export const listMeterReadingByOrganizationId = /* GraphQL */ `query ListMeterReadingByOrganizationId(
  $filter: ModelMeterReadingFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listMeterReadingByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMeterReadingByOrganizationIdQueryVariables,
  APITypes.ListMeterReadingByOrganizationIdQuery
>;
export const listMeterReadings = /* GraphQL */ `query ListMeterReadings(
  $filter: ModelMeterReadingFilterInput
  $limit: Int
  $nextToken: String
) {
  listMeterReadings(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMeterReadingsQueryVariables,
  APITypes.ListMeterReadingsQuery
>;
export const listOrganizationBySlug = /* GraphQL */ `query ListOrganizationBySlug(
  $filter: ModelOrganizationFilterInput
  $limit: Int
  $nextToken: String
  $slug: String!
  $sortDirection: ModelSortDirection
) {
  listOrganizationBySlug(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    slug: $slug
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListOrganizationBySlugQueryVariables,
  APITypes.ListOrganizationBySlugQuery
>;
export const listOrganizationMembershipByOrganizationId = /* GraphQL */ `query ListOrganizationMembershipByOrganizationId(
  $filter: ModelOrganizationMembershipFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listOrganizationMembershipByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
      organizationId
      role
      status
      updatedAt
      userId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListOrganizationMembershipByOrganizationIdQueryVariables,
  APITypes.ListOrganizationMembershipByOrganizationIdQuery
>;
export const listOrganizationMembershipByUserId = /* GraphQL */ `query ListOrganizationMembershipByUserId(
  $filter: ModelOrganizationMembershipFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
  $userId: String!
) {
  listOrganizationMembershipByUserId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
    userId: $userId
  ) {
    items {
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
      organizationId
      role
      status
      updatedAt
      userId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListOrganizationMembershipByUserIdQueryVariables,
  APITypes.ListOrganizationMembershipByUserIdQuery
>;
export const listOrganizationMemberships = /* GraphQL */ `query ListOrganizationMemberships(
  $filter: ModelOrganizationMembershipFilterInput
  $limit: Int
  $nextToken: String
) {
  listOrganizationMemberships(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
      organizationId
      role
      status
      updatedAt
      userId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListOrganizationMembershipsQueryVariables,
  APITypes.ListOrganizationMembershipsQuery
>;
export const listOrganizations = /* GraphQL */ `query ListOrganizations(
  $filter: ModelOrganizationFilterInput
  $limit: Int
  $nextToken: String
) {
  listOrganizations(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListOrganizationsQueryVariables,
  APITypes.ListOrganizationsQuery
>;
export const listPartyLedgerByAccountId = /* GraphQL */ `query ListPartyLedgerByAccountId(
  $accountId: String!
  $filter: ModelPartyLedgerFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listPartyLedgerByAccountId(
    accountId: $accountId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPartyLedgerByAccountIdQueryVariables,
  APITypes.ListPartyLedgerByAccountIdQuery
>;
export const listPartyLedgerByOrganizationId = /* GraphQL */ `query ListPartyLedgerByOrganizationId(
  $filter: ModelPartyLedgerFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listPartyLedgerByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPartyLedgerByOrganizationIdQueryVariables,
  APITypes.ListPartyLedgerByOrganizationIdQuery
>;
export const listPartyLedgers = /* GraphQL */ `query ListPartyLedgers(
  $filter: ModelPartyLedgerFilterInput
  $limit: Int
  $nextToken: String
) {
  listPartyLedgers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPartyLedgersQueryVariables,
  APITypes.ListPartyLedgersQuery
>;
export const listPayAllowanceByOrganizationId = /* GraphQL */ `query ListPayAllowanceByOrganizationId(
  $filter: ModelPayAllowanceFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listPayAllowanceByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPayAllowanceByOrganizationIdQueryVariables,
  APITypes.ListPayAllowanceByOrganizationIdQuery
>;
export const listPayAllowances = /* GraphQL */ `query ListPayAllowances(
  $filter: ModelPayAllowanceFilterInput
  $limit: Int
  $nextToken: String
) {
  listPayAllowances(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPayAllowancesQueryVariables,
  APITypes.ListPayAllowancesQuery
>;
export const listPayDeductionByOrganizationId = /* GraphQL */ `query ListPayDeductionByOrganizationId(
  $filter: ModelPayDeductionFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listPayDeductionByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPayDeductionByOrganizationIdQueryVariables,
  APITypes.ListPayDeductionByOrganizationIdQuery
>;
export const listPayDeductions = /* GraphQL */ `query ListPayDeductions(
  $filter: ModelPayDeductionFilterInput
  $limit: Int
  $nextToken: String
) {
  listPayDeductions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPayDeductionsQueryVariables,
  APITypes.ListPayDeductionsQuery
>;
export const listPayIncrements = /* GraphQL */ `query ListPayIncrements(
  $filter: ModelPayIncrementsFilterInput
  $limit: Int
  $nextToken: String
) {
  listPayIncrements(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPayIncrementsQueryVariables,
  APITypes.ListPayIncrementsQuery
>;
export const listPayIncrementsByEmployeeId = /* GraphQL */ `query ListPayIncrementsByEmployeeId(
  $employeeId: ID!
  $filter: ModelPayIncrementsFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listPayIncrementsByEmployeeId(
    employeeId: $employeeId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPayIncrementsByEmployeeIdQueryVariables,
  APITypes.ListPayIncrementsByEmployeeIdQuery
>;
export const listPayIncrementsByOrganizationId = /* GraphQL */ `query ListPayIncrementsByOrganizationId(
  $filter: ModelPayIncrementsFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listPayIncrementsByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPayIncrementsByOrganizationIdQueryVariables,
  APITypes.ListPayIncrementsByOrganizationIdQuery
>;
export const listPayLedgerByEmployeeId = /* GraphQL */ `query ListPayLedgerByEmployeeId(
  $employeeId: ID!
  $filter: ModelPayLedgerFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listPayLedgerByEmployeeId(
    employeeId: $employeeId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPayLedgerByEmployeeIdQueryVariables,
  APITypes.ListPayLedgerByEmployeeIdQuery
>;
export const listPayLedgerByOrganizationId = /* GraphQL */ `query ListPayLedgerByOrganizationId(
  $filter: ModelPayLedgerFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listPayLedgerByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPayLedgerByOrganizationIdQueryVariables,
  APITypes.ListPayLedgerByOrganizationIdQuery
>;
export const listPayLedgers = /* GraphQL */ `query ListPayLedgers(
  $filter: ModelPayLedgerFilterInput
  $limit: Int
  $nextToken: String
) {
  listPayLedgers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPayLedgersQueryVariables,
  APITypes.ListPayLedgersQuery
>;
export const listPayLoanByEmployeeId = /* GraphQL */ `query ListPayLoanByEmployeeId(
  $employeeId: ID!
  $filter: ModelPayLoanFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listPayLoanByEmployeeId(
    employeeId: $employeeId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPayLoanByEmployeeIdQueryVariables,
  APITypes.ListPayLoanByEmployeeIdQuery
>;
export const listPayLoanByOrganizationId = /* GraphQL */ `query ListPayLoanByOrganizationId(
  $filter: ModelPayLoanFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listPayLoanByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPayLoanByOrganizationIdQueryVariables,
  APITypes.ListPayLoanByOrganizationIdQuery
>;
export const listPayLoans = /* GraphQL */ `query ListPayLoans(
  $filter: ModelPayLoanFilterInput
  $limit: Int
  $nextToken: String
) {
  listPayLoans(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPayLoansQueryVariables,
  APITypes.ListPayLoansQuery
>;
export const listPayPostByOrganizationId = /* GraphQL */ `query ListPayPostByOrganizationId(
  $filter: ModelPayPostFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listPayPostByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPayPostByOrganizationIdQueryVariables,
  APITypes.ListPayPostByOrganizationIdQuery
>;
export const listPayPosts = /* GraphQL */ `query ListPayPosts(
  $filter: ModelPayPostFilterInput
  $limit: Int
  $nextToken: String
) {
  listPayPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPayPostsQueryVariables,
  APITypes.ListPayPostsQuery
>;
export const listPaySATTNByEmployeeId = /* GraphQL */ `query ListPaySATTNByEmployeeId(
  $employeeId: ID!
  $filter: ModelPaySATTNFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listPaySATTNByEmployeeId(
    employeeId: $employeeId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPaySATTNByEmployeeIdQueryVariables,
  APITypes.ListPaySATTNByEmployeeIdQuery
>;
export const listPaySATTNByOrganizationId = /* GraphQL */ `query ListPaySATTNByOrganizationId(
  $filter: ModelPaySATTNFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listPaySATTNByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPaySATTNByOrganizationIdQueryVariables,
  APITypes.ListPaySATTNByOrganizationIdQuery
>;
export const listPaySATTNS = /* GraphQL */ `query ListPaySATTNS(
  $filter: ModelPaySATTNFilterInput
  $limit: Int
  $nextToken: String
) {
  listPaySATTNS(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPaySATTNSQueryVariables,
  APITypes.ListPaySATTNSQuery
>;
export const listPaySAllowanceByAllowanceId = /* GraphQL */ `query ListPaySAllowanceByAllowanceId(
  $allowanceId: ID!
  $filter: ModelPaySAllowanceFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listPaySAllowanceByAllowanceId(
    allowanceId: $allowanceId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPaySAllowanceByAllowanceIdQueryVariables,
  APITypes.ListPaySAllowanceByAllowanceIdQuery
>;
export const listPaySAllowanceByEmployeeId = /* GraphQL */ `query ListPaySAllowanceByEmployeeId(
  $employeeId: ID!
  $filter: ModelPaySAllowanceFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listPaySAllowanceByEmployeeId(
    employeeId: $employeeId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPaySAllowanceByEmployeeIdQueryVariables,
  APITypes.ListPaySAllowanceByEmployeeIdQuery
>;
export const listPaySAllowanceByOrganizationId = /* GraphQL */ `query ListPaySAllowanceByOrganizationId(
  $filter: ModelPaySAllowanceFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listPaySAllowanceByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPaySAllowanceByOrganizationIdQueryVariables,
  APITypes.ListPaySAllowanceByOrganizationIdQuery
>;
export const listPaySAllowances = /* GraphQL */ `query ListPaySAllowances(
  $filter: ModelPaySAllowanceFilterInput
  $limit: Int
  $nextToken: String
) {
  listPaySAllowances(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPaySAllowancesQueryVariables,
  APITypes.ListPaySAllowancesQuery
>;
export const listPaySDeductionByDeductionId = /* GraphQL */ `query ListPaySDeductionByDeductionId(
  $deductionId: ID!
  $filter: ModelPaySDeductionFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listPaySDeductionByDeductionId(
    deductionId: $deductionId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPaySDeductionByDeductionIdQueryVariables,
  APITypes.ListPaySDeductionByDeductionIdQuery
>;
export const listPaySDeductionByEmployeeId = /* GraphQL */ `query ListPaySDeductionByEmployeeId(
  $employeeId: ID!
  $filter: ModelPaySDeductionFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listPaySDeductionByEmployeeId(
    employeeId: $employeeId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPaySDeductionByEmployeeIdQueryVariables,
  APITypes.ListPaySDeductionByEmployeeIdQuery
>;
export const listPaySDeductionByOrganizationId = /* GraphQL */ `query ListPaySDeductionByOrganizationId(
  $filter: ModelPaySDeductionFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listPaySDeductionByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPaySDeductionByOrganizationIdQueryVariables,
  APITypes.ListPaySDeductionByOrganizationIdQuery
>;
export const listPaySDeductions = /* GraphQL */ `query ListPaySDeductions(
  $filter: ModelPaySDeductionFilterInput
  $limit: Int
  $nextToken: String
) {
  listPaySDeductions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPaySDeductionsQueryVariables,
  APITypes.ListPaySDeductionsQuery
>;
export const listPriceBreakupByOrganizationId = /* GraphQL */ `query ListPriceBreakupByOrganizationId(
  $filter: ModelPriceBreakupFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listPriceBreakupByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPriceBreakupByOrganizationIdQueryVariables,
  APITypes.ListPriceBreakupByOrganizationIdQuery
>;
export const listPriceBreakupByRentBillId = /* GraphQL */ `query ListPriceBreakupByRentBillId(
  $filter: ModelPriceBreakupFilterInput
  $limit: Int
  $nextToken: String
  $rentBillId: ID!
  $sortDirection: ModelSortDirection
) {
  listPriceBreakupByRentBillId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    rentBillId: $rentBillId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPriceBreakupByRentBillIdQueryVariables,
  APITypes.ListPriceBreakupByRentBillIdQuery
>;
export const listPriceBreakups = /* GraphQL */ `query ListPriceBreakups(
  $filter: ModelPriceBreakupFilterInput
  $limit: Int
  $nextToken: String
) {
  listPriceBreakups(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPriceBreakupsQueryVariables,
  APITypes.ListPriceBreakupsQuery
>;
export const listReceiptAllocationByOrganizationId = /* GraphQL */ `query ListReceiptAllocationByOrganizationId(
  $filter: ModelReceiptAllocationFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listReceiptAllocationByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListReceiptAllocationByOrganizationIdQueryVariables,
  APITypes.ListReceiptAllocationByOrganizationIdQuery
>;
export const listReceiptAllocationByReceiptId = /* GraphQL */ `query ListReceiptAllocationByReceiptId(
  $filter: ModelReceiptAllocationFilterInput
  $limit: Int
  $nextToken: String
  $receiptId: ID!
  $sortDirection: ModelSortDirection
) {
  listReceiptAllocationByReceiptId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    receiptId: $receiptId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListReceiptAllocationByReceiptIdQueryVariables,
  APITypes.ListReceiptAllocationByReceiptIdQuery
>;
export const listReceiptAllocationByRentBillId = /* GraphQL */ `query ListReceiptAllocationByRentBillId(
  $filter: ModelReceiptAllocationFilterInput
  $limit: Int
  $nextToken: String
  $rentBillId: ID!
  $sortDirection: ModelSortDirection
) {
  listReceiptAllocationByRentBillId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    rentBillId: $rentBillId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListReceiptAllocationByRentBillIdQueryVariables,
  APITypes.ListReceiptAllocationByRentBillIdQuery
>;
export const listReceiptAllocations = /* GraphQL */ `query ListReceiptAllocations(
  $filter: ModelReceiptAllocationFilterInput
  $limit: Int
  $nextToken: String
) {
  listReceiptAllocations(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListReceiptAllocationsQueryVariables,
  APITypes.ListReceiptAllocationsQuery
>;
export const listReceiptByOrganizationId = /* GraphQL */ `query ListReceiptByOrganizationId(
  $filter: ModelReceiptFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listReceiptByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListReceiptByOrganizationIdQueryVariables,
  APITypes.ListReceiptByOrganizationIdQuery
>;
export const listReceiptByPartyId = /* GraphQL */ `query ListReceiptByPartyId(
  $filter: ModelReceiptFilterInput
  $limit: Int
  $nextToken: String
  $partyId: String!
  $sortDirection: ModelSortDirection
) {
  listReceiptByPartyId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    partyId: $partyId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListReceiptByPartyIdQueryVariables,
  APITypes.ListReceiptByPartyIdQuery
>;
export const listReceiptByReceiptDate = /* GraphQL */ `query ListReceiptByReceiptDate(
  $filter: ModelReceiptFilterInput
  $limit: Int
  $nextToken: String
  $receiptDate: AWSDate!
  $sortDirection: ModelSortDirection
) {
  listReceiptByReceiptDate(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    receiptDate: $receiptDate
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListReceiptByReceiptDateQueryVariables,
  APITypes.ListReceiptByReceiptDateQuery
>;
export const listReceipts = /* GraphQL */ `query ListReceipts(
  $filter: ModelReceiptFilterInput
  $limit: Int
  $nextToken: String
) {
  listReceipts(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListReceiptsQueryVariables,
  APITypes.ListReceiptsQuery
>;
export const listRentBillHeaderByBillDate = /* GraphQL */ `query ListRentBillHeaderByBillDate(
  $billDate: AWSDate!
  $filter: ModelRentBillHeaderFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listRentBillHeaderByBillDate(
    billDate: $billDate
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListRentBillHeaderByBillDateQueryVariables,
  APITypes.ListRentBillHeaderByBillDateQuery
>;
export const listRentBillHeaderByOrganizationId = /* GraphQL */ `query ListRentBillHeaderByOrganizationId(
  $filter: ModelRentBillHeaderFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listRentBillHeaderByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListRentBillHeaderByOrganizationIdQueryVariables,
  APITypes.ListRentBillHeaderByOrganizationIdQuery
>;
export const listRentBillHeaderByPartyId = /* GraphQL */ `query ListRentBillHeaderByPartyId(
  $filter: ModelRentBillHeaderFilterInput
  $limit: Int
  $nextToken: String
  $partyId: String!
  $sortDirection: ModelSortDirection
) {
  listRentBillHeaderByPartyId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    partyId: $partyId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListRentBillHeaderByPartyIdQueryVariables,
  APITypes.ListRentBillHeaderByPartyIdQuery
>;
export const listRentBillHeaders = /* GraphQL */ `query ListRentBillHeaders(
  $filter: ModelRentBillHeaderFilterInput
  $limit: Int
  $nextToken: String
) {
  listRentBillHeaders(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListRentBillHeadersQueryVariables,
  APITypes.ListRentBillHeadersQuery
>;
export const listRentBillItemByAmadId = /* GraphQL */ `query ListRentBillItemByAmadId(
  $amadId: String!
  $filter: ModelRentBillItemFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listRentBillItemByAmadId(
    amadId: $amadId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListRentBillItemByAmadIdQueryVariables,
  APITypes.ListRentBillItemByAmadIdQuery
>;
export const listRentBillItemByOrganizationId = /* GraphQL */ `query ListRentBillItemByOrganizationId(
  $filter: ModelRentBillItemFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listRentBillItemByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListRentBillItemByOrganizationIdQueryVariables,
  APITypes.ListRentBillItemByOrganizationIdQuery
>;
export const listRentBillItemByRentBillId = /* GraphQL */ `query ListRentBillItemByRentBillId(
  $filter: ModelRentBillItemFilterInput
  $limit: Int
  $nextToken: String
  $rentBillId: ID!
  $sortDirection: ModelSortDirection
) {
  listRentBillItemByRentBillId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    rentBillId: $rentBillId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListRentBillItemByRentBillIdQueryVariables,
  APITypes.ListRentBillItemByRentBillIdQuery
>;
export const listRentBillItems = /* GraphQL */ `query ListRentBillItems(
  $filter: ModelRentBillItemFilterInput
  $limit: Int
  $nextToken: String
) {
  listRentBillItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListRentBillItemsQueryVariables,
  APITypes.ListRentBillItemsQuery
>;
export const listRentByOrganizationId = /* GraphQL */ `query ListRentByOrganizationId(
  $filter: ModelRentFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listRentByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListRentByOrganizationIdQueryVariables,
  APITypes.ListRentByOrganizationIdQuery
>;
export const listRents = /* GraphQL */ `query ListRents(
  $filter: ModelRentFilterInput
  $limit: Int
  $nextToken: String
) {
  listRents(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListRentsQueryVariables, APITypes.ListRentsQuery>;
export const listRolePermissionByOrganizationId = /* GraphQL */ `query ListRolePermissionByOrganizationId(
  $filter: ModelRolePermissionFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listRolePermissionByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListRolePermissionByOrganizationIdQueryVariables,
  APITypes.ListRolePermissionByOrganizationIdQuery
>;
export const listRolePermissions = /* GraphQL */ `query ListRolePermissions(
  $filter: ModelRolePermissionFilterInput
  $limit: Int
  $nextToken: String
) {
  listRolePermissions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListRolePermissionsQueryVariables,
  APITypes.ListRolePermissionsQuery
>;
export const listSaudaByBuyerPartyId = /* GraphQL */ `query ListSaudaByBuyerPartyId(
  $buyerPartyId: String!
  $filter: ModelSaudaFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listSaudaByBuyerPartyId(
    buyerPartyId: $buyerPartyId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSaudaByBuyerPartyIdQueryVariables,
  APITypes.ListSaudaByBuyerPartyIdQuery
>;
export const listSaudaByOrganizationId = /* GraphQL */ `query ListSaudaByOrganizationId(
  $filter: ModelSaudaFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listSaudaByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSaudaByOrganizationIdQueryVariables,
  APITypes.ListSaudaByOrganizationIdQuery
>;
export const listSaudaBySellerPartyId = /* GraphQL */ `query ListSaudaBySellerPartyId(
  $filter: ModelSaudaFilterInput
  $limit: Int
  $nextToken: String
  $sellerPartyId: String!
  $sortDirection: ModelSortDirection
) {
  listSaudaBySellerPartyId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sellerPartyId: $sellerPartyId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSaudaBySellerPartyIdQueryVariables,
  APITypes.ListSaudaBySellerPartyIdQuery
>;
export const listSaudas = /* GraphQL */ `query ListSaudas(
  $filter: ModelSaudaFilterInput
  $limit: Int
  $nextToken: String
) {
  listSaudas(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSaudasQueryVariables,
  APITypes.ListSaudasQuery
>;
export const listShiftingByAmadId = /* GraphQL */ `query ListShiftingByAmadId(
  $amadId: ID!
  $filter: ModelShiftingFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listShiftingByAmadId(
    amadId: $amadId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListShiftingByAmadIdQueryVariables,
  APITypes.ListShiftingByAmadIdQuery
>;
export const listShiftingByOrganizationId = /* GraphQL */ `query ListShiftingByOrganizationId(
  $filter: ModelShiftingFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listShiftingByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListShiftingByOrganizationIdQueryVariables,
  APITypes.ListShiftingByOrganizationIdQuery
>;
export const listShiftingByShiftingHeaderId = /* GraphQL */ `query ListShiftingByShiftingHeaderId(
  $filter: ModelShiftingFilterInput
  $limit: Int
  $nextToken: String
  $shiftingHeaderId: ID!
  $sortDirection: ModelSortDirection
) {
  listShiftingByShiftingHeaderId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    shiftingHeaderId: $shiftingHeaderId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListShiftingByShiftingHeaderIdQueryVariables,
  APITypes.ListShiftingByShiftingHeaderIdQuery
>;
export const listShiftingHeaderByOrganizationId = /* GraphQL */ `query ListShiftingHeaderByOrganizationId(
  $filter: ModelShiftingHeaderFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listShiftingHeaderByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListShiftingHeaderByOrganizationIdQueryVariables,
  APITypes.ListShiftingHeaderByOrganizationIdQuery
>;
export const listShiftingHeaders = /* GraphQL */ `query ListShiftingHeaders(
  $filter: ModelShiftingHeaderFilterInput
  $limit: Int
  $nextToken: String
) {
  listShiftingHeaders(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListShiftingHeadersQueryVariables,
  APITypes.ListShiftingHeadersQuery
>;
export const listShiftings = /* GraphQL */ `query ListShiftings(
  $filter: ModelShiftingFilterInput
  $limit: Int
  $nextToken: String
) {
  listShiftings(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListShiftingsQueryVariables,
  APITypes.ListShiftingsQuery
>;
export const listStockTransferByOrganizationId = /* GraphQL */ `query ListStockTransferByOrganizationId(
  $filter: ModelStockTransferFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listStockTransferByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListStockTransferByOrganizationIdQueryVariables,
  APITypes.ListStockTransferByOrganizationIdQuery
>;
export const listStockTransfers = /* GraphQL */ `query ListStockTransfers(
  $filter: ModelStockTransferFilterInput
  $limit: Int
  $nextToken: String
) {
  listStockTransfers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListStockTransfersQueryVariables,
  APITypes.ListStockTransfersQuery
>;
export const listSystemConfigByOrganizationId = /* GraphQL */ `query ListSystemConfigByOrganizationId(
  $filter: ModelSystemConfigFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listSystemConfigByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSystemConfigByOrganizationIdQueryVariables,
  APITypes.ListSystemConfigByOrganizationIdQuery
>;
export const listSystemConfigs = /* GraphQL */ `query ListSystemConfigs(
  $filter: ModelSystemConfigFilterInput
  $limit: Int
  $nextToken: String
) {
  listSystemConfigs(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListSystemConfigsQueryVariables,
  APITypes.ListSystemConfigsQuery
>;
export const listTakpattiByOrganizationId = /* GraphQL */ `query ListTakpattiByOrganizationId(
  $filter: ModelTakpattiFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listTakpattiByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTakpattiByOrganizationIdQueryVariables,
  APITypes.ListTakpattiByOrganizationIdQuery
>;
export const listTakpattis = /* GraphQL */ `query ListTakpattis(
  $filter: ModelTakpattiFilterInput
  $limit: Int
  $nextToken: String
) {
  listTakpattis(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTakpattisQueryVariables,
  APITypes.ListTakpattisQuery
>;
export const listTemperatureLogByChamberId = /* GraphQL */ `query ListTemperatureLogByChamberId(
  $chamberId: ID!
  $filter: ModelTemperatureLogFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listTemperatureLogByChamberId(
    chamberId: $chamberId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTemperatureLogByChamberIdQueryVariables,
  APITypes.ListTemperatureLogByChamberIdQuery
>;
export const listTemperatureLogByOrganizationId = /* GraphQL */ `query ListTemperatureLogByOrganizationId(
  $filter: ModelTemperatureLogFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listTemperatureLogByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTemperatureLogByOrganizationIdQueryVariables,
  APITypes.ListTemperatureLogByOrganizationIdQuery
>;
export const listTemperatureLogs = /* GraphQL */ `query ListTemperatureLogs(
  $filter: ModelTemperatureLogFilterInput
  $limit: Int
  $nextToken: String
) {
  listTemperatureLogs(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTemperatureLogsQueryVariables,
  APITypes.ListTemperatureLogsQuery
>;
export const listUnloadingByAmadId = /* GraphQL */ `query ListUnloadingByAmadId(
  $amadId: ID!
  $filter: ModelUnloadingFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listUnloadingByAmadId(
    amadId: $amadId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUnloadingByAmadIdQueryVariables,
  APITypes.ListUnloadingByAmadIdQuery
>;
export const listUnloadingByChamberId = /* GraphQL */ `query ListUnloadingByChamberId(
  $chamberId: ID!
  $filter: ModelUnloadingFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listUnloadingByChamberId(
    chamberId: $chamberId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUnloadingByChamberIdQueryVariables,
  APITypes.ListUnloadingByChamberIdQuery
>;
export const listUnloadingByOrganizationId = /* GraphQL */ `query ListUnloadingByOrganizationId(
  $filter: ModelUnloadingFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listUnloadingByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUnloadingByOrganizationIdQueryVariables,
  APITypes.ListUnloadingByOrganizationIdQuery
>;
export const listUnloadings = /* GraphQL */ `query ListUnloadings(
  $filter: ModelUnloadingFilterInput
  $limit: Int
  $nextToken: String
) {
  listUnloadings(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUnloadingsQueryVariables,
  APITypes.ListUnloadingsQuery
>;
export const listVillageByOrganizationId = /* GraphQL */ `query ListVillageByOrganizationId(
  $filter: ModelVillageFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listVillageByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListVillageByOrganizationIdQueryVariables,
  APITypes.ListVillageByOrganizationIdQuery
>;
export const listVillages = /* GraphQL */ `query ListVillages(
  $filter: ModelVillageFilterInput
  $limit: Int
  $nextToken: String
) {
  listVillages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListVillagesQueryVariables,
  APITypes.ListVillagesQuery
>;
export const listVoucherByCrAccountId = /* GraphQL */ `query ListVoucherByCrAccountId(
  $crAccountId: String!
  $filter: ModelVoucherFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listVoucherByCrAccountId(
    crAccountId: $crAccountId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListVoucherByCrAccountIdQueryVariables,
  APITypes.ListVoucherByCrAccountIdQuery
>;
export const listVoucherByDrAccountId = /* GraphQL */ `query ListVoucherByDrAccountId(
  $drAccountId: String!
  $filter: ModelVoucherFilterInput
  $limit: Int
  $nextToken: String
  $sortDirection: ModelSortDirection
) {
  listVoucherByDrAccountId(
    drAccountId: $drAccountId
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListVoucherByDrAccountIdQueryVariables,
  APITypes.ListVoucherByDrAccountIdQuery
>;
export const listVoucherByOrganizationId = /* GraphQL */ `query ListVoucherByOrganizationId(
  $filter: ModelVoucherFilterInput
  $limit: Int
  $nextToken: String
  $organizationId: ID!
  $sortDirection: ModelSortDirection
) {
  listVoucherByOrganizationId(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
    organizationId: $organizationId
    sortDirection: $sortDirection
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListVoucherByOrganizationIdQueryVariables,
  APITypes.ListVoucherByOrganizationIdQuery
>;
export const listVouchers = /* GraphQL */ `query ListVouchers(
  $filter: ModelVoucherFilterInput
  $limit: Int
  $nextToken: String
) {
  listVouchers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListVouchersQueryVariables,
  APITypes.ListVouchersQuery
>;
