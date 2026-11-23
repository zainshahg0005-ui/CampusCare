import {
  Zap,
  Wifi,
  Droplet,
  Sparkles,
  Activity,
  Building,
  HelpCircle,
} from 'lucide-react';

export const FACILITY_CATEGORIES = [
  {
    id: 'Electricity',
    label: 'Electricity & Power',
    icon: Zap,
    hint: 'Lights, sockets, lab power, AC',
  },
  {
    id: 'Internet/Wi-Fi',
    label: 'Network & Wi-Fi',
    icon: Wifi,
    hint: 'Hostel signal, Ethernet, router drop',
  },
  {
    id: 'Water Supply',
    label: 'Water & Plumbing',
    icon: Droplet,
    hint: 'Taps, dispensers, pressure, heaters',
  },
  {
    id: 'Washroom',
    label: 'Washroom & Sanitary',
    icon: Sparkles,
    hint: 'Hygiene, drains, fixtures',
  },
  {
    id: 'Laboratory',
    label: 'Lab & Heavy Equipment',
    icon: Activity,
    hint: 'Fume hoods, chemicals, gas lines',
  },
  {
    id: 'Classroom',
    label: 'Classroom & Facilities',
    icon: Building,
    hint: 'Desks, projectors, audio, doors',
  },
  {
    id: 'Other',
    label: 'General / Other',
    icon: HelpCircle,
    hint: 'Grounds, transport, general issues',
  },
];

export const CATEGORY_IDS = FACILITY_CATEGORIES.map((c) => c.id);
export const CATEGORY_FILTER_OPTIONS = ['All', ...CATEGORY_IDS];

export default FACILITY_CATEGORIES;
