import { ClubEvent, CrewMember, ContactSubmission, EventGalleryItem } from '../types';

export const INITIAL_CREW: CrewMember[] = [
  {
    id: 'crew-1',
    name: 'Dr. K. Ramaswamy',
    role: 'Faculty Sponsor',
    branch: 'Department of Computer Science & Engineering',
    academic_year: 'Professor & Dean',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    bio: 'Senior ACM Member with over 18 years in distributed computing and academic mentorship. Leading the MBU ACM student chapter to national excellence.',
    social_links: {
      linkedin: 'https://linkedin.com',
      email: 'ramaswamy.k@mbu.asia',
    },
    display_order: 1,
    is_published: true,
    created_at: '2025-01-01T00:00:00Z',
  },
  {
    id: 'crew-2',
    name: 'Aditya Sharma',
    role: 'Chapter Chair / President',
    branch: 'Computer Science & Engineering (CSE)',
    academic_year: '4th Year (B.Tech)',
    photo_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600',
    bio: 'Passionate open-source contributor and full-stack engineer. Leading student initiatives, hackathons, and research circles at Mohan Babu University.',
    social_links: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      email: 'aditya.acm@mbu.asia',
    },
    display_order: 2,
    is_published: true,
    created_at: '2025-01-02T00:00:00Z',
  },
  {
    id: 'crew-3',
    name: 'Sneha Reddy',
    role: 'Vice Chairperson',
    branch: 'CSE (Artificial Intelligence & Machine Learning)',
    academic_year: '3rd Year (B.Tech)',
    photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600',
    bio: 'AI researcher and community builder. Organizing workshops in Deep Learning, NLP, and driving ACM Women in Computing (ACM-W) outreach.',
    social_links: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      email: 'sneha.acm@mbu.asia',
    },
    display_order: 3,
    is_published: true,
    created_at: '2025-01-03T00:00:00Z',
  },
  {
    id: 'crew-4',
    name: 'Rohan Varma',
    role: 'Technical Lead',
    branch: 'Computer Science & Engineering (CSE)',
    academic_year: '4th Year (B.Tech)',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
    bio: 'Cloud architecture & systems enthusiast. Conducts hands-on Docker, Kubernetes, and backend engineering masterclasses for junior members.',
    social_links: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      email: 'rohan.tech@mbu.asia',
    },
    display_order: 4,
    is_published: true,
    created_at: '2025-01-04T00:00:00Z',
  },
  {
    id: 'crew-5',
    name: 'Priya Nair',
    role: 'Webmaster & Dev Lead',
    branch: 'Information Technology (IT)',
    academic_year: '3rd Year (B.Tech)',
    photo_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
    bio: 'Architect behind MBU ACM digital platforms and open source tooling. Passionate about modern web performance, React, and UX design.',
    social_links: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
    },
    display_order: 5,
    is_published: true,
    created_at: '2025-01-05T00:00:00Z',
  },
  {
    id: 'crew-6',
    name: 'Karthik Rao',
    role: 'Head of Operations & Logistics',
    branch: 'Computer Science & Engineering (CSE)',
    academic_year: '3rd Year (B.Tech)',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
    bio: 'Managing sponsorship, on-ground event workflows, venue setups, and hackathon infrastructure with precision.',
    social_links: {
      linkedin: 'https://linkedin.com',
      email: 'karthik.ops@mbu.asia',
    },
    display_order: 6,
    is_published: true,
    created_at: '2025-01-06T00:00:00Z',
  },
  {
    id: 'crew-7',
    name: 'Ananya Patel',
    role: 'Competitive Programming Lead',
    branch: 'CSE (Data Science)',
    academic_year: '2nd Year (B.Tech)',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
    bio: 'Candidate Master on Codeforces and ICPC Regionalist. Spearheads weekly algorithmic problem sets and contest practice sessions.',
    social_links: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
    },
    display_order: 7,
    is_published: true,
    created_at: '2025-01-07T00:00:00Z',
  },
  {
    id: 'crew-8',
    name: 'Varun Teja',
    role: 'Creative & Public Relations Lead',
    branch: 'Electronics & Communication Engineering (ECE)',
    academic_year: '3rd Year (B.Tech)',
    photo_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=600',
    bio: 'Visual designer and media strategist shaping ACM MBU brand presence across print, motion graphics, and social platforms.',
    social_links: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
    },
    display_order: 8,
    is_published: true,
    created_at: '2025-01-08T00:00:00Z',
  }
];

export const INITIAL_EVENTS: ClubEvent[] = [
  {
    id: 'event-hacksprint-2026',
    title: 'MBU HackSprint 2026: 36-Hour National Hackathon',
    summary: 'The flagship hackathon of Mohan Babu University ACM Chapter with prizes over ₹1,50,000.',
    description: `Get ready for the biggest flagship hackathon of the year! MBU HackSprint 2026 brings together the brightest student developers, designers, and innovators from across the country for 36 hours of non-stop building.

Tracks include:
• Artificial Intelligence & Autonomous Agents
• Web3, Decentralized Systems & FinTech
• Healthcare & Smart AgriTech Solutions
• Open Innovation & Sustainable Cities

Participants receive mentorship from industry architects, 24/7 high-speed cloud credits, swag kits, meals, and opportunities for direct internships with partner companies. Team sizes: 2 to 4 members.`,
    poster_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200',
    start_at: '2026-10-24T09:00:00Z',
    end_at: '2026-10-25T21:00:00Z',
    venue: 'MBU Central Computing Lab & Main Auditorium',
    registration_deadline: '2026-10-22T23:59:59Z',
    registration_type: 'internal',
    eligibility_or_instructions: 'Open to all engineering students with valid college ID. Bring your laptop, chargers, and enthusiasm.',
    status: 'published',
    registration_enabled: true,
    category: 'hackathon',
    created_at: '2026-09-15T10:00:00Z',
  },
  {
    id: 'event-genai-agents',
    title: 'Generative AI & Agentic Systems Masterclass',
    summary: 'Deep-dive into multi-agent workflows, vector databases, and LLM orchestration.',
    description: `A fast-paced, interactive masterclass designed to take you from foundational prompting to architecting production-grade AI agents.

What you will build:
• Custom RAG (Retrieval Augmented Generation) pipeline with vector embeddings
• Tool-calling agents using Python, LangGraph, and open models
• Real-time debugging and evaluation techniques

Prerequisites: Basic knowledge of Python. All GPU and cloud API tokens will be provided for attendees. Certificates of completion provided by ACM.`,
    poster_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    start_at: '2026-11-05T14:00:00Z',
    end_at: '2026-11-05T18:00:00Z',
    venue: 'MBU Tech Park, Seminar Hall 3',
    registration_deadline: '2026-11-04T12:00:00Z',
    registration_type: 'internal',
    eligibility_or_instructions: 'Limited to 80 seats on a first-come, first-served basis for enrolled students.',
    status: 'published',
    registration_enabled: true,
    category: 'workshop',
    created_at: '2026-09-20T12:00:00Z',
  },
  {
    id: 'event-google-cloud-talk',
    title: 'Scaling Cloud Microservices: Keynote by Google Engineers',
    summary: 'Learn architectural resilience, high concurrency, and distributed tracing from senior practitioners.',
    description: `Join us for an exclusive keynote and AMA session featuring Staff Engineers from Google Cloud.

Topics covered:
• Handling millions of QPS with minimal latency
• Observability, OpenTelemetry, and Chaos Engineering in production
• Career pathways and engineering interview insights for students

This is an external hybrid session hosted via Google Meet and live broadcasted in the MBU Visvesvaraya Hall.`,
    poster_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200',
    start_at: '2026-11-18T16:00:00Z',
    end_at: '2026-11-18T18:00:00Z',
    venue: 'Virtual (Google Meet) & Visvesvaraya Hall',
    registration_deadline: '2026-11-17T20:00:00Z',
    registration_type: 'external',
    registration_url: 'https://forms.gle/mbu-acm-cloud-keynote-2026',
    eligibility_or_instructions: 'External registration via Google Forms. Meeting link will be emailed to registered attendees.',
    status: 'published',
    registration_enabled: true,
    category: 'talk',
    created_at: '2026-09-25T14:00:00Z',
  },
  {
    id: 'event-codeclash-fall',
    title: 'ACM CodeClash Fall 2025: Algorithmic Duel',
    summary: 'Competitive programming sprint on data structures and dynamic programming.',
    description: `A high-intensity 3-hour competitive coding showdown hosted on HackerRank. Over 140 students battled across 6 problem statements spanning graph traversal, modular arithmetic, and string matching.

Top 3 winners were awarded mechanical keyboards, ACM merchandise, and fast-track invitations to the ICPC training cohort.`,
    poster_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
    start_at: '2025-11-10T17:00:00Z',
    end_at: '2025-11-10T20:00:00Z',
    venue: 'Online Contest Platform',
    registration_type: 'internal',
    status: 'completed',
    registration_enabled: false,
    category: 'contest',
    created_at: '2025-10-15T09:00:00Z',
  },
  {
    id: 'event-quantum-draft',
    title: 'Quantum Computing & Qiskit Primer [Draft]',
    summary: 'Upcoming introductory workshop on qubits, superposition, and quantum algorithms.',
    description: `A forthcoming introductory workshop covering quantum circuits and simulation using IBM Qiskit. This event is currently in curriculum planning and will be published once dates are finalized.`,
    poster_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200',
    start_at: '2026-12-01T10:00:00Z',
    end_at: '2026-12-01T13:00:00Z',
    venue: 'MBU Quantum Research Lab',
    registration_type: 'internal',
    status: 'draft',
    registration_enabled: false,
    category: 'workshop',
    created_at: '2026-10-01T11:00:00Z',
  }
];

export const INITIAL_CONTACT_SUBMISSIONS: ContactSubmission[] = [
  {
    id: 'contact-001',
    name: 'K. Sai Prasad',
    email: 'saiprasad.k@gmail.com',
    subject: 'ACM MBU Membership Query',
    message: 'Hello, I am a 1st year B.Tech CSE student at Mohan Babu University. When will recruitment open for junior executive roles?',
    status: 'reviewed',
    created_at: '2026-10-05T10:15:00Z',
  },
  {
    id: 'contact-002',
    name: 'TechCorp Campus Relations',
    email: 'partnerships@techcorp.io',
    subject: 'HackSprint 2026 Sponsorship Proposal',
    message: 'We are interested in being a track sponsor for HackSprint 2026 and offering API credits and internship interview rounds to finalists. Please share the brochure.',
    status: 'new',
    created_at: '2026-10-08T16:45:00Z',
  }
];

export const INITIAL_GALLERY: EventGalleryItem[] = [
  {
    id: 'gallery-hackathon-2025',
    event_id: 'event-hacksprint-2025',
    title: 'MBU HackSphere 2025: 24-Hour National Hackathon',
    event_date: '2025-02-15',
    academic_year: '2024-2025',
    category: 'hackathon',
    summary: 'Over 200+ engineering students built AI, Web3, and HealthTech solutions under the guidance of industry architects.',
    description: 'HackSphere 2025 was Mohan Babu University’s premier hackathon organized by the MBU ACM Student Chapter. Over 45 teams collaborated around the clock inside the Central Computing Lab. The event featured midnight code sprints, lightning mentoring by tech leads from top startups, and demo pitches evaluated by an elite industry jury. Team "NeuralNexus" took first place for their AI-powered triage diagnostic assistant.',
    cover_image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200',
    attendees_count: 220,
    highlights: [
      '45 Competing Teams',
      '24 Hours Non-Stop Coding',
      '₹75,000 Total Prize Pool',
      '8 Industry Mentors on Site'
    ],
    photos: [
      {
        id: 'photo-h1',
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200',
        caption: 'Hacking underway at the MBU Central Computing Lab at 2:00 AM',
      },
      {
        id: 'photo-h2',
        url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1200',
        caption: 'Finalist teams pitching their prototypes before the evaluation jury',
      },
      {
        id: 'photo-h3',
        url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200',
        caption: 'Mentorship round: Senior engineers reviewing team architecture diagrams',
      },
      {
        id: 'photo-h4',
        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200',
        caption: 'Collaborative brainstorm and rapid frontend prototyping',
      },
      {
        id: 'photo-h5',
        url: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=1200',
        caption: 'Grand felicitation ceremony and trophy distribution to winning teams',
      }
    ],
    is_published: true,
    created_at: '2025-02-18T10:00:00Z',
  },
  {
    id: 'gallery-ai-masterclass',
    title: 'Generative AI & Transformer Architectures Masterclass',
    event_date: '2025-01-22',
    academic_year: '2024-2025',
    category: 'workshop',
    summary: 'A deep-dive hands-on technical workshop exploring custom RAG pipelines, fine-tuning, and PyTorch tensors.',
    description: 'Conducted in the MBU Visvesvaraya Auditorium and Lab 4, this high-impact masterclass gathered 135 student developers eager to advance beyond surface-level prompt engineering. Attendees built an end-to-end multi-agent research assistant, implemented vector cosine indexing, and received official ACM Chapter participation credentials.',
    cover_image_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200',
    attendees_count: 135,
    highlights: [
      '100% Hands-on Coding Lab',
      'Vector Search & RAG Implementations',
      'Certificate of Completion from ACM',
      'Access to GPU Cloud Credits'
    ],
    photos: [
      {
        id: 'photo-a1',
        url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200',
        caption: 'Full house at Visvesvaraya Auditorium during the opening lecture',
      },
      {
        id: 'photo-a2',
        url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=1200',
        caption: 'Students live coding along with the technical speaker on their laptops',
      },
      {
        id: 'photo-a3',
        url: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=1200',
        caption: 'Interactive Q&A on model quantization and deploying locally with Ollama',
      }
    ],
    is_published: true,
    created_at: '2025-01-24T12:00:00Z',
  },
  {
    id: 'gallery-codeclash-fall',
    event_id: 'event-codeclash-fall',
    title: 'ACM CodeClash Fall 2024: Algorithmic Duel',
    event_date: '2024-11-10',
    academic_year: '2024-2025',
    category: 'contest',
    summary: 'A fast-paced 3-hour competitive programming sprint on dynamic programming, trees, and graph algorithms.',
    description: 'CodeClash Fall tested students’ algorithmic thinking and coding speed. Hosted on HackerRank, 140 participants solved 6 challenging problems. The dynamic leaderboard saw constant position shifts until the final freeze. The top 3 winners took home custom mechanical keyboards and fast-track entries into the ICPC training cohort.',
    cover_image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
    attendees_count: 140,
    highlights: [
      '6 Algorithmic Challenges',
      'Real-time Contest Leaderboard',
      'Mechanical Keyboards for Top 3',
      'ICPC Mentorship Pass'
    ],
    photos: [
      {
        id: 'photo-c1',
        url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
        caption: 'Contestants locked in deep focus during the 3-hour speed duel',
      },
      {
        id: 'photo-c2',
        url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200',
        caption: 'Screen recording and real-time test case validation during the contest',
      },
      {
        id: 'photo-c3',
        url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200',
        caption: 'Winners celebration and prize handover by Faculty Sponsor Dr. K. Ramaswamy',
      }
    ],
    is_published: true,
    created_at: '2024-11-12T14:00:00Z',
  },
  {
    id: 'gallery-freshers-expo',
    title: 'ACM Chapter Induction & Annual Tech Expo 2024',
    event_date: '2024-08-20',
    academic_year: '2024-2025',
    category: 'general',
    summary: 'Welcoming 300+ incoming freshmen with live tech demos, club project stalls, and chapter roadmaps.',
    description: 'The annual MBU ACM Induction day introduced newly admitted engineering undergraduates to the world of open source, computing research, and student chapter initiatives. Stalls featured student-built robotics, web3 apps, competitive coding roadmaps, and ACM-W mentorship groups.',
    cover_image_url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1200',
    attendees_count: 310,
    highlights: [
      '310+ Freshers Attended',
      '8 Interactive Tech Stalls',
      'ACM Goodies & Sticker Kits',
      'Keynote by Alumni Tech Leads'
    ],
    photos: [
      {
        id: 'photo-e1',
        url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=1200',
        caption: 'Massive student turnout at the MBU Auditorium during club orientation',
      },
      {
        id: 'photo-e2',
        url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=1200',
        caption: 'Freshers interacting with Executive Crew members at the Web Dev booth',
      },
      {
        id: 'photo-e3',
        url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200',
        caption: 'Group photo of newly recruited student volunteers and chapter leads',
      }
    ],
    is_published: true,
    created_at: '2024-08-22T16:00:00Z',
  },
  {
    id: 'gallery-cloud-keynote',
    title: 'Microservices & Distributed Systems: Industry Tech Talk',
    event_date: '2024-10-05',
    academic_year: '2024-2025',
    category: 'talk',
    summary: 'Distinguished talk by alumni Principal Architects on architecting resilient cloud systems at scale.',
    description: 'Students gained firsthand industry insights into container orchestration with Kubernetes, message brokering with Kafka, and observability with OpenTelemetry. The talk demystified what it takes to design systems serving millions of concurrent requests.',
    cover_image_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1200',
    attendees_count: 175,
    highlights: [
      'Live Cloud Failure Simulation',
      'System Design Interview Tips',
      '175+ Attendees',
      'Interactive Fireside AMA'
    ],
    photos: [
      {
        id: 'photo-k1',
        url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=1200',
        caption: 'Keynote presentation explaining distributed caching bottlenecks',
      },
      {
        id: 'photo-k2',
        url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1200',
        caption: 'Engaged audience participating in live system architecture polling',
      }
    ],
    is_published: true,
    created_at: '2024-10-07T11:00:00Z',
  }
];
