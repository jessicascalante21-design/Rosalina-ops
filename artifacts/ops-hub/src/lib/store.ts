export type TaskType = 'maintenance' | 'housekeeping' | 'frontdesk' | 'management' | 'followup';
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Department = 'frontdesk' | 'maintenance' | 'housekeeping' | 'management';
export type Property = 'Ocean Park' | 'Isla Verde' | 'Both';
export type TaskStatus = 'open' | 'in-progress' | 'completed' | 'cancelled';

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  priority: Priority;
  department: Department;
  property: Property;
  status: TaskStatus;
  description: string;
  actions: string[];
  assignee: string;
  roomNumber?: string;
  guestName?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  dueDate?: string;
}

export type CommDirection = 'inbound' | 'outbound' | 'internal';
export type CommChannel = 'whatsapp' | 'sms' | 'email' | 'internal';
export type CommCategory = 'guest-request' | 'staff-update' | 'vendor' | 'complaint' | 'info';

export interface Communication {
  id: string;
  direction: CommDirection;
  channel: CommChannel;
  from: string;
  to: string;
  originalMessage: string;
  structuredSummary: string;
  category: CommCategory;
  priority: Priority;
  relatedTaskId?: string;
  property: Property;
  createdAt: string;
  isRead: boolean;
}

export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

export interface Alert {
  id: string;
  severity: AlertSeverity;
  department: Department;
  property: Property;
  title: string;
  description: string;
  status: AlertStatus;
  actions: string[];
  createdAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export type AutoCategory = 'checkin' | 'checkout' | 'maintenance' | 'housekeeping' | 'communication';

export interface Automation {
  id: string;
  name: string;
  trigger: string;
  actions: string[];
  department: Department;
  isActive: boolean;
  lastTriggered?: string;
  triggerCount: number;
  category: AutoCategory;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

function hoursAgo(h: number) {
  return new Date(Date.now() - h * 3600000).toISOString();
}

const SEED_TASKS: Task[] = [
  {
    id: generateId(), title: 'Fix AC Unit in Room 12', type: 'maintenance', priority: 'high',
    department: 'maintenance', property: 'Ocean Park', status: 'open',
    description: 'Guest reported AC is blowing warm air. Unit making unusual noise.',
    actions: ['Check compressor', 'Refill refrigerant if needed', 'Test thermostat sensor'],
    assignee: 'Carlos M.', roomNumber: '12', guestName: 'Smith Family',
    createdAt: hoursAgo(3), updatedAt: hoursAgo(3),
  },
  {
    id: generateId(), title: 'Deep clean Room 5 for VIP', type: 'housekeeping', priority: 'high',
    department: 'housekeeping', property: 'Isla Verde', status: 'in-progress',
    description: 'VIP guest arriving at 4PM. Full deep clean with premium amenities.',
    actions: ['Deep clean bathroom', 'Restock minibar with premium selection', 'Fresh flowers', 'Refresh all linens'],
    assignee: 'Maria G.', roomNumber: '5',
    createdAt: hoursAgo(5), updatedAt: hoursAgo(1),
  },
  {
    id: generateId(), title: 'Replace hallway light fixtures', type: 'maintenance', priority: 'medium',
    department: 'maintenance', property: 'Ocean Park', status: 'open',
    description: 'Three hallway light fixtures on 2nd floor are flickering. Need LED replacements.',
    actions: ['Order LED fixtures', 'Schedule installation during quiet hours'],
    assignee: 'Jorge R.',
    createdAt: hoursAgo(24), updatedAt: hoursAgo(24),
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString(),
  },
  {
    id: generateId(), title: 'Process early check-in request', type: 'frontdesk', priority: 'medium',
    department: 'frontdesk', property: 'Ocean Park', status: 'in-progress',
    description: 'Guest requesting 11AM check-in for Room 7. Flight arriving at 9AM.',
    actions: ['Confirm room availability', 'Coordinate with housekeeping', 'Notify guest via WhatsApp'],
    assignee: 'Ana L.', roomNumber: '7', guestName: 'Rodriguez Family',
    createdAt: hoursAgo(6), updatedAt: hoursAgo(2),
  },
  {
    id: generateId(), title: 'Follow up on pool maintenance contract', type: 'management', priority: 'low',
    department: 'management', property: 'Both', status: 'open',
    description: 'Annual pool maintenance contract renewal due next month. Get updated quotes.',
    actions: ['Contact current vendor for renewal quote', 'Get 2 competing bids', 'Review with owner'],
    assignee: 'Diana P.',
    createdAt: hoursAgo(48), updatedAt: hoursAgo(48),
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString(),
  },
  {
    id: generateId(), title: 'Restock beach amenities', type: 'housekeeping', priority: 'medium',
    department: 'housekeeping', property: 'Ocean Park', status: 'open',
    description: 'Beach towels and umbrella inventory running low. Need to reorder.',
    actions: ['Count current inventory', 'Place order with supplier', 'Organize storage area'],
    assignee: 'Maria G.',
    createdAt: hoursAgo(12), updatedAt: hoursAgo(12),
  },
  {
    id: generateId(), title: 'Guest complaint - noise Room 8', type: 'followup', priority: 'high',
    department: 'frontdesk', property: 'Ocean Park', status: 'in-progress',
    description: 'Guest in Room 8 reported noise from Room 9 at 11PM. Need to follow up with both guests.',
    actions: ['Call guest in Room 8 to apologize', 'Remind Room 9 of quiet hours policy', 'Document incident'],
    assignee: 'Ana L.', roomNumber: '8', guestName: 'Thompson',
    createdAt: hoursAgo(8), updatedAt: hoursAgo(4),
  },
  {
    id: generateId(), title: 'Install new keypad on Room 3', type: 'maintenance', priority: 'low',
    department: 'maintenance', property: 'Isla Verde', status: 'completed',
    description: 'Keypad was malfunctioning. Replaced with new unit.',
    actions: ['Remove old keypad', 'Install new unit', 'Program lockbox code', 'Test access'],
    assignee: 'Carlos M.', roomNumber: '3',
    createdAt: hoursAgo(72), updatedAt: hoursAgo(48), completedAt: hoursAgo(48),
  },
  {
    id: generateId(), title: 'Update welcome binder content', type: 'management', priority: 'low',
    department: 'management', property: 'Both', status: 'completed',
    description: 'Updated restaurant recommendations and local attraction info for Q2.',
    actions: ['Research new restaurants', 'Update digital guide', 'Print new binders'],
    assignee: 'Diana P.',
    createdAt: hoursAgo(96), updatedAt: hoursAgo(72), completedAt: hoursAgo(72),
  },
];

const SEED_COMMS: Communication[] = [
  {
    id: generateId(), direction: 'inbound', channel: 'whatsapp',
    from: 'Guest - Martinez', to: 'Front Desk',
    originalMessage: 'Hey we are landing early at 9am, can we get early check in? Also is there parking near the property?',
    structuredSummary: 'Early check-in request (9AM arrival) + parking inquiry',
    category: 'guest-request', priority: 'medium', property: 'Ocean Park',
    createdAt: hoursAgo(2), isRead: false,
  },
  {
    id: generateId(), direction: 'inbound', channel: 'whatsapp',
    from: 'Guest - Johnson', to: 'Front Desk',
    originalMessage: 'The shower in our room has very low water pressure. Can someone look at it?',
    structuredSummary: 'Maintenance request: low water pressure in shower',
    category: 'complaint', priority: 'high', property: 'Ocean Park',
    createdAt: hoursAgo(4), isRead: true,
  },
  {
    id: generateId(), direction: 'outbound', channel: 'whatsapp',
    from: 'Front Desk', to: 'Guest - Williams',
    originalMessage: 'Good morning! Your room is ready for check-in. Room 14, lockbox code: 678. Welcome to Rosalina!',
    structuredSummary: 'Check-in notification sent with room details and lockbox code',
    category: 'info', priority: 'low', property: 'Ocean Park',
    createdAt: hoursAgo(6), isRead: true,
  },
  {
    id: generateId(), direction: 'internal', channel: 'internal',
    from: 'Ana L.', to: 'Housekeeping Team',
    originalMessage: 'Room 19 checkout confirmed. Please prioritize cleaning - next guest arriving at 2PM.',
    structuredSummary: 'Priority cleaning request for Room 19, tight turnover window',
    category: 'staff-update', priority: 'high', property: 'Ocean Park',
    createdAt: hoursAgo(3), isRead: true,
  },
  {
    id: generateId(), direction: 'inbound', channel: 'email',
    from: 'vendor@poolsupply.com', to: 'Management',
    originalMessage: 'Your order #4521 for pool chemicals has shipped. Expected delivery: Thursday.',
    structuredSummary: 'Pool chemical supply order shipped, arriving Thursday',
    category: 'vendor', priority: 'low', property: 'Both',
    createdAt: hoursAgo(8), isRead: true,
  },
  {
    id: generateId(), direction: 'inbound', channel: 'sms',
    from: 'Guest - Chen', to: 'Concierge',
    originalMessage: 'Can you recommend a good restaurant for dinner tonight? Something local, seafood preferred.',
    structuredSummary: 'Restaurant recommendation request - local seafood',
    category: 'guest-request', priority: 'low', property: 'Isla Verde',
    createdAt: hoursAgo(1), isRead: false,
  },
  {
    id: generateId(), direction: 'inbound', channel: 'whatsapp',
    from: 'Guest - Davis', to: 'Front Desk',
    originalMessage: 'We want to extend our stay by 2 more nights if possible. Currently in room 2.',
    structuredSummary: 'Stay extension request - 2 additional nights, Room 2',
    category: 'guest-request', priority: 'medium', property: 'Isla Verde',
    createdAt: hoursAgo(5), isRead: false,
  },
];

const SEED_ALERTS: Alert[] = [
  {
    id: generateId(), severity: 'critical', department: 'maintenance',
    property: 'Ocean Park', title: 'AC Compressor Failure - Building A',
    description: 'Central AC compressor for rooms 10-15 showing error codes. Temperature rising above comfort levels. Vendor contacted.',
    status: 'active',
    actions: ['Emergency vendor dispatch requested', 'Provide portable AC units to affected rooms', 'Notify affected guests'],
    createdAt: hoursAgo(2),
  },
  {
    id: generateId(), severity: 'warning', department: 'housekeeping',
    property: 'Both', title: 'Low Linen Supply',
    description: 'Beach towel and bath linen inventory below minimum threshold. Current stock covers 2 more days at full occupancy.',
    status: 'active',
    actions: ['Emergency laundry service order', 'Reduce beach towel distribution to 2 per room'],
    createdAt: hoursAgo(6),
  },
  {
    id: generateId(), severity: 'warning', department: 'maintenance',
    property: 'Isla Verde', title: 'Water Heater Inconsistent',
    description: 'Water heater in building showing intermittent temperature drops. No guest complaints yet but monitoring.',
    status: 'acknowledged',
    actions: ['Schedule inspection for tomorrow morning', 'Monitor guest feedback'],
    createdAt: hoursAgo(12),
  },
  {
    id: generateId(), severity: 'info', department: 'management',
    property: 'Both', title: 'Monthly Safety Inspection Due',
    description: 'Quarterly fire safety and egress inspection due by end of week. Inspector confirmed for Friday.',
    status: 'active',
    actions: ['Prepare safety checklist', 'Ensure all fire extinguishers are current', 'Clear emergency exits'],
    createdAt: hoursAgo(48),
  },
];

const SEED_AUTOMATIONS: Automation[] = [
  {
    id: generateId(), name: 'Pre-arrival Welcome Message', trigger: '24 hours before check-in',
    actions: ['Send WhatsApp welcome template with property directions', 'Include pre-arrival form link', 'Attach local area guide PDF'],
    department: 'frontdesk', isActive: true, triggerCount: 127, category: 'checkin',
    lastTriggered: hoursAgo(4),
  },
  {
    id: generateId(), name: 'Checkout Reminder', trigger: 'Day of checkout at 9:00 AM',
    actions: ['Send checkout reminder via WhatsApp', 'Include late checkout option', 'Request review link'],
    department: 'frontdesk', isActive: true, triggerCount: 89, category: 'checkout',
    lastTriggered: hoursAgo(8),
  },
  {
    id: generateId(), name: 'Post-checkout Cleaning', trigger: 'Guest status changed to checked-out',
    actions: ['Create housekeeping task for room', 'Set priority based on next arrival time', 'Notify housekeeping team lead'],
    department: 'housekeeping', isActive: true, triggerCount: 203, category: 'housekeeping',
    lastTriggered: hoursAgo(2),
  },
  {
    id: generateId(), name: 'Maintenance Follow-up', trigger: '48 hours after maintenance task created',
    actions: ['Check task status', 'If still open, escalate priority', 'Notify department manager'],
    department: 'maintenance', isActive: true, triggerCount: 34, category: 'maintenance',
    lastTriggered: hoursAgo(24),
  },
  {
    id: generateId(), name: 'Weekly Supply Audit', trigger: 'Every Monday at 8:00 AM',
    actions: ['Generate supply inventory report', 'Flag items below minimum threshold', 'Create reorder tasks if needed'],
    department: 'housekeeping', isActive: true, triggerCount: 18, category: 'housekeeping',
    lastTriggered: hoursAgo(72),
  },
  {
    id: generateId(), name: 'Guest Birthday Package', trigger: 'Guest birthday matches stay dates',
    actions: ['Create birthday package task', 'Notify front desk to confirm with guest', 'Add complimentary amenity to room'],
    department: 'frontdesk', isActive: false, triggerCount: 8, category: 'communication',
  },
  {
    id: generateId(), name: 'Late Check-in Alert', trigger: 'No check-in recorded by 8:00 PM on arrival day',
    actions: ['Send WhatsApp check-in reminder', 'Create front desk follow-up task', 'Alert on-duty manager'],
    department: 'frontdesk', isActive: true, triggerCount: 15, category: 'checkin',
    lastTriggered: hoursAgo(48),
  },
  {
    id: generateId(), name: 'AC Temperature Monitor', trigger: 'Room temperature exceeds 78F for 30+ minutes',
    actions: ['Create maintenance alert', 'Check AC system status', 'Notify room guest if occupied'],
    department: 'maintenance', isActive: true, triggerCount: 6, category: 'maintenance',
    lastTriggered: hoursAgo(96),
  },
];

export const initStore = () => {
  if (!localStorage.getItem('ops_tasks')) localStorage.setItem('ops_tasks', JSON.stringify(SEED_TASKS));
  if (!localStorage.getItem('ops_communications')) localStorage.setItem('ops_communications', JSON.stringify(SEED_COMMS));
  if (!localStorage.getItem('ops_alerts')) localStorage.setItem('ops_alerts', JSON.stringify(SEED_ALERTS));
  if (!localStorage.getItem('ops_automations')) localStorage.setItem('ops_automations', JSON.stringify(SEED_AUTOMATIONS));
};

export const getStoreData = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const setStoreData = <T>(key: string, data: T[]) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const generateNewId = () => Math.random().toString(36).substring(2, 9);
