import {
  FeaturedServiceItem,
  ServiceFamily,
  AudienceSolution,
  ProjectStoryPlaceholder,
  ProcessStep,
} from '../types';



export const FEATURED_SERVICES: FeaturedServiceItem[] = [
  {
    id: 'ftth',
    title: 'FTTH broadband',
    lines: ['FTTH', 'broadband'],
    subtitle: 'High-speed gigabit optical fiber direct to living spaces and home offices',
    image: '/images/service-ftth.png',
    tagline: 'Pure optical fiber to every desk and room',
    overview:
      'Broadway delivers carrier-grade Fiber-To-The-Home (FTTH) architectures with dedicated GPON optical network terminals (ONT). Engineered for zero latency streaming, hybrid remote workstations, simultaneous 4K streams, and resilient smart home ecosystems.',
    keySpecs: [
      'Pure single-mode fiber optic delivery straight to home premise',
      'Dual-band Wi-Fi 6 Gigabit ONT routers with MU-MIMO support',
      'Symmetric upload and download capabilities for telecommuting',
      'Ultra-low packet jitter for conferencing, cloud tools, and gaming',
    ],
    equipmentDetails: [
      'Carrier-grade GPON / XGS-PON Optical Network Terminal (ONT)',
      'Dual-band 802.11ax Wi-Fi 6 wireless gateway with Gigabit LAN ports',
      'High-grade bend-insensitive optical patch cords (G.657.A2 standard)',
      'Inline optical surge protection and clean wall termination box',
    ],
    idealFor: [
      'High-bandwidth household streaming & smart home devices',
      'Work-from-home professionals requiring stable videoconferencing',
      'Multi-device residential units with intensive simultaneous traffic',
    ],
    typicalDeployments: 'Individual villas, premium residential apartments, and gated townships.',
  },
  {
    id: 'voice',
    title: 'Telephone & intercom',
    lines: ['Telephone &', 'intercom'],
    subtitle: 'Crystal-clear SIP telephony, security intercom, and digital EPABX systems',
    image: '/images/service-voice.png',
    tagline: 'Unified voice communications from front gate to executive boardroom',
    overview:
      'Robust voice and intercom infrastructure designed for multi-dwelling residential enclaves, commercial towers, and multi-branch offices. Integrates digital gatekeeping, video door entry, IP-PBX trunks, and multi-line executive handsets into one reliable network.',
    keySpecs: [
      'Dedicated IP-PBX and Hybrid EPABX exchange systems',
      'Multi-apartment video door phone and security gatehouse intercom',
      'HD voice codec support (G.722 / Opus) for natural audio clarity',
      'Internal zero-cost inter-flat and inter-department dialing',
    ],
    equipmentDetails: [
      'Executive Gigabit IP desk phones with backlit LCD displays',
      'Vandal-resistant brushed stainless steel outdoor video intercom panels',
      'Centralised digital telephony rack-mounted matrix switch',
      'Integrated security guard master console with call routing',
    ],
    idealFor: [
      'Gated communities needing verified visitor screening from gate to flat',
      'Corporate offices needing internal extension dialing and trunking',
      'Commercial clinics and hospitality venues requiring swift intercom call routing',
    ],
    typicalDeployments: 'Apartment towers, villa gated communities, and corporate offices.',
  },
  {
    id: 'business',
    title: 'Business broadband & leased lines',
    lines: ['Business', 'broadband &', 'leased lines'],
    subtitle: 'Dedicated 1:1 symmetric internet leased lines with committed SLAs and redundant paths',
    image: '/images/service-business.png',
    tagline: 'Mission-critical enterprise bandwidth with round-the-clock priority routing',
    overview:
      'Engineered specifically for Bengaluru enterprises, IT clusters, BPOs, and financial offices requiring non-blocking 1:1 committed throughput. Features ring-protected fiber backbones, static IP allocations, multi-homed upstream routing, and guaranteed SLA response times.',
    keySpecs: [
      'True 1:1 uncompressed, symmetric bandwidth for upload and download',
      'Direct peering with major Indian and global Internet Exchanges (NIXI)',
      'Multiple public IPv4 and IPv6 subnet blocks allocated',
      'Formal Service Level Agreements (SLA) with continuous link health monitoring',
    ],
    equipmentDetails: [
      'Enterprise managed Layer 2 / Layer 3 core switches (Gigabit & 10G SFP+)',
      'Dual optical fiber entry via diverse physical duct paths',
      'Modular rack-mountable router with automated link-failover capability',
      '24/7 Bengaluru Network Operations Center (NOC) prober and diagnostics',
    ],
    idealFor: [
      'Software engineering teams pushing heavy codebases and docker images',
      'Financial operations, ERP systems, and cloud-hosted database operations',
      'Offices running real-time VoIP trunks, video production, and SaaS backbones',
    ],
    typicalDeployments: 'Outer Ring Road tech parks, Whitefield IT corridors, and CBD commercial offices.',
  },
  {
    id: 'security',
    title: 'CCTV & automation',
    lines: ['CCTV &', 'automation'],
    subtitle: 'High-definition IP surveillance, biometric access control, and smart perimeter security',
    image: '/images/service-security.png',
    tagline: 'Intelligent physical security and automated building access management',
    overview:
      'Complete end-to-end electronic surveillance, automated boom barriers, biometric staff management, and perimeter monitoring systems. Tailored for commercial facilities, residential associations, logistics yards, and educational grounds across Bengaluru.',
    keySpecs: [
      '4K / 5MP night-vision IP dome and bullet cameras with optical zoom',
      'Centralized Network Video Recorders (NVR) with RAID storage redundancy',
      'RFID and Biometric access control for entry points, server rooms, and lifts',
      'ANPR (Automatic Number Plate Recognition) for automated vehicle boom gates',
    ],
    equipmentDetails: [
      'Weatherproof IP67 silver outdoor security cameras with infrared LED arrays',
      'Touch-capacitive RFID / biometric keypad terminals with tamper alerts',
      'High-throughput PoE+ network switches dedicated for camera isolation',
      'Central security command console display with multi-feed matrix viewing',
    ],
    idealFor: [
      'Residential societies monitoring clubhouses, basements, and perimeter fences',
      'Commercial buildings requiring audit logs for authorized access zones',
      'Educational institutions ensuring safe campus environments for students',
    ],
    typicalDeployments: 'Campus perimeters, apartment basements, corporate reception lobbies, and server rooms.',
  },
];

export const SERVICE_FAMILIES: ServiceFamily[] = [
  {
    id: 'internet',
    name: 'Internet connectivity',
    shortDesc: 'Fiber-optic high-bandwidth connections for residential living and corporate operations.',
    iconName: 'Globe',
    services: [
      {
        name: 'FTTH Gigabit Broadband',
        description: 'Direct fiber drops to individual flats and villas with Wi-Fi 6 equipment.',
        featuredKey: 'ftth',
      },
      {
        name: '1:1 Internet Leased Lines',
        description: 'Dedicated symmetric throughput with committed latency and SLA guarantees.',
        featuredKey: 'business',
      },
      {
        name: 'Redundant Secondary Links',
        description: 'Automated failover links ensuring zero downtime for critical business operations.',
      },
      {
        name: 'Multi-Homed BGP Transit',
        description: 'Carrier-grade transit peering for tech institutions and heavy data hubs.',
      },
    ],
  },
  {
    id: 'networks',
    name: 'Networks & Wi-Fi',
    shortDesc: 'Structured copper and fiber campus networks, enterprise switching, and seamless roaming Wi-Fi.',
    iconName: 'Network',
    services: [
      {
        name: 'High-Density Campus Wi-Fi',
        description: 'Controller-managed access points engineered for large simultaneous user loads.',
      },
      {
        name: 'Cat6 / Fiber Structured Cabling',
        description: 'Neat, labeled rack termination, patch bays, and certified backbone conduits.',
      },
      {
        name: 'Managed Core & Edge Switching',
        description: 'Layer 2/3 VLAN segregation, QoS prioritization, and PoE+ power delivery.',
        featuredKey: 'business',
      },
      {
        name: 'SD-WAN & Site-to-Site VPN',
        description: 'Secure, encrypted interconnection between multiple branches and cloud assets.',
      },
    ],
  },
  {
    id: 'security-automation',
    name: 'Security & automation',
    shortDesc: 'IP video surveillance, biometric access control, perimeter beams, and smart facility sensors.',
    iconName: 'ShieldCheck',
    services: [
      {
        name: 'IP CCTV Surveillance Systems',
        description: 'High-definition night-vision cameras with central NVR recording and retention.',
        featuredKey: 'security',
      },
      {
        name: 'Biometric Access & Time Attendance',
        description: 'Fingerprint, card, and facial authentication terminals with software logging.',
      },
      {
        name: 'Automated Boom Barriers & ANPR',
        description: 'Vehicle gate automation with fast tag readers and visitor logging.',
      },
      {
        name: 'Perimeter Intrusion Detection',
        description: 'Infrared fence sensors and audible alarm triggers for residential campuses.',
      },
    ],
  },
  {
    id: 'voice-intercom',
    name: 'Voice & intercom',
    shortDesc: 'IP telephony, digital EPABX systems, video door phones, and campus intercom channels.',
    iconName: 'PhoneCall',
    services: [
      {
        name: 'Multi-Apartment Video Intercom',
        description: 'Guardhouse to apartment call routing with two-way audio and video verification.',
        featuredKey: 'voice',
      },
      {
        name: 'IP-PBX & SIP Trunking',
        description: 'Scalable corporate voice servers with IVR, call recording, and extension forwarding.',
      },
      {
        name: 'Public Address (PA) & BGM Systems',
        description: 'Zone-based emergency announcement speakers and background music systems.',
      },
      {
        name: 'Hybrid EPABX Systems',
        description: 'Reliable analog and digital hybrid telephone exchanges for hospitality and clinics.',
      },
    ],
  },
  {
    id: 'it-digital',
    name: 'IT & digital services',
    shortDesc: 'Turnkey IT rack integration, firewall security, server deployment, and facility digital setups.',
    iconName: 'Cpu',
    services: [
      {
        name: 'Server Rack & Comms Room Fit-Out',
        description: 'Server cabinets, precision cooling ducts, cable management, and UPS distribution.',
      },
      {
        name: 'Next-Gen Firewall & UTM Deployment',
        description: 'Gateway anti-malware, content filtering, and intrusion prevention systems.',
      },
      {
        name: 'Cloud Direct Connect Services',
        description: 'Optimized low-latency peering routes to AWS, Azure, and Google Cloud clusters.',
      },
      {
        name: 'Facility Digital Signage Infrastructure',
        description: 'Centralized display networks for institutional noticeboards and corporate lobbies.',
      },
    ],
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    shortDesc: 'Digital TV distribution, community headends, and hospitality streaming distribution.',
    iconName: 'Tv',
    services: [
      {
        name: 'Centralized RF & IPTV Headends',
        description: 'Single-dish community master antenna distribution (SMATV) for apartment blocks.',
      },
      {
        name: 'High-Density OTT Delivery Buffering',
        description: 'Local caching and optical delivery minimizing buffering on prime entertainment apps.',
      },
      {
        name: 'Commercial Audio-Visual Wiring',
        description: 'Auditorium, conference room, and clubhouse multi-zone media routing.',
      },
      {
        name: 'Digital Cable TV Integration',
        description: 'Clean distribution of regional and international high-definition broadcast channels.',
      },
    ],
  },
];

export const AUDIENCE_SOLUTIONS: AudienceSolution[] = [
  {
    id: 'homes',
    label: 'Homes',
    headline: 'High-speed fiber connectivity and digital living for modern households',
    description:
      'We deliver dependable, symmetric internet access directly into your home with certified optical terminations, zero ugly loose wiring, and optional intercom and security camera integrations.',
    recommendedStack: [
      'FTTH Broadband with Gigabit Wi-Fi 6 Router',
      'Single-number billing and 24/7 helpline',
      'Smart video door phone unit connection',
      'Optional home CCTV and perimeter viewing',
    ],
    deploymentHighlights: [
      'Clean concealed optical wall termination with fiber protection',
      'Whole-home Wi-Fi coverage consultation to eliminate dead corners',
      'Quick provisioning across surveyed residential areas in Bengaluru',
    ],
    primaryBenefit: 'Work, stream, and communicate simultaneously without latency drops or throttling.',
  },
  {
    id: 'communities',
    label: 'Apartments & communities',
    headline: 'Unified optical fiber and security infrastructure for gated communities',
    description:
      'Instead of multiple messy vendor wires across your shafts, Broadway engineers a single, organized optical backbone for the entire society—powering resident broadband, security intercom, gate boom barriers, and CCTV surveillance.',
    recommendedStack: [
      'Centralised Society FTTH Optical Distribution Frame (ODF)',
      'Guardhouse-to-Flat Multi-Dwelling Video Intercom Network',
      'Comprehensive IP CCTV coverage for common areas and basements',
      'Automated Boom Barriers with RFID / ANPR integration',
    ],
    deploymentHighlights: [
      'Eliminates duct congestion and tangled rooftop cables across buildings',
      'Single SLA agreement covering both network and security infrastructure',
      'Dedicated on-site support engineers for large communities (500+ units)',
    ],
    primaryBenefit: 'Simplified RWA maintenance, enhanced property security, and happy residents.',
  },
  {
    id: 'businesses',
    label: 'Businesses',
    headline: 'Symmetric leased lines and enterprise networking for modern enterprises',
    description:
      'Designed for Bengaluru startups, corporate centers, and multi-floor offices where network reliability directly dictates revenue. We provide symmetric leased bandwidth, managed switches, SD-WAN, and structured cabling.',
    recommendedStack: [
      '1:1 Dedicated Internet Leased Line (ILL) with SLA agreement',
      'Enterprise Structured Cabling (Cat6A / OM4 Fiber Backbones)',
      'Corporate IP-PBX Telephony with multi-extension routing',
      'Hardware Next-Gen Firewall with VPN for hybrid remote workers',
    ],
    deploymentHighlights: [
      'Dual diverse-path fiber entry to protect against municipal roadwork cuts',
      'Committed packet delivery latency and 24/7 dedicated account manager',
      'Organized server room server rack fabrication and certified labeling',
    ],
    primaryBenefit: 'Deterministic network performance backed by enterprise service level commitments.',
  },
  {
    id: 'institutions',
    label: 'Institutions & campuses',
    headline: 'Campus-wide optical rings and resilient infrastructure for learning & healthcare',
    description:
      'Extensive campus environments demand high-density Wi-Fi capable of handling thousands of simultaneous connections, robust surveillance matrices across expansive perimeters, and reliable voice communications.',
    recommendedStack: [
      'Multi-Gigabit Campus Optical Fiber Ring Architecture',
      'High-Density Controller-Managed Wi-Fi across libraries and hostels',
      'Campus-wide IP Surveillance and Central Command Center',
      'Zone-based Emergency Public Address (PA) and Intercom systems',
    ],
    deploymentHighlights: [
      'Segmented VLANs for administrative staff, faculty, and student guest networks',
      'Deep optical trenches with protective armoring across open grounds',
      'High capacity central core switching with redundant power supply units',
    ],
    primaryBenefit: 'Safe, fully connected environments supporting modern digital learning and operations.',
  },
];

export const PROJECT_STORY_PLACEHOLDERS: ProjectStoryPlaceholder[] = [
  {
    id: 'residential-enclave',
    prototypeLabel: '[Case Study Prototype: 850-Unit Gated Community, Whitefield]',
    clientType: 'Gated Residential Society',
    location: 'Whitefield Corridor, Bengaluru',
    infrastructureScope: [
      'Turnkey FTTH optical backbone across 6 residential towers',
      'Digital video intercom matrix linking 3 security gates to all 850 residences',
      '140+ IP CCTV surveillance points covering perimeters, basements, and clubhouse',
    ],
    technicalApproach:
      'Engineered an underground optical ring topology eliminating copper degradation. Standardized all internal shaft conduits, preventing multi-operator cabling clutter.',
    deliverables:
      'Centralised ODF room, automated vehicle boom barriers with FASTag integration, and proactive 24/7 link supervision.',
  },
  {
    id: 'tech-park',
    prototypeLabel: '[Case Study Prototype: 7-Story IT & Tech Facility, Outer Ring Road]',
    clientType: 'Commercial IT Hub',
    location: 'Outer Ring Road (Bellandur), Bengaluru',
    infrastructureScope: [
      'Redundant 1:1 symmetric Internet Leased Lines via dual diverse duct paths',
      'Complete Cat6A structured cabling and 10G fiber backbone across all floors',
      'Biometric turnstile access control and server room environmental sensors',
    ],
    technicalApproach:
      'Implemented automated BGP failover between two geographically separate fiber feeds. Configured isolated tenant VLANs and centralized cable management racks.',
    deliverables:
      'Carrier-neutral server rack infrastructure, 99.9% committed SLA parameters, and dedicated rapid-response dispatch team.',
  },
  {
    id: 'education-campus',
    prototypeLabel: '[Case Study Prototype: 35-Acre Institutional Campus, North Bengaluru]',
    clientType: 'Educational Institution',
    location: 'Yelahanka / Airport Road, Bengaluru',
    infrastructureScope: [
      'Armored single-mode outdoor optical fiber ring linking 8 campus buildings',
      'High-density managed Wi-Fi coverage across academic blocks, auditoriums, and hostels',
      'Integrated campus-wide public address and IP camera monitoring center',
    ],
    technicalApproach:
      'Designed a resilient self-healing optical ring with zero single points of failure. Implemented role-based network access control (NAC) for faculty, staff, and students.',
    deliverables:
      'Centralized network operations console, high-capacity core switching, and scheduled quarterly preventive maintenance audits.',
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Survey',
    durationHint: 'Detailed Physical Audit',
    focus: 'On-site infrastructure inspection & technical feasibility',
    details: [
      'Physical inspection of entry ducts, risers, and utility shafts',
      'RF signal propagation analysis and Wi-Fi dead-zone mapping',
      'Optical path distance calculation from nearest Broadway distribution hub',
      'Identification of power redundancy and rack placement parameters',
    ],
  },
  {
    step: '02',
    title: 'Design',
    durationHint: 'Engineering & Schematics',
    focus: 'Custom network topology, bandwidth planning & bill of materials',
    details: [
      'Preparation of CAD duct layouts and single-line optical schematics',
      'Selection of carrier-grade switches, routers, and optical splitters',
      'Redundancy and failover architecture design for mission-critical nodes',
      'Clear, transparent BOM with zero hidden equipment costs',
    ],
  },
  {
    step: '03',
    title: 'Install',
    durationHint: 'Certified Deployment',
    focus: 'Fusion optical splicing, structured cabling & calibrated testing',
    details: [
      'Concealed, code-compliant conduit and armored cable laying',
      'Precision core-alignment optical fusion splicing with OTDR loss verification',
      'Structured rack dressing, port labeling, and patch cable dressing',
      'End-to-end throughput testing, latency benchmark, and user handover',
    ],
  },
  {
    step: '04',
    title: 'Support',
    durationHint: 'Ongoing 24/7 Operations',
    focus: 'Continuous Bengaluru NOC monitoring & rapid on-ground field dispatch',
    details: [
      '24/7 link supervision with automated outage alerts',
      'Dedicated Bengaluru-based technical helpline and ticketing desk',
      'Local on-field repair vans equipped with mobile fusion splicers and spare ONTs',
      'Periodic preventive maintenance and optical power level calibration',
    ],
  },
];

export const BENGALURU_ZONES = [
  'Whitefield & ITPL',
  'Outer Ring Road (Bellandur / Marathahalli)',
  'Electronic City (Phase 1 & 2)',
  'Indiranagar & Koramangala',
  'CBD (MG Road / Residency Road)',
  'Hebbal, Manyata & North Bengaluru',
  'HSR Layout & BTM',
  'Jayanagar & JP Nagar',
  'Bannerghatta Road',
  'Other Bengaluru Zone',
];
