import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { GuestRecord, OCEAN_PARK_UNITS, ISLA_VERDE_UNITS, LOCKBOX_CODES, getLockboxCode } from "@/lib/guest-types";
import { Lock, User, CalendarClock } from "lucide-react";

const ROOM_STATUS_COLORS: Record<string, { bg: string; border: string; text: string; label: string; labelEs: string }> = {
  vacant: { bg: "rgba(74,222,128,0.12)", border: "rgba(74,222,128,0.25)", text: "text-green-300", label: "Vacant", labelEs: "Vacante" },
  occupied: { bg: "rgba(96,165,250,0.12)", border: "rgba(96,165,250,0.25)", text: "text-blue-300", label: "Occupied", labelEs: "Ocupada" },
  cleaning: { bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.25)", text: "text-amber-300", label: "Cleaning", labelEs: "Limpieza" },
  maintenance: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)", text: "text-red-300", label: "Maintenance", labelEs: "Mantenimiento" },
  checkout: { bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.25)", text: "text-purple-300", label: "Check-out", labelEs: "Check-out" },
  arriving: { bg: "rgba(56,189,248,0.12)", border: "rgba(56,189,248,0.25)", text: "text-cyan-300", label: "Arriving", labelEs: "Llegando" },
};

interface PropertyTabProps {
  guests: GuestRecord[];
  roomStatuses: Record<string, string>;
  onSetRoomStatus: (roomId: string, status: string) => void;
}

const todayISO = () => new Date().toISOString().split("T")[0];

export default function PropertyTab({ guests, roomStatuses, onSetRoomStatus }: PropertyTabProps) {
  const { t } = useLanguage();
  const [activeProperty, setActiveProperty] = useState<"Ocean Park" | "Isla Verde">("Ocean Park");

  const units = activeProperty === "Ocean Park" ? OCEAN_PARK_UNITS : ISLA_VERDE_UNITS;
  const prefix = activeProperty === "Ocean Park" ? "OP" : "IV";
  const today = todayISO();

  const guestByRoom = useMemo(() => {
    const map: Record<string, GuestRecord> = {};
    for (const g of guests) {
      if (g.property === activeProperty && g.roomNumber) {
        map[g.roomNumber] = g;
      }
    }
    return map;
  }, [guests, activeProperty]);

  const deriveRoomStatus = (roomNum: string, roomId: string): string => {
    const manualStatus = roomStatuses[roomId];
    if (manualStatus === "maintenance" || manualStatus === "cleaning") return manualStatus;

    const guest = guestByRoom[roomNum];
    if (!guest) return manualStatus || "vacant";

    if (guest.status === "checked-in") {
      if (guest.departureDate === today) return "checkout";
      return "occupied";
    }
    if (guest.status === "pre-arrival" && guest.arrivalDate === today) return "arriving";
    if (guest.status === "checked-out") return manualStatus || "vacant";

    return manualStatus || "vacant";
  };

  const roomData = useMemo(() => {
    return Array.from({ length: units }, (_, i) => {
      const roomNum = String(i + 1);
      const roomId = `${prefix}-${roomNum.padStart(2, "0")}`;
      const guest = guestByRoom[roomNum];
      const status = deriveRoomStatus(roomNum, roomId);
      const lockbox = getLockboxCode(activeProperty, roomNum);
      return { roomNum, roomId, guest, status, lockbox };
    });
  }, [units, prefix, guestByRoom, roomStatuses, today]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of roomData) {
      counts[r.status] = (counts[r.status] || 0) + 1;
    }
    return counts;
  }, [roomData]);

  const arrivingToday = useMemo(() =>
    guests.filter((g) => g.property === activeProperty && g.arrivalDate === today && (g.status === "pre-arrival" || g.status === "checked-in")),
    [guests, activeProperty, today]
  );

  const departingToday = useMemo(() =>
    guests.filter((g) => g.property === activeProperty && g.departureDate === today && g.status === "checked-in"),
    [guests, activeProperty, today]
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex gap-2 mb-5">
        {(["Ocean Park", "Isla Verde"] as const).map((prop) => (
          <button key={prop} onClick={() => setActiveProperty(prop)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${activeProperty === prop ? "bg-white/12 border-white/20 text-white" : "border-white/8 text-white/40 hover:text-white/60"}`}>
            {prop}
            <span className="text-[10px] ml-1.5 text-white/30">{prop === "Ocean Park" ? `${OCEAN_PARK_UNITS} units` : `${ISLA_VERDE_UNITS} units`}</span>
          </button>
        ))}
      </div>

      {(arrivingToday.length > 0 || departingToday.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {arrivingToday.length > 0 && (
            <div className="rounded-xl p-3 border border-cyan-400/20" style={{ background: "rgba(56,189,248,0.06)" }}>
              <p className="text-[10px] font-bold tracking-[2px] uppercase text-cyan-300 mb-2 flex items-center gap-1.5">
                <CalendarClock className="w-3 h-3" /> {t("Arriving Today", "Llegando Hoy")} ({arrivingToday.length})
              </p>
              <div className="space-y-1">
                {arrivingToday.map((g) => (
                  <div key={g.reservationNumber} className="flex items-center justify-between text-xs">
                    <span className="text-white/70">{g.name.split(" ")[0]}</span>
                    <span className="text-white/40 font-mono">
                      {g.roomNumber ? `${prefix}-${g.roomNumber}` : t("No room", "Sin hab.")}
                      {g.arrivalTime && ` ~${g.arrivalTime}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {departingToday.length > 0 && (
            <div className="rounded-xl p-3 border border-purple-400/20" style={{ background: "rgba(168,85,247,0.06)" }}>
              <p className="text-[10px] font-bold tracking-[2px] uppercase text-purple-300 mb-2 flex items-center gap-1.5">
                <CalendarClock className="w-3 h-3" /> {t("Departing Today", "Salidas Hoy")} ({departingToday.length})
              </p>
              <div className="space-y-1">
                {departingToday.map((g) => (
                  <div key={g.reservationNumber} className="flex items-center justify-between text-xs">
                    <span className="text-white/70">{g.name.split(" ")[0]}</span>
                    <span className="text-white/40 font-mono">{prefix}-{g.roomNumber}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mb-4 flex items-center gap-3 flex-wrap">
        {Object.entries(ROOM_STATUS_COLORS).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5 text-[10px]">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: val.bg, border: `1px solid ${val.border}` }} />
            <span className={val.text}>{t(val.label, val.labelEs)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
        {roomData.map((room) => {
          const colors = ROOM_STATUS_COLORS[room.status] || ROOM_STATUS_COLORS.vacant;
          return (
            <div key={room.roomId}
              className="rounded-xl p-3 border cursor-pointer transition-all hover:scale-[1.02] group relative"
              style={{ background: colors.bg, borderColor: colors.border }}
              onClick={() => {
                const manualStatuses = ["vacant", "cleaning", "maintenance"];
                const currentManual = roomStatuses[room.roomId] || "vacant";
                const idx = manualStatuses.indexOf(currentManual);
                const next = manualStatuses[(idx + 1) % manualStatuses.length];
                onSetRoomStatus(room.roomId, next);
              }}>
              <div className="flex items-center justify-between">
                <p className="font-mono text-sm text-white/80 font-bold">{room.roomId}</p>
                {room.lockbox && (
                  <div className="flex items-center gap-0.5">
                    <Lock className="w-2.5 h-2.5 text-white/25" />
                    <span className="text-[9px] font-mono text-white/35">{room.lockbox}</span>
                  </div>
                )}
              </div>
              <p className={`text-[9px] font-semibold tracking-wider uppercase mt-0.5 ${colors.text}`}>{t(colors.label, colors.labelEs)}</p>
              {room.guest && (room.guest.status === "checked-in" || (room.guest.status === "pre-arrival" && room.guest.arrivalDate === today)) && (
                <div className="mt-1.5 pt-1.5 border-t border-white/8">
                  <p className="text-[10px] text-white/50 truncate flex items-center gap-1">
                    <User className="w-2.5 h-2.5 shrink-0" />
                    {room.guest.name.split(" ")[0]}
                  </p>
                  {room.guest.departureDate && (
                    <p className="text-[9px] text-white/25 mt-0.5">{t("Out", "Sale")}: {room.guest.departureDate}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-white/8 p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
        <p className="text-white/30 text-[10px] font-semibold tracking-[2px] uppercase mb-3">{t("Property Summary", "Resumen de Propiedad")}</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {Object.entries(ROOM_STATUS_COLORS).map(([key, val]) => {
            const count = statusCounts[key] || 0;
            return (
              <div key={key} className="text-center">
                <p className={`text-2xl font-serif font-light ${val.text}`}>{count}</p>
                <p className="text-[10px] text-white/30">{t(val.label, val.labelEs)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
