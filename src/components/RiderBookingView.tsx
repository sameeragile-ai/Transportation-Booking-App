import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Calendar, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  Sparkles, 
  CreditCard, 
  Phone, 
  MessageSquare, 
  Star, 
  ChevronRight, 
  X, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Car,
  Compass,
  RotateCcw
} from 'lucide-react';
import { 
  LocationPoint, 
  RideOption, 
  TripState, 
  DriverInfo, 
  PassengerInfo 
} from '../types';
import { LONDON_LOCATIONS, RIDE_OPTIONS } from '../data/mockData';

interface RiderBookingViewProps {
  pickup: LocationPoint;
  destination: LocationPoint;
  onChangePickup: (loc: LocationPoint) => void;
  onChangeDestination: (loc: LocationPoint) => void;
  selectedRide: RideOption;
  onSelectRide: (ride: RideOption) => void;
  tripState: TripState;
  onStartBooking: () => void;
  onCancelBooking: () => void;
  onAdvanceTripState: () => void;
  onResetTrip: () => void;
  driver: DriverInfo;
  passenger: PassengerInfo;
  onOpenMaskedComm: (type: 'call' | 'text') => void;
  onOpenPaymentModal: () => void;
  onOpenScheduleModal: () => void;
  paymentMethod: 'apple_pay' | 'visa' | 'google_pay';
  scheduledDetails?: { date: string; time: string; flightNo?: string } | null;
}

export const RiderBookingView: React.FC<RiderBookingViewProps> = ({
  pickup,
  destination,
  onChangePickup,
  onChangeDestination,
  selectedRide,
  onSelectRide,
  tripState,
  onStartBooking,
  onCancelBooking,
  onAdvanceTripState,
  onResetTrip,
  driver,
  passenger,
  onOpenMaskedComm,
  onOpenPaymentModal,
  onOpenScheduleModal,
  paymentMethod,
  scheduledDetails,
}) => {
  const [bookingMode, setBookingMode] = useState<'now' | 'schedule'>('now');
  const [showLocationPicker, setShowLocationPicker] = useState<'pickup' | 'dest' | null>(null);
  const [userRating, setUserRating] = useState<number>(5);
  const [tipAmount, setTipAmount] = useState<number>(3);
  const [ratedSuccess, setRatedSuccess] = useState<boolean>(false);

  // Calculate estimated distance (mock based on coordinates)
  const distanceMiles = Math.max(
    8.4,
    Math.round(
      Math.sqrt(
        Math.pow(destination.x - pickup.x, 2) + Math.pow(destination.y - pickup.y, 2)
      ) * 0.45 * 10
    ) / 10
  );

  const calculateFare = (option: RideOption) => {
    return Math.round((option.basePrice + distanceMiles * option.perMilePrice) * 100) / 100;
  };

  const currentFare = calculateFare(selectedRide);

  // RENDER: Trip Completed Receipt Modal
  if (tripState === 'trip_completed') {
    return (
      <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="text-center pb-5 border-b border-slate-100">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">
            Trip Completed Safely
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-1">£{currentFare.toFixed(2)}</h2>
          <p className="text-xs text-slate-500">
            Charged to {paymentMethod === 'apple_pay' ? 'Apple Pay' : paymentMethod === 'visa' ? 'Visa •••• 4892' : 'Google Pay'}
          </p>
        </div>

        {/* Route Summary */}
        <div className="my-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-slate-700 font-semibold">{pickup.name.split(',')[0]}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-900" />
            <span className="text-slate-900 font-bold">{destination.name.split(',')[0]}</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500">
            <span>{distanceMiles} miles · 24 mins</span>
            <span className="font-mono text-slate-600 font-semibold">VAT Receipt #VLX-8941</span>
          </div>
        </div>

        {/* Rating Driver */}
        <div className="my-5 text-center">
          <p className="text-xs font-bold text-slate-800 mb-2">Rate your journey with {driver.name}</p>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setUserRating(star)}
                className={`p-1.5 transition-transform hover:scale-125 ${
                  star <= userRating ? 'text-amber-400' : 'text-slate-200'
                }`}
              >
                <Star className="w-6 h-6 fill-current" />
              </button>
            ))}
          </div>

          {/* Tip Selector */}
          <div className="mt-4">
            <span className="text-[11px] text-slate-500 block mb-2 font-medium">Add a tip for the chauffeur?</span>
            <div className="flex items-center justify-center gap-2">
              {[0, 2, 3, 5].map((tip) => (
                <button
                  key={tip}
                  type="button"
                  onClick={() => setTipAmount(tip)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    tipAmount === tip
                      ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {tip === 0 ? 'No tip' : `+£${tip}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reset / Book Next CTA */}
        <button
          type="button"
          onClick={onResetTrip}
          className="w-full py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold text-xs shadow-lg transition-transform flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Done · Book Another Journey</span>
        </button>
      </div>
    );
  }

  // RENDER: Active Live Trip Tracking View
  if (tripState !== 'idle' && tripState !== 'selecting_ride') {
    return (
      <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-3 duration-200">
        
        {/* Status Header Bar */}
        <div className="p-4 bg-gradient-to-r from-blue-900 to-slate-900 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                {tripState === 'searching_driver' && 'Matching Top Driver...'}
                {tripState === 'driver_assigned' && 'Driver Assigned'}
                {tripState === 'driver_en_route' && 'Driver En Route · 3 mins away'}
                {tripState === 'driver_arrived' && 'Driver Arrived at Pickup'}
                {tripState === 'in_trip' && 'Trip in Progress to Destination'}
              </span>
            </div>
            <span className="text-xs font-mono font-bold text-white tabular-nums">
              £{currentFare.toFixed(2)}
            </span>
          </div>

          <p className="text-[11px] text-slate-300 mt-1">
            {tripState === 'searching_driver' && 'Querying local dispatch mesh in Mayfair & West End...'}
            {tripState === 'driver_assigned' && `${driver.name} is preparing the vehicle.`}
            {tripState === 'driver_en_route' && `${driver.name} is 0.8 miles away on Piccadilly.`}
            {tripState === 'driver_arrived' && 'Driver waiting curbside with hazard lights on (3 min free wait).'}
            {tripState === 'in_trip' && `Navigating via A4 to ${destination.name.split(',')[0]}.`}
          </p>
        </div>

        {/* Searching Driver Animated Radar */}
        {tripState === 'searching_driver' && (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="relative mb-5">
              <div className="w-20 h-20 rounded-full bg-blue-100/60 animate-ping absolute inset-0" />
              <div className="w-20 h-20 rounded-full border-2 border-blue-600 flex items-center justify-center bg-white shadow-xl relative z-10">
                <Car className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <h3 className="text-base font-bold text-slate-900">Connecting with Chauffeurs</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Matching your booking for {selectedRide.name} with vetted 5-star drivers nearby.
            </p>

            {/* Fast-Forward Simulation Action */}
            <div className="mt-6 flex items-center gap-2 w-full">
              <button
                type="button"
                onClick={onCancelBooking}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
              >
                Cancel Search
              </button>
              <button
                type="button"
                onClick={onAdvanceTripState}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-md"
              >
                Simulate Match ➔
              </button>
            </div>
          </div>
        )}

        {/* Driver Assigned / En Route / In Trip Card */}
        {tripState !== 'searching_driver' && (
          <div className="p-5 space-y-4">
            
            {/* Driver Profile & Car Details Card */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={driver.avatar}
                    alt={driver.name}
                    className="w-14 h-14 rounded-2xl object-cover shadow-md border-2 border-white"
                  />
                  <div className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded-md bg-white shadow text-[10px] font-bold text-slate-800 flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    <span>{driver.rating}</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{driver.name}</h4>
                  <p className="text-xs text-slate-600 font-medium">{driver.carModel}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-800 font-mono text-[10px] font-bold tracking-wider">
                      {driver.plateNumber}
                    </span>
                    <span className="text-[10px] text-slate-400">{driver.tripsCount} trips</span>
                  </div>
                </div>
              </div>

              {/* Vehicle Thumbnail */}
              <div className="hidden sm:block w-20 h-14 rounded-xl overflow-hidden shadow-inner bg-slate-200">
                <img
                  src={selectedRide.image}
                  alt={selectedRide.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* MASKED DIRECT COMMUNICATION ACTION BUTTONS (Twilio Integration Demo) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Contact Driver Privately
                </span>
                <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Twilio Masked Proxy Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => onOpenMaskedComm('call')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100/80 active:scale-95 text-blue-700 font-bold text-xs border border-blue-200/80 transition-all cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  <span>Call Driver</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenMaskedComm('text')}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs border border-slate-200 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                  <span>Text Driver</span>
                </button>
              </div>
            </div>

            {/* Step Advancement / Demo Simulation Toolbar */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={onCancelBooking}
                className="text-xs text-red-500 hover:text-red-700 font-semibold px-2 py-1"
              >
                Cancel Ride
              </button>

              <button
                type="button"
                onClick={onAdvanceTripState}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-colors"
                title="Progress trip simulation to next phase"
              >
                <span>
                  {tripState === 'driver_assigned' && 'Next: Driver En Route ➔'}
                  {tripState === 'driver_en_route' && 'Next: Driver Arrived ➔'}
                  {tripState === 'driver_arrived' && 'Next: Start Trip ➔'}
                  {tripState === 'in_trip' && 'Next: Complete Trip ➔'}
                </span>
              </button>
            </div>
          </div>
        )}

      </div>
    );
  }

  // RENDER: Default Ride Booking & Selection Panel
  return (
    <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col animate-in fade-in duration-200">
      
      {/* Top Booking / Schedule Mode Switcher */}
      <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/60 text-xs font-bold">
          <button
            type="button"
            onClick={() => setBookingMode('now')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              bookingMode === 'now'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ride Now
          </button>
          <button
            type="button"
            onClick={() => {
              setBookingMode('schedule');
              onOpenScheduleModal();
            }}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              bookingMode === 'schedule'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule</span>
          </button>
        </div>

        {/* Scheduled Info Indicator */}
        {scheduledDetails && (
          <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
            {scheduledDetails.date} · {scheduledDetails.time}
          </span>
        )}
      </div>

      <div className="p-5 space-y-4">
        
        {/* Pickup & Dropoff Routing Input Stack */}
        <div className="relative p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          
          {/* Visual Route Connector Line */}
          <div className="absolute left-[26px] top-[26px] bottom-[26px] w-0.5 bg-slate-300" />

          {/* Pickup Input */}
          <div className="flex items-center gap-3 relative">
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow-sm z-10 shrink-0">
              A
            </div>
            <div className="flex-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Pickup Location</span>
              <button
                type="button"
                onClick={() => setShowLocationPicker(showLocationPicker === 'pickup' ? null : 'pickup')}
                className="w-full text-left font-bold text-xs text-slate-800 hover:text-blue-600 transition-colors truncate block"
              >
                {pickup.name}
              </button>
            </div>
          </div>

          <div className="border-t border-slate-200/70" />

          {/* Dropoff Input */}
          <div className="flex items-center gap-3 relative">
            <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold shadow-sm z-10 shrink-0">
              B
            </div>
            <div className="flex-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">Dropoff Destination</span>
              <button
                type="button"
                onClick={() => setShowLocationPicker(showLocationPicker === 'dest' ? null : 'dest')}
                className="w-full text-left font-bold text-xs text-slate-800 hover:text-blue-600 transition-colors truncate block"
              >
                {destination.name}
              </button>
            </div>
          </div>

          {/* Location Quick Selection Dropdown Overlay */}
          {showLocationPicker && (
            <div className="mt-2 pt-2 border-t border-slate-200 space-y-1 max-h-48 overflow-y-auto animate-in fade-in duration-150">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                Select London Landmark
              </span>
              {LONDON_LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => {
                    if (showLocationPicker === 'pickup') onChangePickup(loc);
                    else onChangeDestination(loc);
                    setShowLocationPicker(null);
                  }}
                  className="w-full text-left p-2 rounded-xl hover:bg-white hover:shadow-sm text-xs flex items-center justify-between transition-colors"
                >
                  <div>
                    <span className="font-bold text-slate-800 block">{loc.name}</span>
                    <span className="text-[10px] text-slate-400">{loc.subtext}</span>
                  </div>
                  <span className="text-[10px] text-blue-600 font-medium">{loc.zone}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Vehicle Class Selector List */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-800">Select Vehicle Tier</span>
            <span className="text-[11px] text-slate-500">{distanceMiles} mi · Est. 22-26 mins</span>
          </div>

          <div className="space-y-2">
            {RIDE_OPTIONS.map((opt) => {
              const isSelected = selectedRide.id === opt.id;
              const fare = calculateFare(opt);

              return (
                <div
                  key={opt.id}
                  onClick={() => onSelectRide(opt)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 shadow-md ring-1 ring-blue-600'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Vehicle Photo */}
                    <div className="w-14 h-11 rounded-xl overflow-hidden bg-slate-100 shadow-sm shrink-0">
                      <img
                        src={opt.image}
                        alt={opt.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">{opt.name}</h4>
                        {opt.eco && (
                          <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            EV
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {opt.etaMinutes} min away · {opt.capacity} seats · {opt.luggageCapacity} bags
                      </p>
                    </div>
                  </div>

                  {/* Price in GBP £ */}
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-900 font-mono tabular-nums block">
                      £{fare.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400">Guaranteed</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Method Selector Trigger */}
        <div 
          onClick={onOpenPaymentModal}
          className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs">
              {paymentMethod === 'apple_pay' ? '' : paymentMethod === 'visa' ? 'V' : 'G'}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                {paymentMethod === 'apple_pay' && 'Apple Pay'}
                {paymentMethod === 'visa' && 'Barclays Visa Debit · 4892'}
                {paymentMethod === 'google_pay' && 'Google Pay'}
              </span>
              <span className="text-[10px] text-slate-400">Tap to change method</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {/* Primary Booking Action CTA */}
        <button
          type="button"
          onClick={onStartBooking}
          className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>
            {bookingMode === 'now'
              ? `Confirm ${selectedRide.name} · £${currentFare.toFixed(2)}`
              : `Schedule for ${scheduledDetails?.time || 'Later'} · £${currentFare.toFixed(2)}`}
          </span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Security & Masking Note */}
        <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          Twilio Masked Dispatch & Stripe 3DS Protected
        </p>

      </div>
    </div>
  );
};
