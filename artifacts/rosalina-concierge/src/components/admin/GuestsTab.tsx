import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Trash2, Users, Edit3, Save, X, Key, StickyNote, Building2, Phone, Mail, ChevronDown, ChevronUp, Lock } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { GuestRecord, getGuests, saveGuests, updateGuest, PACKAGE_OPTIONS, BEACH_EXTRAS, getLockboxCode, LOCKBOX_CODES, SPECIAL_CODES, OCEAN_PARK_UNITS, ISLA_VERDE_UNITS } from "@/lib/guest-types";
import { GlassButton, GlassInput } from "./GlassUI";

interface GuestsTabProps {
  guests: GuestRecord[];
  onGuestsChange: (guests: GuestRecord[]) => void;
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function GuestsTab({ guests, onGuestsChange }: GuestsTabProps) {
  const { t } = useLanguage();
  const [editingGuest, setEditingGuest] = useState<string | null>(null);
  const [expandedGuest, setExpandedGuest] = useState<string | null>(null);

  const handleUpdateGuest = (resNum: string, updates: Partial<GuestRecord>) => {
    updateGuest(resNum, updates);
    onGuestsChange(getGuests());
  };

  const handleRoomAssignment = (guest: GuestRecord, roomNum: string) => {
    const lockbox = getLockboxCode(guest.property, roomNum);
    handleUpdateGuest(guest.reservationNumber, {
      roomNumber: roomNum,
      lockboxCode: lockbox,
    });
  };

  const handleDeleteGuest = (resNum: string) => {
    const updated = guests.filter((g) => g.reservationNumber.toUpperCase() !== resNum.toUpperCase());
    saveGuests(updated);
    onGuestsChange(updated);
    setEditingGuest(null);
  };

  const toGuestsCSV = () => {
    const hdr = "Name,Reservation,Property,Room,Phone,Email,Arrival,Departure,Guests,Additional Guests,Status,Lockbox,Staff Notes,Packages,Beach Extras,Registered\n";
    return hdr + guests.map((g) =>
      [g.name, g.reservationNumber, g.property, g.roomNumber || "", g.phone || "", g.email || "", g.arrivalDate, g.departureDate || "", g.numGuests, `"${g.additionalGuests || ""}"`, g.status || "pre-arrival", g.lockboxCode || "", `"${(g.staffNotes || "").replace(/"/g, '""')}"`, `"${(g.packages || []).join(", ")}"`, `"${(g.beachExtras || []).join(", ")}"`, new Date(g.createdAt).toLocaleString("en-US")].join(",")
    ).join("\n");
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const getRoomOptions = (property: string) => {
    const units = property === "Ocean Park" ? OCEAN_PARK_UNITS : ISLA_VERDE_UNITS;
    return Array.from({ length: units }, (_, i) => String(i + 1));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-wrap gap-2 mb-5">
        <GlassButton onClick={() => downloadCSV(toGuestsCSV(), `rosalina-guests-${new Date().toISOString().split("T")[0]}.csv`)} disabled={guests.length === 0}>
          <Download className="w-3.5 h-3.5" /> {t("Download Guest List", "Descargar Lista")}
        </GlassButton>
      </div>
      <div className="space-y-3">
        {guests.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-10 h-10 mx-auto mb-4 text-white/15" />
            <p className="font-serif text-2xl text-white/50 mb-2">{t("No guest accounts yet", "Sin cuentas de huesped aun")}</p>
          </div>
        ) : (
          [...guests].reverse().map((g) => {
            const isExpanded = expandedGuest === g.reservationNumber;
            const isEditing = editingGuest === g.reservationNumber;
            return (
              <motion.div key={g.reservationNumber} layout className="rounded-2xl border border-white/8 overflow-hidden"
                style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)" }}>
                <div className="p-4 cursor-pointer" onClick={() => setExpandedGuest(isExpanded ? null : g.reservationNumber)}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm text-white/90">{g.name}</p>
                        <span className={`text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-full ${
                          g.status === "checked-in" ? "bg-green-400/15 text-green-300" :
                          g.status === "checked-out" ? "bg-purple-400/15 text-purple-300" :
                          g.status === "no-show" ? "bg-red-400/15 text-red-300" :
                          "bg-blue-400/15 text-blue-300"
                        }`}>{t(g.status === "checked-in" ? "In-House" : g.status === "checked-out" ? "Departed" : g.status === "no-show" ? "No-Show" : "Pre-Arrival",
                          g.status === "checked-in" ? "Hospedado" : g.status === "checked-out" ? "Salido" : g.status === "no-show" ? "No-Show" : "Pre-Llegada")}</span>
                      </div>
                      <p className="text-xs text-white/35">#{g.reservationNumber} · {g.property}{g.roomNumber ? ` · Room ${g.roomNumber}` : ""}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-white/25 font-mono">{fmtDate(g.createdAt)}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-[11px] text-white/40">
                    {g.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{g.phone}</span>}
                    {g.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{g.email}</span>}
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-4 pb-4 pt-0 border-t border-white/8">
                        <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                          <div><span className="text-white/35">Arrival: </span><span className="text-white/70">{g.arrivalDate}{g.arrivalTime ? " ~" + g.arrivalTime : ""}</span></div>
                          <div><span className="text-white/35">Departure: </span><span className="text-white/70">{g.departureDate || "TBD"}</span></div>
                          <div><span className="text-white/35">Guests: </span><span className="text-white/70">{g.numGuests}</span></div>
                          <div><span className="text-white/35">Contact: </span><span className="text-white/70">{g.preferredContact}</span></div>
                          {g.additionalGuests && <div className="col-span-2"><span className="text-white/35">Additional: </span><span className="text-white/70">{g.additionalGuests}</span></div>}
                          {g.earlyCheckin && <div className="text-blue-300 font-medium">Early check-in</div>}
                          {g.luggageStorage && <div style={{ color: "hsl(38 72% 65%)" }} className="font-medium">Luggage storage</div>}
                          {(g.packages || []).length > 0 && <div className="col-span-2"><span className="text-white/35">Packages: </span><span className="text-white/70">{(g.packages || []).map((id) => PACKAGE_OPTIONS.find((p) => p.id === id)?.en || id).join(", ")}</span></div>}
                          {(g.beachExtras || []).length > 0 && <div className="col-span-2"><span className="text-white/35">Beach: </span><span className="text-white/70">{(g.beachExtras || []).map((id) => BEACH_EXTRAS.find((e) => e.id === id)?.en || id).join(", ")}</span></div>}
                          {g.specialRequests && <div className="col-span-2 pt-1 border-t border-white/8 mt-1"><span className="text-white/35">Guest Notes: </span><span className="text-white/50">{g.specialRequests}</span></div>}
                        </div>

                        <div className="mt-3 pt-3 border-t border-white/8 flex items-center justify-between text-[10px]">
                          <span className="text-white/25">Login: <span className="font-mono text-white/50">{g.reservationNumber}</span></span>
                          <span className="text-white/25">Pass: <span className="font-mono text-white/50">{g.password}</span></span>
                        </div>

                        <div className="mt-3 pt-3 border-t border-white/8 space-y-3">
                          <div className="flex items-center justify-between">
                            <p className="text-white/30 text-[10px] tracking-wider uppercase font-semibold">{t("Staff Controls", "Controles del Staff")}</p>
                            <button onClick={(e) => { e.stopPropagation(); setEditingGuest(isEditing ? null : g.reservationNumber); }}
                              className="flex items-center gap-1 text-[10px] text-white/40 hover:text-white/70 transition-colors">
                              {isEditing ? <X className="w-3 h-3" /> : <Edit3 className="w-3 h-3" />}
                              {isEditing ? t("Cancel", "Cancelar") : t("Edit", "Editar")}
                            </button>
                          </div>

                          {isEditing ? (
                            <div className="space-y-2.5">
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <p className="text-[10px] text-white/30 mb-1">{t("Room #", "Habitacion")}</p>
                                  <select
                                    value={g.roomNumber || ""}
                                    onChange={(e) => handleRoomAssignment(g, e.target.value)}
                                    className="w-full bg-white/8 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 appearance-none"
                                  >
                                    <option value="" className="bg-[#0B1730] text-white/60">{t("Select room", "Seleccionar")}</option>
                                    {getRoomOptions(g.property).map((num) => (
                                      <option key={num} value={num} className="bg-[#0B1730] text-white">
                                        {g.property === "Ocean Park" ? "OP" : "IV"}-{num} (Code: {getLockboxCode(g.property, num)})
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <p className="text-[10px] text-white/30 mb-1 flex items-center gap-1">
                                    <Lock className="w-2.5 h-2.5" />
                                    {t("Lockbox Code", "Codigo Candado")}
                                  </p>
                                  <GlassInput
                                    value={g.lockboxCode || ""}
                                    onChange={(v) => handleUpdateGuest(g.reservationNumber, { lockboxCode: v })}
                                    placeholder={g.roomNumber ? getLockboxCode(g.property, g.roomNumber) || "---" : "---"}
                                  />
                                  {g.lockboxCode && (
                                    <p className="text-[9px] text-green-400/60 mt-0.5">Auto-assigned</p>
                                  )}
                                </div>
                              </div>

                              {g.property && SPECIAL_CODES[g.property] && (
                                <div className="mt-1">
                                  <p className="text-[9px] text-white/20 mb-1">{t("Other codes", "Otros codigos")} ({g.property}):</p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {Object.entries(SPECIAL_CODES[g.property]).map(([label, code]) => (
                                      <span key={label} className="text-[9px] font-mono bg-white/5 border border-white/10 rounded px-1.5 py-0.5 text-white/40">
                                        {label}: {code}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div>
                                <p className="text-[10px] text-white/30 mb-1">{t("Status", "Estado")}</p>
                                <div className="flex gap-1.5 flex-wrap">
                                  {(["pre-arrival", "checked-in", "checked-out", "no-show"] as const).map((s) => (
                                    <button key={s} onClick={() => handleUpdateGuest(g.reservationNumber, { status: s })}
                                      className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all ${g.status === s ? "bg-white/12 border-white/20 text-white" : "border-white/8 text-white/35 hover:text-white/60"}`}>
                                      {s}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <p className="text-[10px] text-white/30 mb-1"><StickyNote className="w-3 h-3 inline mr-1" />{t("Staff Notes (internal)", "Notas del Staff (internas)")}</p>
                                <textarea value={g.staffNotes || ""} onChange={(e) => handleUpdateGuest(g.reservationNumber, { staffNotes: e.target.value })}
                                  className="bg-white/8 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 w-full min-h-[60px] resize-none"
                                  placeholder={t("Add internal notes about this guest...", "Agregar notas internas sobre este huesped...")} />
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => setEditingGuest(null)}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/15 border border-green-400/20 text-green-300 hover:bg-green-500/25 transition-all">
                                  <Save className="w-3 h-3" /> {t("Done", "Listo")}
                                </button>
                                <button onClick={() => { if (window.confirm(t("Remove this guest?", "Eliminar este huesped?"))) handleDeleteGuest(g.reservationNumber); }}
                                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 border border-red-400/20 text-red-300 hover:bg-red-500/20 transition-all">
                                  <Trash2 className="w-3 h-3" /> {t("Remove Guest", "Eliminar Huesped")}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1.5 text-xs">
                              {g.roomNumber && <div className="flex items-center gap-2"><Building2 className="w-3 h-3 text-white/25" /><span className="text-white/50">Room: <span className="text-white/70 font-mono">{g.property === "Ocean Park" ? "OP" : "IV"}-{g.roomNumber}</span></span></div>}
                              {g.lockboxCode && <div className="flex items-center gap-2"><Key className="w-3 h-3 text-white/25" /><span className="text-white/50">Lockbox: <span className="text-white/70 font-mono">{g.lockboxCode}</span></span></div>}
                              {g.staffNotes && <div className="flex items-start gap-2"><StickyNote className="w-3 h-3 text-white/25 mt-0.5 shrink-0" /><span className="text-white/50">{g.staffNotes}</span></div>}
                              {!g.roomNumber && !g.lockboxCode && !g.staffNotes && <p className="text-white/25 italic">{t("No staff notes yet", "Sin notas del staff aun")}</p>}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
