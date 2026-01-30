// Rack status type
export type RackStatusValue = "EMPTY" | "PARTIAL" | "FULL" | "RESERVED" | "MAINTENANCE";

// Temperature status type
export type TemperatureStatusValue = "NORMAL" | "WARNING" | "CRITICAL" | "OFFLINE";

// Shifting status type
export type ShiftingStatusValue = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

// Chamber types
export interface Chamber {
  id: string;
  organizationId: string;
  code: string;
  roomNumber: number;
  name: string;
  nameHindi?: string | null;
  floors?: number | null;
  totalRacks?: number | null;
  racksPerRow?: number | null;
  rackCapacity?: number | null;
  targetTemperature?: number | null;
  minTemperature?: number | null;
  maxTemperature?: number | null;
  currentTemperature?: number | null;
  temperatureStatus?: TemperatureStatusValue | null;
  description?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChamberInput {
  organizationId: string;
  code: string;
  roomNumber: number;
  name: string;
  nameHindi?: string;
  floors?: number;
  totalRacks?: number;
  racksPerRow?: number;
  rackCapacity?: number;
  targetTemperature?: number;
  minTemperature?: number;
  maxTemperature?: number;
  currentTemperature?: number;
  temperatureStatus?: TemperatureStatusValue;
  description?: string;
  isActive?: boolean;
}

export interface UpdateChamberInput extends Partial<CreateChamberInput> {
  id: string;
}

// ChamberFloor types
export interface ChamberFloor {
  id: string;
  organizationId: string;
  chamberId: string;
  floorNumber: number;
  floorName?: string | null;
  fromRack: number;
  toRack: number;
  racksPerRow?: number | null;
  description?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChamberFloorInput {
  organizationId: string;
  chamberId: string;
  floorNumber: number;
  floorName?: string;
  fromRack: number;
  toRack: number;
  racksPerRow?: number;
  description?: string;
  isActive?: boolean;
}

export interface UpdateChamberFloorInput extends Partial<CreateChamberFloorInput> {
  id: string;
}

// Loading types
export interface Loading {
  id: string;
  organizationId: string;
  loadingNo: number;
  date: string;
  amadId: string;
  amadNo?: number | null;
  partyId?: string | null;
  partyName?: string | null;
  commodityName?: string | null;
  chamberId: string;
  chamberName?: string | null;
  floorNumber: number;
  rackNumber: number;
  pkt1?: number | null;
  pkt2?: number | null;
  pkt3?: number | null;
  totalQuantity?: number | null;
  totalWeight?: number | null;
  rackStatus?: RackStatusValue | null;
  remarks?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLoadingInput {
  organizationId: string;
  loadingNo: number;
  date: string;
  amadId: string;
  amadNo?: number;
  partyId?: string;
  partyName?: string;
  commodityName?: string;
  chamberId: string;
  chamberName?: string;
  floorNumber: number;
  rackNumber: number;
  pkt1?: number;
  pkt2?: number;
  pkt3?: number;
  totalQuantity?: number;
  totalWeight?: number;
  rackStatus?: RackStatusValue;
  remarks?: string;
  isActive?: boolean;
}

export interface UpdateLoadingInput extends Partial<CreateLoadingInput> {
  id: string;
}

// Unloading types
export interface Unloading {
  id: string;
  organizationId: string;
  unloadingNo: number;
  date: string;
  amadId: string;
  amadNo?: number | null;
  rentId?: string | null;
  rentSerialNo?: number | null;
  partyId?: string | null;
  partyName?: string | null;
  commodityName?: string | null;
  chamberId: string;
  chamberName?: string | null;
  floorNumber: number;
  rackNumber: number;
  pkt1?: number | null;
  pkt2?: number | null;
  pkt3?: number | null;
  totalQuantity?: number | null;
  totalWeight?: number | null;
  vehicleNo?: string | null;
  remarks?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUnloadingInput {
  organizationId: string;
  unloadingNo: number;
  date: string;
  amadId: string;
  amadNo?: number;
  rentId?: string;
  rentSerialNo?: number;
  partyId?: string;
  partyName?: string;
  commodityName?: string;
  chamberId: string;
  chamberName?: string;
  floorNumber: number;
  rackNumber: number;
  pkt1?: number;
  pkt2?: number;
  pkt3?: number;
  totalQuantity?: number;
  totalWeight?: number;
  vehicleNo?: string;
  remarks?: string;
  isActive?: boolean;
}

export interface UpdateUnloadingInput extends Partial<CreateUnloadingInput> {
  id: string;
}

// ShiftingHeader types
export interface ShiftingHeader {
  id: string;
  organizationId: string;
  shiftNo: number;
  shiftDate: string;
  fromChamberId: string;
  fromChamberName?: string | null;
  toChamberId: string;
  toChamberName?: string | null;
  totalItems?: number | null;
  totalQuantity?: number | null;
  status?: ShiftingStatusValue | null;
  reason?: string | null;
  remarks?: string | null;
  completedAt?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShiftingHeaderInput {
  organizationId: string;
  shiftNo: number;
  shiftDate: string;
  fromChamberId: string;
  fromChamberName?: string;
  toChamberId: string;
  toChamberName?: string;
  totalItems?: number;
  totalQuantity?: number;
  status?: ShiftingStatusValue;
  reason?: string;
  remarks?: string;
  completedAt?: string;
  isActive?: boolean;
}

export interface UpdateShiftingHeaderInput extends Partial<CreateShiftingHeaderInput> {
  id: string;
}

// Shifting (detail lines) types
export interface Shifting {
  id: string;
  organizationId: string;
  shiftingHeaderId: string;
  amadId: string;
  amadNo?: number | null;
  partyId?: string | null;
  partyName?: string | null;
  commodityName?: string | null;
  fromChamberId: string;
  fromFloorNumber: number;
  fromRackNumber: number;
  toChamberId: string;
  toFloorNumber: number;
  toRackNumber: number;
  pkt1?: number | null;
  pkt2?: number | null;
  pkt3?: number | null;
  totalQuantity?: number | null;
  totalWeight?: number | null;
  remarks?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShiftingInput {
  organizationId: string;
  shiftingHeaderId: string;
  amadId: string;
  amadNo?: number;
  partyId?: string;
  partyName?: string;
  commodityName?: string;
  fromChamberId: string;
  fromFloorNumber: number;
  fromRackNumber: number;
  toChamberId: string;
  toFloorNumber: number;
  toRackNumber: number;
  pkt1?: number;
  pkt2?: number;
  pkt3?: number;
  totalQuantity?: number;
  totalWeight?: number;
  remarks?: string;
  isActive?: boolean;
}

export interface UpdateShiftingInput extends Partial<CreateShiftingInput> {
  id: string;
}

// TemperatureLog types
export interface TemperatureLog {
  id: string;
  organizationId: string;
  chamberId: string;
  chamberName?: string | null;
  date: string;
  time: string;
  lowTemp: number;
  highTemp: number;
  avgTemp?: number | null;
  humidity?: number | null;
  status?: TemperatureStatusValue | null;
  recordedBy?: string | null;
  remarks?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemperatureLogInput {
  organizationId: string;
  chamberId: string;
  chamberName?: string;
  date: string;
  time: string;
  lowTemp: number;
  highTemp: number;
  avgTemp?: number;
  humidity?: number;
  status?: TemperatureStatusValue;
  recordedBy?: string;
  remarks?: string;
  isActive?: boolean;
}

export interface UpdateTemperatureLogInput extends Partial<CreateTemperatureLogInput> {
  id: string;
}

// MeterReading types
export interface MeterReading {
  id: string;
  organizationId: string;
  chamberId?: string | null;
  chamberName?: string | null;
  meterNumber?: string | null;
  readingDate: string;
  readingTime?: string | null;
  previousReading?: number | null;
  currentReading: number;
  consumption?: number | null;
  unit?: string | null;
  photoUrl?: string | null;
  recordedBy?: string | null;
  remarks?: string | null;
  isActive?: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMeterReadingInput {
  organizationId: string;
  chamberId?: string;
  chamberName?: string;
  meterNumber?: string;
  readingDate: string;
  readingTime?: string;
  previousReading?: number;
  currentReading: number;
  consumption?: number;
  unit?: string;
  photoUrl?: string;
  recordedBy?: string;
  remarks?: string;
  isActive?: boolean;
}

export interface UpdateMeterReadingInput extends Partial<CreateMeterReadingInput> {
  id: string;
}

// Computed types for UI
export interface RackOccupancy {
  chamberId: string;
  floorNumber: number;
  rackNumber: number;
  status: RackStatusValue;
  totalQuantity: number;
  amadId?: string;
  amadNo?: number;
  partyName?: string;
  commodityName?: string;
}

export interface ChamberStats {
  chamberId: string;
  chamberName: string;
  totalRacks: number;
  occupiedRacks: number;
  emptyRacks: number;
  partialRacks: number;
  reservedRacks: number;
  maintenanceRacks: number;
  occupancyPercentage: number;
  totalQuantity: number;
}

export interface ShiftingWizardState {
  step: 1 | 2 | 3 | 4;
  sourceChamberId?: string;
  sourceFloorNumber?: number;
  sourceRackNumber?: number;
  destinationChamberId?: string;
  destinationFloorNumber?: number;
  destinationRackNumber?: number;
  amadId?: string;
  pkt1: number;
  pkt2: number;
  pkt3: number;
  reason?: string;
  remarks?: string;
}
