export type RoleView = 'rider' | 'driver' | 'admin';

export interface LocationPoint {
  id: string;
  name: string;
  subtext: string;
  x: number; // percentage on map canvas (0-100)
  y: number; // percentage on map canvas (0-100)
  zone: string;
  popular?: boolean;
}

export interface RideOption {
  id: string;
  name: string;
  tagline: string;
  tier: 'standard' | 'executive' | 'van';
  basePrice: number;
  perMilePrice: number;
  etaMinutes: number;
  capacity: number;
  luggageCapacity: number;
  carModel: string;
  image: string;
  eco: boolean;
  features: string[];
}

export type TripState = 
  | 'idle' 
  | 'selecting_ride' 
  | 'scheduling'
  | 'searching_driver' 
  | 'driver_assigned' 
  | 'driver_en_route' 
  | 'driver_arrived' 
  | 'in_trip' 
  | 'trip_completed';

export interface DriverInfo {
  id: string;
  name: string;
  rating: number;
  tripsCount: number;
  avatar: string;
  carModel: string;
  plateNumber: string;
  carColor: string;
  phoneMasked: string;
  realPhoneMasked: string;
  currentX: number;
  currentY: number;
  heading: number;
  status: 'available' | 'en_route' | 'in_trip' | 'offline';
  batteryPercent: number;
}

export interface PassengerInfo {
  name: string;
  rating: number;
  trips: number;
  avatar: string;
  phoneMasked: string;
}

export interface ActiveTrip {
  id: string;
  pickup: LocationPoint;
  destination: LocationPoint;
  rideOption: RideOption;
  fare: number;
  distanceMiles: number;
  estimatedMinutes: number;
  driver: DriverInfo;
  passenger: PassengerInfo;
  state: TripState;
  startTime?: string;
  paymentMethod: 'apple_pay' | 'visa' | 'google_pay';
  proxySessionId: string;
}

export interface TelephonyLog {
  id: string;
  tripId: string;
  timestamp: string;
  type: 'voice' | 'sms';
  durationSeconds?: number;
  virtualNumber: string;
  participantA: string; // Rider
  participantB: string; // Driver
  encryptionStatus: 'AES-256' | 'TLS 1.3';
  piiProtection: 'Active - Zero PII Exposed';
}

export interface FleetVehicle {
  id: string;
  driverName: string;
  status: 'available' | 'on_trip' | 'en_route' | 'resting';
  latPct: number;
  lngPct: number;
  vehicleModel: string;
  plate: string;
  battery: number;
  rating: number;
}
