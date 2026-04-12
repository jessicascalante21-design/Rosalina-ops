import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarClock, Lock, Phone, Mail, User, ChevronDown, ChevronUp, MessageSquare, Send, Save, CheckCircle, Clock, Luggage, Gift, UmbrellaIcon } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { GuestRecord, updateGuest, getGuests, getLockboxCode, LOCKBOX_CODES, OCEAN_PARK_UNITS, ISLA_VERDE_UNITS, PACKAGE_OPTIONS, BEACH_EXTRAS } from "@/lib/guest-types";

interface TodayArrivalsProps {
  guests: GuestRecord[];
  onGuestsChange: (guests: GuestRecord[]) => void;
}

const todayISO = () => new Date().toISOString().split("T")[0];

export default function TodayArrivals({ guests, onGuestsChange }: TodayArrivalsProps) {
  const { t } = useLanguage();
  const [expandedGuest, setExpandedGuest] = useState<string | null>(null);
  const [codeSent, setCodeSent] = useState<{ resNum: string; via: "sms" | "wa" } | null>(null);
  const today = todayISO();

  const arrivingToday = guests.filter(
    (g) => g.arrivalDate === today && (g.status === "pre-arrival" || g.status === "checked-in")
  );

  const departingToday = guests.filter(
    (g) => g.departureDate === today && g.status === "checked-in"
  );

  const getRoomOptions = (property: string) => {
    const units = property === "Ocean Park" ? OCEAN_PARK_UNITS : ISLA_VERDE_UNITS;
    const assignedRooms = guests
      .filter((g) => g.property === property && g.roomNumber && g.status !== "checked-out" && g.status !== "no-show")
      .map((g) => g.roomNumber);
    return Array.from({ length: units }, (_, i) => {
      const num = String(i + 1);
      const taken = assignedRooms.includes(num);
      return { num, taken, lockbox: getLockboxCode(property, num) };
    });
  };

  const handleRoomAssign = (guest: GuestRecord, roomNum: string) => {
    const lockbox = getLockboxCode(guest.property, roomNum);
    updateGuest(guest.reservationNumber, {
      roomNumber: roomNum,
      lockboxCode: lockbox,
      status: "checked-in",
    });
    onGuestsChange(getGuests());
  };

  const handleCheckIn = (guest: GuestRecord) => {
    updateGuest(guest.reservationNumber, { status: "checked-in" });
    onGuestsChange(getGuests());
  };

  const handleCheckOut = (guest: GuestRecord) => {
    updateGuest(guest.reservationNumber, { status: "checked-out" });
    onGuestsChange(getGuests());
  };

  const buildSmsMessage = (g: GuestRecord) => {
    const firstName = g.name.split(" ")[0];
    const prefix = g.property === "Ocean Park" ? "OP" : "IV";
    const roomLabel = g.roomNumber ? `${prefix}-${g.roomNumber}` : "";
    const doorCode = g.property === "Isla Verde" && parseInt(g.roomNumber) >= 1 && parseInt(g.roomNumber) <= 4
      ? "\nDoor access code: 2323#" : "";
    return [
      `Hello ${firstName}! Welcome to Rosalina Boutique Hotels.`,
      ``,
      `Your room for today is ${roomLabel} and your lockbox code is ${g.lockboxCode}.${doorCode}`,
      ``,
      `Please make sure you read the check-in instructions in your confirmation email. If you need any assistance, give us a call at 787-304-3335 or message us on WhatsApp at +1 (939) 793-8989.`,
      ``,
      `We look forward to hosting you!`,
      `— Rosalina Concierge Team`,
    ].join("\n");
  };

  const handleSendSms = (g: GuestRecord) => {
    if (!g.phone || !g.roomNumber || !g.lockboxCode) return;
    const phone = g.phone.replace(/\D/g, "");
    window.open(`sms:${phone}?body=${encodeURIComponent(buildSmsMessage(g))}`, "_self");
    setCodeSent({ resNum: g.reservationNumber, via: "sms" });
    setTimeout(() => setCodeSent(null), 4000);
  };

  const handleSendWhatsApp = (g: GuestRecord) => {
    if (!g.phone || !g.roomNumber || !g.lockboxCode) return;
    const phone = g.phone.replace(/\D/g, "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(buildSmsMessage(g))}`, "_blank");
    setCodeSent({ resNum: g.reservationNumber, via: "wa" });
    setTimeout(() => setCodeSent(null), 4000);
  };

  if (arrivingToday.length === 0 && departingToday.length === 0) return null;

  return (
    <div className="space-y-4 mb-6">
      {arrivingToday.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CalendarClock className="w-4 h-4 text-cyan-300" />
            <p className="text-[10px] font-bold tracking-[2px] uppercase text-cyan-300">
              {t("Today's Check-ins", "Check-ins de Hoy")} ({arrivingToday.length})
            </p>
          </div>
          <div className="space-y-2">
            {arrivingToday.map((g) => {
              const isExpanded = expandedGuest === g.reservationNumber;
              const prefix = g.property === "Ocean Park" ? "OP" : "IV";
              const roomOptions = getRoomOptions(g.property);
              const canSendCode = g.phone && g.roomNumber && g.lockboxCode;
              const selectedPkgs = (g.packages || []).map((id) => PACKAGE_OPTIONS.find((p) => p.id === id)).filter(Boolean);
              const selectedExtras = (g.beachExtras || []).map((id) => BEACH_EXTRAS.find((e) => e.id === id)).filter(Boolean);

              return (
                <motion.div key={g.reservationNumber} layout
                  className="rounded-2xl border border-cyan-400/15 overflow-hidden"
                  style={{ background: "rgba(56,189,248,0.04)", backdropFilter: "blur(12px)" }}>
                  <div className="p-4 cursor-pointer" onClick={() => setExpandedGuest(isExpanded ? null : g.reservationNumber)}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-semibold text-sm text-white/90">{g.name}</p>
                          <span className={`text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-full ${
                            g.status === "checked-in" ? "bg-green-400/15 text-green-300" : "bg-cyan-400/15 text-cyan-300"
                          }`}>{g.status === "checked-in" ? t("Checked In", "Hospedado") : t("Arriving", "Llegando")}</span>
                          {g.roomNumber && (
                            <span className="text-[9px] font-mono bg-white/8 px-1.5 py-0.5 rounded text-white/60">
                              {prefix}-{g.roomNumber}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/35">
                          #{g.reservationNumber} · {g.property}
                          {g.arrivalTime && ` · ~${g.arrivalTime}`}
                          {g.numGuests && ` · ${g.numGuests} ${t("guests", "huespedes")}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {g.roomNumber && g.lockboxCode && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/6 border border-white/10">
                            <Lock className="w-3 h-3 text-white/30" />
                            <span className="text-xs font-mono font-bold text-white/60">{g.lockboxCode}</span>
                          </div>
                        )}
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-4 pb-4 pt-0 border-t border-white/8 space-y-3">
                          {(g.earlyCheckin || g.luggageStorage || selectedPkgs.length > 0 || selectedExtras.length > 0 || g.specialRequests) && (
                            <div className="mt-3 space-y-2">
                              <p className="text-white/30 text-[10px] tracking-wider uppercase font-semibold">{t("Pre-Arrival Info", "Info Pre-Llegada")}</p>
                              <div className="flex flex-wrap gap-1.5">
                                {g.earlyCheckin && (
                                  <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-blue-400/10 border border-blue-400/15 text-blue-300">
                                    <Clock className="w-2.5 h-2.5" /> {t("Early Check-in", "Check-in Temprano")}
                                  </span>
                                )}
                                {g.luggageStorage && (
                                  <span className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-amber-400/10 border border-amber-400/15 text-amber-300">
                                    <Luggage className="w-2.5 h-2.5" /> {t("Luggage Storage", "Almacenar Maletas")}
                                  </span>
                                )}
                                {selectedPkgs.map((pkg) => pkg && (
                                  <span key={pkg.id} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-purple-400/10 border border-purple-400/15 text-purple-300">
                                    <Gift className="w-2.5 h-2.5" /> {t(pkg.en, pkg.es)} <span className="text-white/30">{pkg.price}</span>
                                  </span>
                                ))}
                                {selectedExtras.map((ext) => ext && (
                                  <span key={ext.id} className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-full bg-amber-400/10 border border-amber-400/15 text-amber-300">
                                    <UmbrellaIcon className="w-2.5 h-2.5" /> {t(ext.en, ext.es)} <span className="text-white/30">{ext.price}</span>
                                  </span>
                                ))}
                              </div>
                              {g.specialRequests && (
                                <p className="text-xs text-white/40 italic bg-white/4 rounded-lg p-2">"{g.specialRequests}"</p>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-3 text-[11px] text-white/40">
                            {g.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{g.phone}</span>}
                            {g.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{g.email}</span>}
                          </div>

                          <div className="mt-2">
                            <p className="text-white/30 text-[10px] tracking-wider uppercase font-semibold mb-2">{t("Assign Room", "Asignar Habitacion")}</p>
                            <select
                              value={g.roomNumber || ""}
                              onChange={(e) => {
                                if (e.target.value) handleRoomAssign(g, e.target.value);
                              }}
                              className="w-full bg-white/8 border border-white/15 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400/30"
                            >
                              <option value="" className="bg-[#0B1730]">{t("Select room...", "Seleccionar habitacion...")}</option>
                              {roomOptions.map((room) => (
                                <option
                                  key={room.num}
                                  value={room.num}
                                  disabled={room.taken && g.roomNumber !== room.num}
                                  className="bg-[#0B1730]"
                                >
                                  {prefix}-{room.num} — {t("Code", "Codigo")}: {room.lockbox}
                                  {room.taken && g.roomNumber !== room.num ? ` (${t("occupied", "ocupada")})` : ""}
                                </option>
                              ))}
                            </select>
                          </div>

                          {g.roomNumber && g.lockboxCode && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-400/15">
                              <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                              <p className="text-xs text-green-300">
                                {t("Room", "Hab.")} {prefix}-{g.roomNumber} · {t("Code", "Codigo")}: <span className="font-mono font-bold">{g.lockboxCode}</span>
                                {g.property === "Isla Verde" && parseInt(g.roomNumber) >= 1 && parseInt(g.roomNumber) <= 4 && (
                                  <span className="ml-2 text-green-400/60">| Door: 2323#</span>
                                )}
                              </p>
                            </div>
                          )}

                          {canSendCode && (
                            <div>
                              <p className="text-white/30 text-[10px] tracking-wider uppercase font-semibold mb-2">{t("Send Check-in Code", "Enviar Codigo de Check-in")}</p>
                              <div className="flex gap-2 flex-wrap">
                                <button onClick={(e) => { e.stopPropagation(); handleSendSms(g); }}
                                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-medium border transition-all ${
                                    codeSent?.resNum === g.reservationNumber && codeSent.via === "sms"
                                      ? "bg-green-500/15 border-green-400/20 text-green-300"
                                      : "bg-blue-500/10 border-blue-400/20 text-blue-300 hover:bg-blue-500/20"
                                  }`}>
                                  {codeSent?.resNum === g.reservationNumber && codeSent.via === "sms"
                                    ? <><Save className="w-3 h-3" /> {t("SMS opened", "SMS abierto")}</>
                                    : <><MessageSquare className="w-3 h-3" /> {t("Send via SMS", "Enviar por SMS")}</>}
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleSendWhatsApp(g); }}
                                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-medium border transition-all ${
                                    codeSent?.resNum === g.reservationNumber && codeSent.via === "wa"
                                      ? "bg-green-500/15 border-green-400/20 text-green-300"
                                      : "bg-green-500/10 border-green-400/20 text-green-300 hover:bg-green-500/20"
                                  }`}>
                                  {codeSent?.resNum === g.reservationNumber && codeSent.via === "wa"
                                    ? <><Save className="w-3 h-3" /> {t("WhatsApp opened", "WhatsApp abierto")}</>
                                    : <><Send className="w-3 h-3" /> {t("Send via WhatsApp", "Enviar por WhatsApp")}</>}
                                </button>
                              </div>
                            </div>
                          )}

                          {!g.roomNumber && g.phone && (
                            <p className="text-[10px] text-amber-400/60 italic">
                              {t("Assign a room above to enable sending the check-in code.", "Asigne una habitacion arriba para enviar el codigo de check-in.")}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {departingToday.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CalendarClock className="w-4 h-4 text-purple-300" />
            <p className="text-[10px] font-bold tracking-[2px] uppercase text-purple-300">
              {t("Today's Check-outs", "Check-outs de Hoy")} ({departingToday.length})
            </p>
          </div>
          <div className="space-y-2">
            {departingToday.map((g) => {
              const prefix = g.property === "Ocean Park" ? "OP" : "IV";
              return (
                <div key={g.reservationNumber}
                  className="rounded-xl p-3 border border-purple-400/15 flex items-center justify-between"
                  style={{ background: "rgba(168,85,247,0.04)" }}>
                  <div>
                    <p className="text-sm text-white/80 font-medium">{g.name}</p>
                    <p className="text-[11px] text-white/35">{prefix}-{g.roomNumber} · #{g.reservationNumber}</p>
                  </div>
                  <button onClick={() => handleCheckOut(g)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium border border-purple-400/20 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition-all">
                    <CheckCircle className="w-3 h-3" /> {t("Check Out", "Check Out")}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
