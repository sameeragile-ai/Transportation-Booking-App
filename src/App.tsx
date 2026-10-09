import React, { useState, useEffect } from 'react';
import { 
  Car, 
  UserCheck, 
  ShieldCheck, 
  FileText, 
  Layers, 
  MapPin, 
  Navigation, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Sliders, 
  Compass, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Activity
} from 'lucide-react';
import { 
  RoleView, 
  LocationPoint, 
  RideOption, 
  TripState, 
  DriverInfo, 
  PassengerInfo, 
  FleetVehicle 
} from './types';
import { 
  LONDON_LOCATIONS, 
  RIDE_OPTIONS, 
  DEFAULT_DRIVER, 
  DEFAULT_PASSENGER, 
  INITIAL_FLEET 
} from './data/mockData';
import { MapCanvas } from './components/MapCanvas';
import { RiderBookingView } from './components/RiderBookingView';
import { DriverPartnerView } from './components/DriverPartnerView';
import { AdminConsoleView } from './components/AdminConsoleView';
import { MaskedCommunicationModal } from './components/MaskedCommunicationModal';
import { PaymentModal } from './components/PaymentModal';
import { ScheduleModal } from './components/ScheduleModal';
import { ProposalHubDrawer } from './components/ProposalHubDrawer';

export default function App() {
  // Navigation & Role State
  const [roleView, setRoleView] = useState<RoleView>('rider');
  const [isProposalHubOpen, setIsProposalHubOpen] = useState<boolean>(false);

  // Locations & Routing State
  const [pickup, setPickup] = useState<LocationPoint>(LONDON_LOCATIONS[0]); // Mayfair
  const [destination, setDestination] = useState<LocationPoint>(LONDON_LOCATIONS[1]); // Heathrow T5
  const [selectedRide, setSelectedRide] = useState<RideOption>(RIDE_OPTIONS[1]); // Velox Executive

  // Simulation Lifecycle State
  const [tripState, setTripState] = useState<TripState>('idle');
  const [driverProgress, setDriverProgress] = useState<number>(0.2); // 0 to 1 along bezier route
  const [driver, setDriver] = useState<DriverInfo>(DEFAULT_DRIVER);
  const [passenger, setPassenger] = useState<PassengerInfo>(DEFAULT_PASSENGER);
  const [fleetVehicles, setFleetVehicles] = useState<FleetVehicle[]>(INITIAL_FLEET);

  // Modals
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [maskedCommModal, setMaskedCommModal] = useState<{ isOpen: boolean; type: 'call' | 'text' }>({
    isOpen: false,
    type: 'call',
  });
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'visa' | 'google_pay'>('apple_pay');
  const [scheduledDetails, setScheduledDetails] = useState<{ date: string; time: string; flightNo?: string } | null>(null);

  // Automated Vehicle Movement along route when in progress
  useEffect(() => {
    let interval: any;
    if (tripState === 'driver_en_route') {
      interval = setInterval(() => {
        setDriverProgress((p) => {
          if (p >= 0.45) return 0.45;
          return p + 0.04;
        });
      }, 800);
    } else if (tripState === 'in_trip') {
      interval = setInterval(() => {
        setDriverProgress((p) => {
          if (p >= 0.95) return 0.95;
          return p + 0.05;
        });
      }, 700);
    } else if (tripState === 'driver_assigned') {
      setDriverProgress(0.15);
    } else if (tripState === 'driver_arrived') {
      setDriverProgress(0.48);
    }
    return () => clearInterval(interval);
  }, [tripState]);

  // Trip advancement logic
  const handleAdvanceTripState = () => {
    if (tripState === 'searching_driver') {
      setTripState('driver_assigned');
      setDriverProgress(0.2);
    } else if (tripState === 'driver_assigned') {
      setTripState('driver_en_route');
    } else if (tripState === 'driver_en_route') {
      setTripState('driver_arrived');
      setDriverProgress(0.5);
    } else if (tripState === 'driver_arrived') {
      setTripState('in_trip');
    } else if (tripState === 'in_trip') {
      setTripState('trip_completed');
      setDriverProgress(1.0);
    }
  };

  const handleStartBooking = () => {
    setIsPaymentModalOpen(true);
  };

  const handlePaymentConfirmed = (method: 'apple_pay' | 'visa' | 'google_pay') => {
    setPaymentMethod(method);
    setIsPaymentModalOpen(false);
    setTripState('searching_driver');

    // Simulate automatic matching after 2.5s
    setTimeout(() => {
      setTripState('driver_assigned');
      setTimeout(() => {
        setTripState('driver_en_route');
      }, 2000);
    }, 2400);
  };

  const handleCancelBooking = () => {
    setTripState('idle');
    setDriverProgress(0.2);
  };

  const handleResetTrip = () => {
    setTripState('idle');
    setDriverProgress(0.2);
  };

  const handleDriverAcceptIncoming = () => {
    setTripState('driver_assigned');
    setDriverProgress(0.2);
    setTimeout(() => {
      setTripState('driver_en_route');
    }, 1500);
  };

  const handleDriverDeclineIncoming = () => {
    // declined
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* =========================================================================
          TOP BAR CONTRACT (Strict 3-zone architecture):
          [Zone 1: Brand Wordmark] — [Zone 2: 3-4 Nav Links] — [Zone 3: 1 Primary CTA]
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Text Element Brand Wordmark */}
        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); setRoleView('rider'); }}
          className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-600/30">
            V
          </div>
          <span>Velox Mobility</span>
        </a>

        {/* Zone 2: Navigation Links / User Role View Switcher */}
        <nav className="flex items-center gap-1 p-1 rounded-xl bg-slate-100/90 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setRoleView('rider')}
            className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
              roleView === 'rider'
                ? 'bg-white text-blue-600 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rider Booking
          </button>

          <button
            type="button"
            onClick={() => setRoleView('driver')}
            className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
              roleView === 'driver'
                ? 'bg-white text-blue-600 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Driver Partner
          </button>

          <button
            type="button"
            onClick={() => setRoleView('admin')}
            className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
              roleView === 'admin'
                ? 'bg-white text-blue-600 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fleet & Telemetry
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (Proposal & Architecture Hub) */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsProposalHubOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-md hover:shadow-lg whitespace-nowrap shrink-0 active:scale-95 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Architecture & Proposal Hub</span>
          </button>
        </div>
      </header>

      {/* SUB-HEADER CONTEXT STRIP (Active Mode & Real-Time Sync Indicator) */}
      <div className="bg-white/60 border-b border-slate-200/60 px-6 py-2 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-800">
            {roleView === 'rider' && 'Rider Simulation: Central London & Airport Transfer'}
            {roleView === 'driver' && 'Driver Console: Mercedes EQE Chauffeur Partner HUD'}
            {roleView === 'admin' && 'Enterprise Console: London Zone 1-6 Dispatch Operations'}
          </span>
          <span className="hidden md:inline" aria-hidden="true">·</span>
          <span className="hidden md:inline font-mono text-[11px] text-slate-400">
            Twilio Masked Proxy: Active
          </span>
        </div>

        <div className="flex items-center gap-3">
          {tripState !== 'idle' && (
            <div className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-medium text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
              <span>Trip {tripState.replace('_', ' ')}</span>
            </div>
          )}
          <span className="font-mono text-[11px] text-slate-400">
            Currency: GBP (£)
          </span>
        </div>
      </div>

      {/* MAIN VIEWPORT CANVAS (Full-bleed responsive layout) */}
      <main className="flex-1 relative flex flex-col lg:flex-row overflow-hidden min-h-[calc(100vh-105px)]">
        
        {/* LEFT INTERACTIVE CONTROL DECK */}
        <div className="w-full lg:w-[480px] xl:w-[520px] p-4 lg:p-6 z-20 flex flex-col justify-start overflow-y-auto max-h-[calc(100vh-105px)] shrink-0">
          {roleView === 'rider' && (
            <RiderBookingView
              pickup={pickup}
              destination={destination}
              onChangePickup={setPickup}
              onChangeDestination={setDestination}
              selectedRide={selectedRide}
              onSelectRide={setSelectedRide}
              tripState={tripState}
              onStartBooking={handleStartBooking}
              onCancelBooking={handleCancelBooking}
              onAdvanceTripState={handleAdvanceTripState}
              onResetTrip={handleResetTrip}
              driver={driver}
              passenger={passenger}
              onOpenMaskedComm={(type) => setMaskedCommModal({ isOpen: true, type })}
              onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
              onOpenScheduleModal={() => setIsScheduleModalOpen(true)}
              paymentMethod={paymentMethod}
              scheduledDetails={scheduledDetails}
            />
          )}

          {roleView === 'driver' && (
            <DriverPartnerView
              driver={driver}
              passenger={passenger}
              pickup={pickup}
              destination={destination}
              tripState={tripState}
              onAdvanceTripState={handleAdvanceTripState}
              onAcceptIncomingTrip={handleDriverAcceptIncoming}
              onDeclineIncomingTrip={handleDriverDeclineIncoming}
              onOpenMaskedComm={(type) => setMaskedCommModal({ isOpen: true, type })}
            />
          )}

          {roleView === 'admin' && (
            <AdminConsoleView
              fleetVehicles={fleetVehicles}
              onSelectFleetVehicle={(veh) => {
                // Focus on vehicle
              }}
            />
          )}
        </div>

        {/* RIGHT DYNAMIC MAP CANVAS (Expands across remaining screen) */}
        <div className="flex-1 relative min-h-[420px] lg:min-h-full">
          <MapCanvas
            pickup={pickup}
            destination={destination}
            driver={driver}
            tripState={tripState}
            fleetVehicles={fleetVehicles}
            driverProgress={driverProgress}
            roleView={roleView}
          />
        </div>

      </main>

      {/* MODALS & OVERLAYS */}
      <MaskedCommunicationModal
        isOpen={maskedCommModal.isOpen}
        onClose={() => setMaskedCommModal({ isOpen: false, type: 'call' })}
        type={maskedCommModal.type}
        driver={driver}
      />

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirmSuccess={handlePaymentConfirmed}
        totalFare={selectedRide.basePrice + 14.8 * selectedRide.perMilePrice}
      />

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onConfirmSchedule={(details) => setScheduledDetails(details)}
      />

      <ProposalHubDrawer
        isOpen={isProposalHubOpen}
        onClose={() => setIsProposalHubOpen(false)}
      />

    </div>
  );
}
