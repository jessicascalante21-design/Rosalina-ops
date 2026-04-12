import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/language-context";
import { GuestRecord, OCEAN_PARK_UNITS, ISLA_VERDE_UNITS } from "@/lib/guest-types";

const ROOM_STATUS_COLORS: Record<string, { bg: string; border: string; text: string; label: string; labelEs: string }> = {
  vacant: { bg: "rgba(74,222,128,0.12)", border: "rgba(74,222,128,0.25)", text: "text-green-300", label: "Vacant", labelEs: "Vacante" },
  occupied: { bg: "rgba(96,165,250,0.12)", border: "rgba(96,165,250,0.25)", text: "text-blue-300", label: "Occupied", labelEs: "Ocupada" },
  cleaning: { bg: "rgba(251,191,36,0.12)", border: "rgba(251,191,36,0.25)", text: "text-amber-300", label: "Cleaning", labelEs: "Limpieza" },
  maintenance: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)", text: "text-red-300", label: "Maintenance", labelEs: "Mantenimiento" },
  checkout: { bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.25)", text: "text-purple-300", label: "Check-out", labelEs: "Check-out" },
};

interface PropertyTabProps {
  guests: GuestRecord[];
  roomStatuses: Record<string, string>;
  onSetRoomStatus: (roomId: string, status: string) => void;
}

export default function PropertyTab({ guests, roomStatuses, onSetRoomStatus }: PropertyTabProps) {
  const { t } = useLanguage();
  const [activeProperty, setActiveProperty] = useState<"Ocean Park" | "Isla Verde">("Ocean Park");

  const units = activeProperty === "Ocean Park" ? OCEAN_PARK_UNITS : ISLA_VERDE_UNITS;
  const prefix = activeProperty === "Ocean Park" ? "OP" : "IV";

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

      <div className="mb-4 flex items-center gap-3 flex-wrap">
        {Object.entries(ROOM_STATUS_COLORS).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5 text-[10px]">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ background: val.bg, border: `1px solid ${val.border}` }} />
            <span className={val.text}>{t(val.label, val.labelEs)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2.5">
        {Array.from({ length: units }, (_, i) => {
          const roomId = `${prefix}-${String(i + 1).padStart(2, "0")}`;
          const status = roomStatuses[roomId] || "vacant";
          const colors = ROOM_STATUS_COLORS[status] || ROOM_STATUS_COLORS.vacant;
          const assignedGuest = guests.find((g) => g.roomNumber === roomId && g.status === "checked-in");
          return (
            <div key={roomId} className="rounded-xl p-3 border cursor-pointer transition-all hover:scale-[1.02] group relative"
              style={{ background: colors.bg, borderColor: colors.border }}
              onClick={() => {
                const statuses = Object.keys(ROOM_STATUS_COLORS);
                const nextIdx = (statuses.indexOf(status) + 1) % statuses.length;
                onSetRoomStatus(roomId, statuses[nextIdx]);
              }}>
              <p className="font-mono text-sm text-white/80 font-bold">{roomId}</p>
              <p className={`text-[9px] font-semibold tracking-wider uppercase mt-0.5 ${colors.text}`}>{t(colors.label, colors.labelEs)}</p>
              {assignedGuest && (
                <p className="text-[10px] text-white/50 mt-1 truncate">{assignedGuest.name.split(" ")[0]}</p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-white/8 p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
        <p className="text-white/30 text-[10px] font-semibold tracking-[2px] uppercase mb-3">{t("Property Summary", "Resumen de Propiedad")}</p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(ROOM_STATUS_COLORS).map(([key, val]) => {
            const count = Array.from({ length: units }, (_, i) => {
              const roomId = `${prefix}-${String(i + 1).padStart(2, "0")}`;
              return (roomStatuses[roomId] || "vacant") === key ? 1 : 0;
            }).reduce((a, b) => a + b, 0);
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
