import React, { useState } from 'react';
import { Calendar, Clock, Plane, CheckCircle, ChevronRight, X } from 'lucide-react';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSchedule: (details: { date: string; time: string; flightNo?: string }) => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onConfirmSchedule,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('Tomorrow, Oct 10');
  const [selectedTime, setSelectedTime] = useState<string>('07:30 AM');
  const [flightNo, setFlightNo] = useState<string>('BA 0482');
  const [isScheduled, setIsScheduled] = useState<boolean>(false);

  if (!isOpen) return null;

  const dates = [
    'Today, Oct 9',
    'Tomorrow, Oct 10',
    'Saturday, Oct 11',
    'Sunday, Oct 12',
  ];

  const times = [
    '05:00 AM',
    '06:30 AM',
    '07:30 AM',
    '08:45 AM',
    '10:15 AM',
    '01:30 PM',
    '05:00 PM',
  ];

  const handleConfirm = () => {
    setIsScheduled(true);
    setTimeout(() => {
      onConfirmSchedule({ date: selectedDate, time: selectedTime, flightNo });
      setIsScheduled(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden p-6">
        
        {isScheduled ? (
          <div className="py-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Ride Scheduled!</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Your chauffeur will be dispatched for {selectedDate} at {selectedTime}. Free cancellation up to 60 mins before.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Schedule in Advance</h3>
                  <p className="text-xs text-slate-500">Guaranteed chauffeur reservation</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-xs transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Date Selector */}
            <div className="mt-4">
              <label className="text-xs font-bold text-slate-700 block mb-2">Select Date</label>
              <div className="grid grid-cols-2 gap-2">
                {dates.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDate(d)}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border text-left transition-all ${
                      selectedDate === d
                        ? 'bg-blue-50 border-blue-600 text-blue-700'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selector */}
            <div className="mt-4">
              <label className="text-xs font-bold text-slate-700 block mb-2">Pickup Time</label>
              <div className="flex flex-wrap gap-1.5">
                {times.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTime(t)}
                    className={`py-1.5 px-3 text-xs font-semibold rounded-xl border transition-all ${
                      selectedTime === t
                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Flight Tracking Option */}
            <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Plane className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">Flight Number (Optional Buffer)</span>
              </div>
              <input
                type="text"
                value={flightNo}
                onChange={(e) => setFlightNo(e.target.value)}
                placeholder="e.g. BA 0482 or VS 019"
                className="w-full px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-[10px] text-slate-500 mt-1.5">
                We track landing delays automatically and adjust chauffeur arrival at no extra cost.
              </p>
            </div>

            {/* Confirm CTA */}
            <div className="mt-6">
              <button
                type="button"
                onClick={handleConfirm}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Clock className="w-4 h-4" />
                <span>Confirm Reservation for {selectedTime}</span>
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
