import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Trash2, Users, Edit3, Save, X, Key, StickyNote, Building2, Phone, Mail, ChevronDown, ChevronUp, Lock, UserPlus, MessageSquare, Send } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { GuestRecord, getGuests, saveGuests, updateGuest, generatePassword, PACKAGE_OPTIONS, BEACH_EXTRAS, getLockboxCode, LOCKBOX_CODES, SPECIAL_CODES, OCEAN_PARK_UNITS, ISLA_VERDE_UNITS } from "@/lib/guest-types";
import { GlassButton, GlassInput } from "./GlassUI";

interface GuestsTabProps {
  guests: GuestRecord[];
  onGuestsChange: (guests: GuestRecord[]) => void;
}

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const todayISO = () => new Date().toISOString().split("T")[0];

export default function GuestsTab({ guests, onGuestsChange }: GuestsTabProps) {
  const { t } = useLanguage();
  const [editingGuest, setEditingGuest] = useState<string | null>(null);
  const [expandedGuest, setExpandedGuest] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [codeSent, setCodeSent] = useState<{ resNum: string; via: "sms" | "wa" } | null>(null);

  const [newName, setNewName] = useState("");
  const [newReservation, setNewReservation] = useState("");
  const [newProperty, setNewProperty] = useState("Ocean Park");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newArrival, setNewArrival] = useState(todayISO());
  const [newArrivalTime, setNewArrivalTime] = useState("");
  const [newDeparture, setNewDeparture] = useState("");
  const [newGuests, setNewGuests] = useState("2");
  const [newRoom, setNewRoom] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const resetAddForm = () => {
    setNewName(""); setNewReservation(""); setNewProperty("Ocean Park");
    setNewPhone(""); setNewEmail(""); setNewArrival(todayISO());
    setNewArrivalTime(""); setNewDeparture(""); setNewGuests("2");
    setNewRoom(""); setNewNotes("");
    setShowAddForm(false);
  };

  const handleAddGuest = () => {
    if (!newName.trim() || !newReservation.trim()) return;
    const password = generatePassword(newName, newReservation);
    const lockbox = newRoom ? getLockboxCode(newProperty, newRoom) : "";
    const record: GuestRecord = {
      name: newName.trim(),
      reservationNumber: newReservation.trim().toUpperCase(),
      property: newProperty,
      arrivalDate: newArrival,
      arrivalTime: newArrivalTime,
      departureDate: newDeparture,
      numGuests: newGuests,
      earlyCheckin: false,
      luggageStorage: false,
      carStatus: "",
      preferredContact: newPhone ? "whatsapp" : "email",
      specialRequests: "",
      createdAt: new Date().toISOString(),
      password,
      phone: newPhone,
      email: newEmail,
      additionalGuests: "",
      roomNumber: newRoom,
      lockboxCode: lockbox,
      staffNotes: newNotes,
      status: "pre-arrival",
      packages: [],
      beachExtras: [],
    };
    const current = getGuests();
    const exists = current.some((g) => g.reservationNumber.toUpperCase() === record.reservationNumber);
    if (exists) {
      alert(t("A guest with this reservation number already exists.", "Ya existe un huesped con este numero de reservacion."));
      return;
    }
    saveGuests([...current, record]);
    onGuestsChange(getGuests());
    resetAddForm();
    setExpandedGuest(record.reservationNumber);
  };

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
    const msg = buildSmsMessage(g);
    window.open(`sms:${phone}?body=${encodeURIComponent(msg)}`, "_self");
    setCodeSent({ resNum: g.reservationNumber, via: "sms" });
    setTimeout(() => setCodeSent(null), 4000);
  };

  const handleSendWhatsApp = (g: GuestRecord) => {
    if (!g.phone || !g.roomNumber || !g.lockboxCode) return;
    const phone = g.phone.replace(/\D/g, "");
    const msg = buildSmsMessage(g);
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
    setCodeSent({ resNum: g.reservationNumber, via: "wa" });
    setTimeout(() => setCodeSent(null), 4000);
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
        <GlassButton onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? <X className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
          {showAddForm ? t("Cancel", "Cancelar") : t("Add Reservation", "Agregar Reservacion")}
        </GlassButton>
        <GlassButton onClick={() => downloadCSV(toGuestsCSV(), `rosalina-guests-${new Date().toISOString().split("T")[0]}.csv`)} disabled={guests.length === 0}>
          <Download className="w-3.5 h-3.5" /> {t("Download Guest List", "Descargar Lista")}
        </GlassButton>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-5">
            <div className="rounded-2xl border border-white/12 p-5" style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(16px)" }}>
              <div className="flex items-center gap-2 mb-4">
                <UserPlus className="w-4 h-4 text-white/50" />
                <p className="text-sm font-semibold text-white/80">{t("Manual Reservation", "Reservacion Manual")}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-white/30 mb-1">{t("Guest Name *", "Nombre del Huesped *")}</p>
                  <GlassInput value={newName} onChange={setNewName} placeholder="John Smith" />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 mb-1">{t("Reservation # *", "# Reservacion *")}</p>
                  <GlassInput value={newReservation} onChange={setNewReservation} placeholder="RES-12345" />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 mb-1">{t("Phone", "Telefono")}</p>
                  <GlassInput value={newPhone} onChange={setNewPhone} placeholder="+1 787-555-1234" />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 mb-1">{t("Email", "Email")}</p>
                  <GlassInput value={newEmail} onChange={setNewEmail} placeholder="guest@email.com" />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 mb-1">{t("Property", "Propiedad")}</p>
                  <select value={newProperty} onChange={(e) => { setNewProperty(e.target.value); setNewRoom(""); }}
                    className="w-full bg-white/8 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20">
                    <option value="Ocean Park" className="bg-[#0B1730]">Ocean Park</option>
                    <option value="Isla Verde" className="bg-[#0B1730]">Isla Verde</option>
                  </select>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 mb-1">{t("Room #", "Habitacion #")}</p>
                  <select value={newRoom} onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full bg-white/8 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20">
                    <option value="" className="bg-[#0B1730] text-white/60">{t("Assign later", "Asignar despues")}</option>
                    {getRoomOptions(newProperty).map((num) => (
                      <option key={num} value={num} className="bg-[#0B1730]">
                        {newProperty === "Ocean Park" ? "OP" : "IV"}-{num} (Code: {getLockboxCode(newProperty, num)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="text-[10px] text-white/30 mb-1">{t("Arrival Date", "Fecha Llegada")}</p>
                  <input type="date" value={newArrival} onChange={(e) => setNewArrival(e.target.value)}
                    className="w-full bg-white/8 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20" />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 mb-1">{t("Arrival Time", "Hora Llegada")}</p>
                  <GlassInput value={newArrivalTime} onChange={setNewArrivalTime} placeholder="3:00 PM" />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 mb-1">{t("Departure Date", "Fecha Salida")}</p>
                  <input type="date" value={newDeparture} onChange={(e) => setNewDeparture(e.target.value)}
                    className="w-full bg-white/8 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20" />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 mb-1">{t("# Guests", "# Huespedes")}</p>
                  <select value={newGuests} onChange={(e) => setNewGuests(e.target.value)}
                    className="w-full bg-white/8 border border-white/15 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20">
                    {[1,2,3,4,5,6,7,8].map((n) => <option key={n} value={String(n)} className="bg-[#0B1730]">{n}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-[10px] text-white/30 mb-1">{t("Staff Notes", "Notas del Staff")}</p>
                  <textarea value={newNotes} onChange={(e) => setNewNotes(e.target.value)}
                    className="bg-white/8 border border-white/15 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-white/20 w-full min-h-[50px] resize-none"
                    placeholder={t("Optional notes...", "Notas opcionales...")} />
                </div>
              </div>

              {newRoom && (
                <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-400/15">
                  <Lock className="w-3.5 h-3.5 text-green-400" />
                  <p className="text-xs text-green-300">
                    {t("Lockbox code", "Codigo candado")}: <span className="font-mono font-bold">{getLockboxCode(newProperty, newRoom)}</span>
                    {newProperty === "Isla Verde" && parseInt(newRoom) >= 1 && parseInt(newRoom) <= 4 && (
                      <span className="ml-2 text-green-400/60">| Door: 2323#</span>
                    )}
                  </p>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button onClick={handleAddGuest} disabled={!newName.trim() || !newReservation.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.25)", color: "rgb(134,239,172)" }}>
                  <Save className="w-3.5 h-3.5" /> {t("Create Reservation", "Crear Reservacion")}
                </button>
                <GlassButton onClick={resetAddForm}>
                  <X className="w-3.5 h-3.5" /> {t("Cancel", "Cancelar")}
                </GlassButton>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {guests.length === 0 && !showAddForm ? (
          <div className="text-center py-20">
            <Users className="w-10 h-10 mx-auto mb-4 text-white/15" />
            <p className="font-serif text-2xl text-white/50 mb-2">{t("No guest accounts yet", "Sin cuentas de huesped aun")}</p>
            <p className="text-white/25 text-sm mb-4">{t("Add a reservation manually or wait for guests to fill out the pre-arrival form.", "Agregue una reservacion manualmente o espere a que los huespedes llenen el formulario de pre-llegada.")}</p>
            <button onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium bg-white/8 border border-white/12 text-white/70 hover:bg-white/14 hover:text-white transition-all">
              <UserPlus className="w-3.5 h-3.5" /> {t("Add First Reservation", "Agregar Primera Reservacion")}
            </button>
          </div>
        ) : (
          [...guests].reverse().map((g) => {
            const isExpanded = expandedGuest === g.reservationNumber;
            const isEditing = editingGuest === g.reservationNumber;
            const canSendCode = g.phone && g.roomNumber && g.lockboxCode;
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

                        {canSendCode && (
                          <div className="mt-3 pt-3 border-t border-white/8">
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
                            <p className="text-[9px] text-white/20 mt-1.5 leading-relaxed">
                              {t(
                                `Will send: Room ${g.property === "Ocean Park" ? "OP" : "IV"}-${g.roomNumber}, Code: ${g.lockboxCode}, + instructions`,
                                `Enviara: Habitacion ${g.property === "Ocean Park" ? "OP" : "IV"}-${g.roomNumber}, Codigo: ${g.lockboxCode}, + instrucciones`
                              )}
                            </p>
                          </div>
                        )}

                        {!canSendCode && g.phone && (
                          <div className="mt-3 pt-3 border-t border-white/8">
                            <p className="text-[10px] text-amber-400/60 italic">
                              {t("Assign a room to enable sending the check-in code via text.", "Asigne una habitacion para poder enviar el codigo de check-in por mensaje.")}
                            </p>
                          </div>
                        )}

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

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <p className="text-[10px] text-white/30 mb-1">{t("Phone", "Telefono")}</p>
                                  <GlassInput
                                    value={g.phone || ""}
                                    onChange={(v) => handleUpdateGuest(g.reservationNumber, { phone: v })}
                                    placeholder="+1 787-555-1234"
                                  />
                                </div>
                                <div>
                                  <p className="text-[10px] text-white/30 mb-1">{t("Email", "Email")}</p>
                                  <GlassInput
                                    value={g.email || ""}
                                    onChange={(v) => handleUpdateGuest(g.reservationNumber, { email: v })}
                                    placeholder="guest@email.com"
                                  />
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
