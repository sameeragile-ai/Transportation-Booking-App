import React, { useState } from 'react';
import { 
  Users, 
  DollarSign, 
  CheckCircle, 
  Zap, 
  Search, 
  Filter, 
  ShieldCheck, 
  Lock, 
  FileText, 
  Activity, 
  Car, 
  ChevronRight,
  Sliders,
  BatteryCharging
} from 'lucide-react';
import { FleetVehicle, TelephonyLog } from '../types';
import { INITIAL_FLEET, INITIAL_TELEPHONY_LOGS } from '../data/mockData';

interface AdminConsoleViewProps {
  fleetVehicles: FleetVehicle[];
  onSelectFleetVehicle?: (veh: FleetVehicle) => void;
}

export const AdminConsoleView: React.FC<AdminConsoleViewProps> = ({
  fleetVehicles,
  onSelectFleetVehicle,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'in_progress' | 'completed' | 'telephony'>('all');
  const [surgeMultiplier, setSurgeMultiplier] = useState<number>(1.4);

  const mockTrips = [
    { id: 'VLX-8941', rider: 'Elena Vance', driver: 'Michael S.', route: 'Mayfair ➔ Heathrow T5', fare: 38.40, status: 'In-Progress', time: '15:22', proxy: '+44 7700 900482' },
    { id: 'VLX-8940', rider: 'James Thorne', driver: 'Sarah K.', route: 'Soho ➔ Canary Wharf', fare: 26.50, status: 'Completed', time: '14:55', proxy: '+44 7700 900214' },
    { id: 'VLX-8939', rider: 'Liam O’Connor', driver: 'David N.', route: 'King’s Cross ➔ Chelsea', fare: 21.00, status: 'Completed', time: '14:30', proxy: '+44 7700 900761' },
    { id: 'VLX-8938', rider: 'Chloe Bennett', driver: 'Hamid B.', route: 'Kensington ➔ City Airport', fare: 42.80, status: 'In-Progress', time: '14:15', proxy: '+44 7700 900119' },
    { id: 'VLX-8937', rider: 'Oliver Davis', driver: 'Priya R.', route: 'Battersea ➔ Shoreditch', fare: 19.50, status: 'Completed', time: '13:48', proxy: '+44 7700 900330' },
  ];

  const filteredTrips = mockTrips.filter((t) => {
    if (activeTab === 'in_progress' && t.status !== 'In-Progress') return false;
    if (activeTab === 'completed' && t.status !== 'Completed') return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.rider.toLowerCase().includes(q) ||
        t.driver.toLowerCase().includes(q) ||
        t.route.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden flex flex-col p-6 animate-in fade-in duration-200">
      
      {/* Top Console Title & Surge Control */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-slate-100 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">London Fleet Telemetry & Dispatch Control</h2>
              <p className="text-xs text-slate-500">Live operational oversight & privacy compliance</p>
            </div>
          </div>
        </div>

        {/* Dynamic Surge Controller */}
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Zone 1 Surge:</span>
          </div>
          <span className="font-mono text-sm font-extrabold text-blue-600">{surgeMultiplier.toFixed(1)}x</span>
          <input
            type="range"
            min="1.0"
            max="2.5"
            step="0.1"
            value={surgeMultiplier}
            onChange={(e) => setSurgeMultiplier(parseFloat(e.target.value))}
            className="w-24 accent-blue-600 cursor-pointer"
          />
        </div>
      </div>

      {/* 4 Primary Fleet KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-5">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Active Rides Now
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">48</span>
            <span className="text-[11px] font-semibold text-blue-600">+12% vs last hr</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">36 available for dispatch</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Today's Gross Volume
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">£18,490</span>
            <span className="text-[11px] font-semibold text-emerald-600">99.8% settled</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Stripe Connect auto-split active</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Completed Trips
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">418</span>
            <span className="text-[11px] font-semibold text-slate-600">98.9% 5-star</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Avg ride time: 19.4 mins</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Driver Availability
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">84 / 96</span>
            <span className="text-[11px] font-semibold text-emerald-600 font-mono">87.5%</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">Avg pickup ETA: 3.2 mins</p>
        </div>
      </div>

      {/* Tabs & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 pb-3">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Trips (5)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('in_progress')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'in_progress' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In-Progress (2)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'completed' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed (3)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('telephony')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'telephony' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Telephony Audit</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search trips, riders, drivers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* DATA VIEW: TELEPHONY AUDIT LOG TABLE */}
      {activeTab === 'telephony' ? (
        <div className="overflow-x-auto border border-slate-200 rounded-2xl mt-2">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Session ID</th>
                <th className="py-2.5 px-3">Trip Ref</th>
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Twilio Masked Proxy</th>
                <th className="py-2.5 px-3">Participants</th>
                <th className="py-2.5 px-3">Encryption & Privacy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {INITIAL_TELEPHONY_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{log.id}</td>
                  <td className="py-2.5 px-3 font-mono text-blue-600 font-semibold">{log.tripId}</td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono">{log.timestamp}</td>
                  <td className="py-2.5 px-3 uppercase text-[10px] font-bold text-slate-700">{log.type}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{log.virtualNumber}</td>
                  <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                    <div>{log.participantA}</div>
                    <div>{log.participantB}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                      <Lock className="w-2.5 h-2.5" />
                      {log.encryptionStatus} · Zero PII
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* STANDARD TRIP LOG TABLE */
        <div className="overflow-x-auto border border-slate-200 rounded-2xl mt-2">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Trip ID</th>
                <th className="py-2.5 px-3">Rider</th>
                <th className="py-2.5 px-3">Chauffeur</th>
                <th className="py-2.5 px-3">Route Journey</th>
                <th className="py-2.5 px-3">Fare (£)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Masked Telephony</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTrips.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{trip.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{trip.rider}</td>
                  <td className="py-2.5 px-3 text-slate-600">{trip.driver}</td>
                  <td className="py-2.5 px-3 text-slate-700">{trip.route}</td>
                  <td className="py-2.5 px-3 font-mono font-extrabold text-slate-900">£{trip.fare.toFixed(2)}</td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      trip.status === 'In-Progress'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {trip.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                    {trip.proxy}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bottom Fleet Vehicles Status Strip */}
      <div className="mt-5 pt-4 border-t border-slate-100">
        <h4 className="text-xs font-bold text-slate-700 mb-2.5">Active Fleet Vehicles On Duty (London Grid)</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {fleetVehicles.slice(0, 4).map((veh) => (
            <div
              key={veh.id}
              onClick={() => onSelectFleetVehicle && onSelectFleetVehicle(veh)}
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-900">{veh.driverName}</span>
                <span className={`text-[10px] font-semibold capitalize ${
                  veh.status === 'available' ? 'text-emerald-600' :
                  veh.status === 'on_trip' ? 'text-blue-600' : 'text-amber-600'
                }`}>
                  {veh.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                <span>{veh.vehicleModel}</span>
                <span className="font-mono text-slate-700">{veh.battery}% EV</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
