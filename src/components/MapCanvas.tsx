import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  Compass, 
  Layers, 
  Plus, 
  Minus, 
  Crosshair,
  Car,
  BatteryCharging,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { LocationPoint, DriverInfo, FleetVehicle, TripState } from '../types';

interface MapCanvasProps {
  pickup: LocationPoint;
  destination: LocationPoint;
  driver: DriverInfo;
  tripState: TripState;
  fleetVehicles: FleetVehicle[];
  onSelectLocation?: (loc: LocationPoint) => void;
  driverProgress?: number; // 0 to 1 along the path
  roleView: 'rider' | 'driver' | 'admin';
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  pickup,
  destination,
  driver,
  tripState,
  fleetVehicles,
  driverProgress = 0.25,
  roleView,
}) => {
  const [mapTheme, setMapTheme] = useState<'light' | 'dark' | 'traffic'>('light');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedFleetCar, setSelectedFleetCar] = useState<FleetVehicle | null>(null);
  const [showTraffic, setShowTraffic] = useState<boolean>(true);

  // Calculate route curve control points between pickup and destination
  const x1 = pickup.x;
  const y1 = pickup.y;
  const x2 = destination.x;
  const y2 = destination.y;
  
  // Midpoint with curve offset for realistic London road flow
  const mx = (x1 + x2) / 2 + (y2 - y1) * 0.15;
  const my = (y1 + y2) / 2 - (x2 - x1) * 0.15;
  
  const routePath = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;

  // Calculate live position of moving vehicle along quadratic bezier
  const t = Math.min(Math.max(driverProgress, 0), 1);
  // Quadratic bezier formula: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
  const carX = Math.round(((1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2) * 10) / 10;
  const carY = Math.round(((1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * my + t * t * y2) * 10) / 10;

  // Tangent angle for car heading
  const dx = 2 * (1 - t) * (mx - x1) + 2 * t * (x2 - mx);
  const dy = 2 * (1 - t) * (my - y1) + 2 * t * (y2 - my);
  const angleDeg = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);

  const isLight = mapTheme === 'light';

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-slate-100 flex items-center justify-center">
      {/* Dynamic Background Surface based on Map Theme */}
      <div 
        className={`absolute inset-0 transition-colors duration-500 ${
          isLight 
            ? 'bg-gradient-to-br from-[#F8FAFC] via-[#EEF2FF] to-[#E2E8F0]' 
            : mapTheme === 'dark' 
              ? 'bg-[#0F172A]' 
              : 'bg-slate-900'
        }`}
      />

      {/* SVG Vector Map Rendering */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full transition-transform duration-300"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <defs>
          {/* Subtle Grid Pattern */}
          <pattern id="city-grid" width="8" height="8" patternUnits="userSpaceOnUse">
            <path 
              d="M 8 0 L 0 0 0 8" 
              fill="none" 
              stroke={isLight ? 'rgba(148, 163, 184, 0.22)' : 'rgba(51, 65, 85, 0.4)'} 
              strokeWidth="0.12" 
            />
          </pattern>

          {/* River Thames Gradient */}
          <linearGradient id="thamesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={isLight ? '#93C5FD' : '#1E3A8A'} stopOpacity="0.75" />
            <stop offset="50%" stopColor={isLight ? '#60A5FA' : '#1D4ED8'} stopOpacity="0.85" />
            <stop offset="100%" stopColor={isLight ? '#3B82F6' : '#2563EB'} stopOpacity="0.9" />
          </linearGradient>

          {/* Route Active Gradient */}
          <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="50%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          {/* Pulse Glow Filter */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Base Grid Layer */}
        <rect width="100" height="100" fill="url(#city-grid)" />

        {/* London Green Spaces / Parks (Hyde Park, Regent's Park, St James's) */}
        <g id="parks" className="transition-opacity duration-300">
          {/* Regent's Park */}
          <ellipse 
            cx="44" 
            cy="26" 
            rx="5.5" 
            ry="4.5" 
            fill={isLight ? '#DCFCE7' : '#064E3B'} 
            opacity={isLight ? 0.75 : 0.45} 
            stroke={isLight ? '#86EFAC' : '#047857'} 
            strokeWidth="0.15" 
          />
          {/* Hyde Park & Kensington Gardens */}
          <path 
            d="M 33 42 Q 36 38 41 40 Q 42 46 36 48 Q 32 47 33 42 Z" 
            fill={isLight ? '#DCFCE7' : '#064E3B'} 
            opacity={isLight ? 0.8 : 0.5} 
            stroke={isLight ? '#86EFAC' : '#047857'} 
            strokeWidth="0.15" 
          />
          {/* Green Park & St James's Park */}
          <path 
            d="M 43 48 Q 47 48 49 51 Q 46 54 42 51 Z" 
            fill={isLight ? '#DCFCE7' : '#064E3B'} 
            opacity={isLight ? 0.7 : 0.4} 
            stroke={isLight ? '#86EFAC' : '#047857'} 
            strokeWidth="0.12" 
          />
          {/* Victoria Park East */}
          <ellipse 
            cx="75" 
            cy="32" 
            rx="6" 
            ry="3.5" 
            fill={isLight ? '#DCFCE7' : '#064E3B'} 
            opacity={isLight ? 0.6 : 0.35} 
            stroke={isLight ? '#86EFAC' : '#047857'} 
            strokeWidth="0.12" 
          />
          {/* Richmond Park West */}
          <ellipse 
            cx="20" 
            cy="75" 
            rx="7" 
            ry="5.5" 
            fill={isLight ? '#DCFCE7' : '#064E3B'} 
            opacity={isLight ? 0.65 : 0.4} 
            stroke={isLight ? '#86EFAC' : '#047857'} 
            strokeWidth="0.15" 
          />
        </g>

        {/* River Thames Curve (London's iconic sinuous water artery) */}
        <path
          d="M 10 92 Q 22 84 28 72 Q 32 60 40 58 Q 48 57 53 54 Q 60 52 64 56 Q 68 62 76 56 Q 84 50 96 52"
          fill="none"
          stroke="url(#thamesGradient)"
          strokeWidth="3.2"
          strokeLinecap="round"
          opacity="0.88"
        />

        {/* Major Road Arterials (M4 Corridor, Westway A40, Piccadilly, Ring Road) */}
        <g id="roads" stroke={isLight ? '#CBD5E1' : '#334155'} strokeLinecap="round">
          {/* M4 to Heathrow */}
          <path d="M 10 66 L 33 46" strokeWidth="0.8" stroke={isLight ? '#94A3B8' : '#475569'} />
          {/* Piccadilly / Central Axis */}
          <path d="M 33 46 L 50 43 L 64 45 L 82 52" strokeWidth="0.75" />
          {/* North Circular Arc */}
          <path d="M 18 30 Q 50 18 85 28" strokeWidth="0.6" strokeDasharray="1.2 0.8" />
          {/* South Embankment Arterial */}
          <path d="M 32 64 Q 52 60 74 68" strokeWidth="0.6" />
          {/* North-South Corridors */}
          <path d="M 52 15 L 50 43 L 48 68" strokeWidth="0.7" />
          <path d="M 64 25 L 64 75" strokeWidth="0.65" />
          <path d="M 78 30 L 78 80" strokeWidth="0.65" />
        </g>

        {/* Live Traffic Overlay (Congestion zones in warm coral/amber) */}
        {showTraffic && (
          <g id="traffic-lines" opacity="0.75">
            {/* Smooth traffic green flow */}
            <path d="M 12 65 L 30 48" stroke="#10B981" strokeWidth="0.45" strokeLinecap="round" />
            {/* Moderate yellow traffic around Piccadilly */}
            <path d="M 36 45 L 46 43" stroke="#F59E0B" strokeWidth="0.5" strokeLinecap="round" />
            {/* Mild congestion near Central zone */}
            <path d="M 46 43 L 56 42" stroke="#EF4444" strokeWidth="0.5" strokeLinecap="round" />
            <path d="M 56 42 L 72 48" stroke="#10B981" strokeWidth="0.45" strokeLinecap="round" />
          </g>
        )}

        {/* ACTIVE ROUTE LINE (Animated Gradient Path) */}
        {(tripState !== 'idle' || roleView === 'rider') && (
          <g id="active-route">
            {/* Route halo backdrop */}
            <path
              d={routePath}
              fill="none"
              stroke="#2563EB"
              strokeWidth="2.2"
              strokeLinecap="round"
              opacity="0.2"
            />
            {/* Route solid primary line */}
            <path
              d={routePath}
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="1.1"
              strokeLinecap="round"
            />
            {/* Animated flow dashes */}
            <path
              d={routePath}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="0.7"
              strokeDasharray="2 3"
              strokeLinecap="round"
              className="animate-route-flow"
              opacity="0.9"
            />
          </g>
        )}

        {/* PICKUP PIN with Ripple Animation */}
        <g id="pickup-marker" transform={`translate(${pickup.x}, ${pickup.y})`}>
          {/* Animated concentric ripples */}
          <circle r="3.2" fill="#3B82F6" opacity="0.25" className="animate-map-ripple origin-center" />
          <circle r="1.9" fill="#3B82F6" opacity="0.4" />
          {/* Center core pin */}
          <circle r="1.1" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="0.3" filter="url(#glow)" />
        </g>

        {/* DESTINATION PIN */}
        <g id="destination-marker" transform={`translate(${destination.x}, ${destination.y})`}>
          <circle r="1.6" fill="#0F172A" stroke="#FFFFFF" strokeWidth="0.3" />
          <circle r="0.6" fill="#FFFFFF" />
        </g>

        {/* ACTIVE ASSIGNED DRIVER CAR (Live Interpolated Position along Route) */}
        {tripState !== 'idle' && tripState !== 'searching_driver' && (
          <g 
            id="active-driver-vehicle" 
            transform={`translate(${carX}, ${carY}) rotate(${angleDeg})`}
            className="transition-all duration-300"
          >
            {/* Car Shadow */}
            <ellipse cx="0" cy="0.4" rx="1.6" ry="0.9" fill="rgba(0,0,0,0.3)" />
            {/* Car Body Badge */}
            <rect 
              x="-1.3" 
              y="-0.7" 
              width="2.6" 
              height="1.4" 
              rx="0.4" 
              fill="#0F172A" 
              stroke="#60A5FA" 
              strokeWidth="0.2" 
            />
            {/* Windshield */}
            <rect x="-0.4" y="-0.5" width="0.8" height="1.0" rx="0.15" fill="#93C5FD" opacity="0.85" />
            {/* Headlights */}
            <circle cx="1.1" cy="-0.4" r="0.18" fill="#FDE047" />
            <circle cx="1.1" cy="0.4" r="0.18" fill="#FDE047" />
          </g>
        )}

        {/* ALL FLEET VEHICLES (Active for Admin & Background Rider Map) */}
        {fleetVehicles.map((veh) => {
          const isSelected = selectedFleetCar?.id === veh.id;
          const statusColor = 
            veh.status === 'available' ? '#10B981' : 
            veh.status === 'on_trip' ? '#3B82F6' : 
            veh.status === 'en_route' ? '#F59E0B' : '#94A3B8';

          return (
            <g
              key={veh.id}
              transform={`translate(${veh.lngPct}, ${veh.latPct})`}
              className="cursor-pointer transition-transform hover:scale-125"
              onClick={() => setSelectedFleetCar(veh)}
            >
              {/* Outer halo */}
              <circle r="1.4" fill={statusColor} opacity="0.25" />
              {/* Core vehicle node */}
              <circle 
                r="0.9" 
                fill={isSelected ? '#0F172A' : '#FFFFFF'} 
                stroke={statusColor} 
                strokeWidth="0.3" 
              />
              <circle r="0.4" fill={statusColor} />
            </g>
          );
        })}
      </svg>

      {/* HTML Overlays on Top of Vector Map */}
      
      {/* Pickup Floating Pill Label */}
      <div 
        className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-12 transition-all duration-300"
        style={{ left: `${pickup.x}%`, top: `${pickup.y}%` }}
      >
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/90 text-white backdrop-blur-md shadow-lg border border-slate-700/50 text-[11px] font-medium whitespace-nowrap">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span>Pickup: {pickup.name.split(',')[0]}</span>
        </div>
      </div>

      {/* Destination Floating Pill Label */}
      <div 
        className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-12 transition-all duration-300"
        style={{ left: `${destination.x}%`, top: `${destination.y}%` }}
      >
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/95 text-slate-900 backdrop-blur-md shadow-lg border border-slate-200 text-[11px] font-semibold whitespace-nowrap">
          <MapPin className="w-3 h-3 text-red-500 shrink-0" />
          <span>{destination.name.split(',')[0]}</span>
        </div>
      </div>

      {/* Active Driver Live Badge in Rider View */}
      {tripState !== 'idle' && tripState !== 'searching_driver' && (
        <div 
          className="absolute pointer-events-none transform -translate-x-1/2 translate-y-3 transition-all duration-300"
          style={{ left: `${carX}%`, top: `${carY}%` }}
        >
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-600 text-white shadow-md text-[10px] font-bold tracking-tight whitespace-nowrap">
            <Car className="w-2.5 h-2.5" />
            <span>{driver.name.split(' ')[0]} ({driver.carModel.split(' ')[1]})</span>
          </div>
        </div>
      )}

      {/* Selected Fleet Vehicle Inspector Modal (when clicked on map) */}
      {selectedFleetCar && (
        <div className="absolute top-20 right-4 z-20 w-72 p-3.5 rounded-2xl glass-surface shadow-2xl border border-white/80 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                {selectedFleetCar.id.slice(-3)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">{selectedFleetCar.driverName}</h4>
                <p className="text-[10px] text-slate-500">{selectedFleetCar.vehicleModel} · {selectedFleetCar.plate}</p>
              </div>
            </div>
            <button 
              onClick={() => setSelectedFleetCar(null)}
              className="text-slate-400 hover:text-slate-600 text-xs p-1"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2.5 text-[11px]">
            <div className="p-2 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="text-slate-400 text-[10px] block">Status</span>
              <span className={`font-semibold capitalize ${
                selectedFleetCar.status === 'available' ? 'text-emerald-600' :
                selectedFleetCar.status === 'on_trip' ? 'text-blue-600' : 'text-amber-600'
              }`}>
                {selectedFleetCar.status.replace('_', ' ')}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50/80 border border-slate-100">
              <span className="text-slate-400 text-[10px] block">Battery</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1 font-mono">
                <BatteryCharging className="w-3 h-3 text-emerald-500" />
                {selectedFleetCar.battery}%
              </span>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 pt-1">
            <span>Rating: ★ {selectedFleetCar.rating}</span>
            <span className="font-mono text-slate-400">GPS: {selectedFleetCar.latPct.toFixed(2)}°N</span>
          </div>
        </div>
      )}

      {/* Floating Map Controls Dock (Top Right & Bottom Right) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {/* Map Theme Toggle Buttons */}
        <div className="flex items-center p-1 rounded-xl glass-surface shadow-md border border-white/70">
          <button
            onClick={() => setMapTheme('light')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              mapTheme === 'light' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Light vector mode"
          >
            Light
          </button>
          <button
            onClick={() => setMapTheme('dark')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              mapTheme === 'dark' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Night mode"
          >
            Night
          </button>
        </div>

        {/* Live Traffic Toggle */}
        <button
          onClick={() => setShowTraffic(!showTraffic)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold glass-surface shadow-md border border-white/70 transition-colors ${
            showTraffic ? 'text-blue-700 bg-blue-50/80' : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Toggle live traffic congestion"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Traffic</span>
        </button>
      </div>

      {/* Bottom Right Zoom & Center Controls */}
      <div className="absolute bottom-6 right-4 z-10 flex flex-col gap-1.5">
        <button
          onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.0))}
          className="w-9 h-9 rounded-xl glass-surface shadow-md border border-white/80 flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-white active:scale-95 transition-transform"
          aria-label="Zoom in"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.85))}
          className="w-9 h-9 rounded-xl glass-surface shadow-md border border-white/80 flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-white active:scale-95 transition-transform"
          aria-label="Zoom out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel(1)}
          className="w-9 h-9 rounded-xl glass-surface shadow-md border border-white/80 flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-white active:scale-95 transition-transform"
          aria-label="Recenter map"
          title="Recenter"
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Left Map Watermark & Telemetry Badge */}
      <div className="absolute bottom-3 left-4 z-10 flex items-center gap-2 text-[11px] text-slate-500 font-medium">
        <span className="px-2 py-0.5 rounded-md bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700">
          London Metropolitan Vector Grid
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] text-slate-400">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          GPS 51.5074° N, 0.1278° W
        </span>
      </div>
    </div>
  );
};
