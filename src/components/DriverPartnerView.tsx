import React, { useState, useEffect } from 'react';
import { 
  Power, 
  TrendingUp, 
  Navigation, 
  MapPin, 
  Clock, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle, 
  X, 
  Compass, 
  Gauge, 
  BatteryCharging,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { DriverInfo, PassengerInfo, TripState, LocationPoint } from '../types';

interface DriverPartnerViewProps {
  driver: DriverInfo;
  passenger: PassengerInfo;
  pickup: LocationPoint;
  destination: LocationPoint;
  tripState: TripState;
  onAdvanceTripState: () => void;
  onAcceptIncomingTrip: () => void;
  onDeclineIncomingTrip: () => void;
  onOpenMaskedComm: (type: 'call' | 'text') => void;
}

export const DriverPartnerView: React.FC<DriverPartnerViewProps> = ({
  driver,
  passenger,
  pickup,
  destination,
  tripState,
  onAdvanceTripState,
  onAcceptIncomingTrip,
  onDeclineIncomingTrip,
  onOpenMaskedComm,
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [showIncomingOffer, setShowIncomingOffer] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(15);

  // Incoming offer timer simulation
  useEffect(() => {
    let timer: any;
    if (showIncomingOffer && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (countdown === 0 && showIncomingOffer) {
      setShowIncomingOffer(false);
    }
    return () => clearInterval(timer);
  }, [showIncomingOffer, countdown]);

  const triggerMockOffer = () => {
    setCountdown(15);
    setShowIncomingOffer(true);
  };

  const handleAccept = () => {
    setShowIncomingOffer(false);
    onAcceptIncomingTrip();
  };

  const handleDecline = () => {
    setShowIncomingOffer(false);
    onDeclineIncomingTrip();
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col animate-in fade-in duration-200">
      
      {/* Driver Online/Offline Header */}
      <div className={`p-4 transition-colors duration-300 flex items-center justify-between ${
        isOnline 
          ? 'bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 text-white' 
          : 'bg-slate-200 text-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
          <div>
            <h3 className="text-sm font-bold">
              {isOnline ? 'Online · Dispatch Ready' : 'Offline · Rest Mode'}
            </h3>
            <p className="text-[11px] opacity-80">
              {isOnline ? 'Receiving priority requests in Mayfair' : 'Tap switch to go on duty'}
            </p>
          </div>
        </div>

        {/* Online Toggle Switch */}
        <button
          type="button"
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
            isOnline 
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
              : 'bg-slate-900 hover:bg-slate-800 text-white'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>{isOnline ? 'Go Offline' : 'Go Online'}</span>
        </button>
      </div>

      <div className="p-5 space-y-4">
        
        {/* Earnings & Target Summary Strip */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Today's Net Earnings
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                  £148.50
                </span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  +£22.00 Surge
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Completed Trips
              </span>
              <span className="text-lg font-bold text-slate-800 font-mono">9 Trips</span>
            </div>
          </div>

          {/* Weekly Progress Bar */}
          <div>
            <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
              <span>Weekly Target: £680 / £850</span>
              <span className="font-bold text-slate-700">80%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full" style={{ width: '80%' }} />
            </div>
          </div>
        </div>

        {/* INCOMING RIDE REQUEST OVERLAY (Interactive Simulation Modal/Card) */}
        {showIncomingOffer && isOnline && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white shadow-2xl border border-blue-500/40 animate-in zoom-in-95 duration-200 relative overflow-hidden">
            {/* Pulsing Visual Wave Ring */}
            <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-blue-500/20 animate-ping" />

            <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  {countdown}s
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-200 block uppercase tracking-wide">
                    New Ride Request
                  </span>
                  <span className="text-[11px] text-slate-300">Executive Tier (EQE Sedan)</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xl font-extrabold text-emerald-400 font-mono tabular-nums block">
                  £38.40
                </span>
                <span className="text-[10px] text-slate-300">Incl. £6.50 Airport Tariff</span>
              </div>
            </div>

            {/* Passenger Preview & Route */}
            <div className="my-3 space-y-2 relative z-10 text-xs">
              <div className="flex items-center justify-between bg-white/5 p-2 rounded-xl border border-white/10">
                <div className="flex items-center gap-2">
                  <img
                    src={passenger.avatar}
                    alt={passenger.name}
                    className="w-8 h-8 rounded-full object-cover border border-white/30"
                  />
                  <div>
                    <span className="font-bold text-white block">{passenger.name}</span>
                    <span className="text-[10px] text-blue-200">★ {passenger.rating} · {passenger.trips} trips</span>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-400 font-semibold">1.2 mi (4m pickup)</span>
              </div>

              <div className="bg-white/5 p-2 rounded-xl border border-white/10 text-[11px] space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span className="text-slate-200 truncate">From: {pickup.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span className="text-slate-200 truncate">To: {destination.name}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 relative z-10 pt-1">
              <button
                type="button"
                onClick={handleDecline}
                className="py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={handleAccept}
                className="py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 transition-transform active:scale-95"
              >
                Accept (£38.40)
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE NAVIGATION MODE HUD (When Trip in Progress or En Route) */}
        {(tripState === 'driver_assigned' || tripState === 'driver_en_route' || tripState === 'driver_arrived' || tripState === 'in_trip') ? (
          <div className="space-y-3">
            {/* Turn-by-Turn Navigation HUD Card */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <Navigation className="w-5 h-5 rotate-45" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Next Maneuver</span>
                    <h4 className="text-sm font-bold text-white">In 250m turn right onto Piccadilly / A4</h4>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400 block">28 mph</span>
                  <span className="text-[10px] text-slate-400">Limit: 30</span>
                </div>
              </div>

              {/* Waypoint details */}
              <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-semibold truncate max-w-[180px]">
                    {tripState === 'in_trip' ? destination.name.split(',')[0] : pickup.name.split(',')[0]}
                  </span>
                </div>
                <span className="font-mono text-slate-400">14.8 mi · 15:42 ETA</span>
              </div>
            </div>

            {/* Passenger Contact Buttons (Driver Masked Communication) */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={passenger.avatar}
                  alt={passenger.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">{passenger.name}</span>
                  <span className="text-[10px] text-emerald-600 font-medium">Masked Proxy Connected</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpenMaskedComm('call')}
                  className="p-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                  title="Call passenger via masked proxy"
                >
                  <Phone className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onOpenMaskedComm('text')}
                  className="p-2 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors"
                  title="Message passenger"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Driver Trip Progression Action Button */}
            <button
              type="button"
              onClick={onAdvanceTripState}
              className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-transform"
            >
              <CheckCircle className="w-4 h-4" />
              <span>
                {tripState === 'driver_assigned' && 'Confirm En Route to Passenger'}
                {tripState === 'driver_en_route' && 'Arrived at Pickup (Notify Rider)'}
                {tripState === 'driver_arrived' && 'Start Trip to Destination'}
                {tripState === 'in_trip' && 'Complete Trip & Collect £38.40'}
              </span>
            </button>
          </div>
        ) : (
          /* Idle Driver View with simulation trigger */
          <div className="text-center py-4">
            {!showIncomingOffer && isOnline && (
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
                <p className="text-xs text-blue-900 font-semibold mb-2">
                  Currently searching for nearby ride dispatches...
                </p>
                <button
                  type="button"
                  onClick={triggerMockOffer}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Simulate Incoming Ride Request
                </button>
              </div>
            )}
          </div>
        )}

        {/* Vehicle Health & Telemetry Info */}
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block">Battery Level</span>
            <span className="font-bold text-slate-800 font-mono">{driver.batteryPercent}%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block">Acceptance</span>
            <span className="font-bold text-emerald-600 font-mono">98.4%</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 block">Safety Rating</span>
            <span className="font-bold text-slate-800 font-mono">★ {driver.rating}</span>
          </div>
        </div>

      </div>
    </div>
  );
};
