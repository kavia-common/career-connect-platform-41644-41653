//
// mentorResponses.js
// Data mapping of company/career-related terms for mentor guidance responses and descriptions.
// Updated for broader company coverage and robust matching.
//
/* eslint-disable */

const mentorResponses = {
  "Google": {
    aliases: ["google", "google inc", "alphabet"],
    description: "Google is a multinational technology company specializing in internet-related services and products including search, advertising, cloud computing, software, and hardware.",
    guidance: [
      "Develop a strong foundation in algorithms and data structures.",
      "Practice system design and distributed computing concepts.",
      "Sharpen your problem-solving skills with coding challenges.",
      "Demonstrate experience with large-scale applications or open-source projects."
    ],
    resources: [
      { label: "Google Careers", url: "https://careers.google.com/" }
    ]
  },
  "Microsoft": {
    aliases: ["microsoft", "msft", "ms"],
    description: "Microsoft is a global technology company famous for Windows, Office, and Azure. It has major businesses in cloud computing, productivity software, hardware, and gaming.",
    guidance: [
      "Focus on computer science fundamentals.",
      "Prepare for behavioral interviews (Microsoft's 'The 3 As': Awareness, Attitude, Action).",
      "Highlight collaborative experiences and cross-disciplinary projects."
    ],
    resources: [
      { label: "Microsoft Careers", url: "https://careers.microsoft.com/" }
    ]
  },
  "Amazon": {
    aliases: ["amazon", "amazon.com", "aws"],
    description: "Amazon is an e-commerce and cloud computing giant specializing in online retail, digital streaming, AI, and cloud infrastructure (AWS).",
    guidance: [
      "Familiarize yourself with Amazon's Leadership Principles.",
      "Practice coding and LP-based behavioral interview questions.",
      "Showcase experience with scalable, distributed, or customer-facing systems."
    ],
    resources: [
      { label: "Amazon Jobs", url: "https://www.amazon.jobs/" }
    ]
  },
  "Meta (Facebook)": {
    aliases: ["meta", "facebook", "facebook inc", "meta platforms"],
    description: "Meta Platforms (formerly Facebook) is a leading social media and technology company focused on social networking, virtual reality, and the metaverse.",
    guidance: [
      "Focus on system design and large-scale real-time systems.",
      "Demonstrate experience with social, messaging, or media platforms.",
      "Prepare for culture-fit and value-based questions."
    ],
    resources: [
      { label: "Meta Careers", url: "https://www.metacareers.com/" }
    ]
  },
  "Netflix": {
    aliases: ["netflix", "nflx"],
    description: "Netflix is a global streaming entertainment service offering on-demand TV series, movies, and original content. It is a pioneer in online video distribution and content production.",
    guidance: [
      "Understand scalable backend systems and data streaming.",
      "Showcase experience with video, content delivery, or personalization tech."
    ],
    resources: [
      { label: "Netflix Jobs", url: "https://jobs.netflix.com/" }
    ]
  },
  "Apple": {
    aliases: ["apple", "apple inc", "aapl"],
    description: "Apple Inc. is a multinational technology company best known for its innovative consumer electronics like the iPhone, Mac, and Apple Watch, as well as its software and digital services ecosystem.",
    guidance: [
      "Demonstrate attention to design and user experience.",
      "Show experience with hardware-software integration."
    ],
    resources: [
      { label: "Apple Careers", url: "https://www.apple.com/careers/" }
    ]
  },
  "Tesla": {
    aliases: ["tesla", "tsla", "tesla inc"],
    description: "Tesla is an electric vehicle and clean energy company known for electric cars, battery storage, and solar energy solutions, with a strong emphasis on technology innovation.",
    guidance: [
      "Highlight skills in embedded systems or manufacturing tech.",
      "Showcase innovative/theoretical engineering projects."
    ],
    resources: [
      { label: "Tesla Careers", url: "https://www.tesla.com/careers" }
    ]
  },
  "Adobe": {
    aliases: ["adobe", "adobe systems", "adbe"],
    description: "Adobe is a software company recognized for its creative and multimedia products such as Photoshop, Illustrator, Acrobat Reader, and the Adobe Creative Cloud suite.",
    guidance: [
      "Emphasize creative and design-oriented technology work.",
      "Demonstrate software engineering skills for multimedia tools."
    ],
    resources: [
      { label: "Adobe Careers", url: "https://www.adobe.com/careers.html" }
    ]
  },
  "IBM": {
    aliases: ["ibm", "international business machines", "ibm corp"],
    description: "IBM is a global IT company providing enterprise solutions in hardware, software, cloud computing, and artificial intelligence for business and scientific needs.",
    guidance: [
      "Showcase experience with cloud, AI, or enterprise IT systems.",
      "Emphasize problem-solving and complex technical projects."
    ],
    resources: [
      { label: "IBM Careers", url: "https://www.ibm.com/employment/" }
    ]
  },
  "Oracle": {
    aliases: ["oracle", "oracle corp"],
    description: "Oracle Corporation is a multinational computer technology company specializing in database software, cloud solutions, and enterprise business applications.",
    guidance: [
      "Highlight database and backend expertise.",
      "Familiarize yourself with SaaS and cloud platform technologies."
    ],
    resources: [
      { label: "Oracle Careers", url: "https://www.oracle.com/corporate/careers/" }
    ]
  },
  "Salesforce": {
    aliases: ["salesforce", "salesforce.com", "crm"],
    description: "Salesforce is a leading cloud-based software company primarily focused on customer relationship management (CRM), sales, and enterprise communication solutions.",
    guidance: [
      "Showcase skills in SaaS, CRM solutions, or enterprise cloud platforms.",
      "Demonstrate experience with customer-oriented products."
    ],
    resources: [
      { label: "Salesforce Careers", url: "https://www.salesforce.com/company/careers/" }
    ]
  },
  "Uber": {
    aliases: ["uber", "uber technologies"],
    description: "Uber Technologies is a mobility-as-a-service company offering ride-hailing, food delivery (Uber Eats), freight, and urban transportation technology globally.",
    guidance: [
      "Experience with scalable mobile platforms is valued.",
      "Familiarize with urban logistics and optimization problems."
    ],
    resources: [
      { label: "Uber Careers", url: "https://www.uber.com/us/en/careers/" }
    ]
  },
  "Airbnb": {
    aliases: ["airbnb"],
    description: "Airbnb is an online marketplace for lodging and tourism experiences, connecting hosts and travelers for short-term stays and unique accommodations worldwide.",
    guidance: [
      "Experience with marketplaces or trust & safety engineering helps.",
      "Highlight work with data-driven product experiences."
    ],
    resources: [
      { label: "Airbnb Careers", url: "https://careers.airbnb.com/" }
    ]
  },
  "Nvidia": {
    aliases: ["nvidia", "nvda"],
    description: "NVIDIA is a global technology company best known for its advanced graphics processing units (GPUs), AI computing platforms, and solutions for gaming, enterprise, and autonomous vehicles.",
    guidance: [
      "Highlight work with hardware acceleration, AI, or graphics.",
      "Demonstrate C++/CUDA and parallel computing skills."
    ],
    resources: [
      { label: "NVIDIA Careers", url: "https://www.nvidia.com/en-us/about-nvidia/careers/" }
    ]
  },
  "Intel": {
    aliases: ["intel", "intel corp"],
    description: "Intel Corporation is a leading semiconductor company developing microprocessors, integrated circuits, and related technology for computers, data centers, and IoT devices.",
    guidance: [
      "Familiarity with semiconductor or hardware system design.",
      "Demonstrate expertise in embedded engineering and R&D."
    ],
    resources: [
      { label: "Intel Jobs", url: "https://jobs.intel.com/" }
    ]
  },
  // Existing and general categories below:
  "Data Science": {
    aliases: ["data science", "ds"],
    description: "A field focused on extracting insights and value from large amounts of data using analytics, machine learning, and visualization.",
    guidance: [
      "Learn statistics, probability, and data analysis with Python or R.",
      "Build project portfolios with real-world datasets.",
      "Sharpen skills with Kaggle competitions and open data."
    ],
    resources: [
      { label: "Kaggle Competitions", url: "https://www.kaggle.com/competitions" },
      { label: "Data Science Interview Prep", url: "https://www.interviewquery.com/" }
    ]
  },
  "Software Engineering": {
    aliases: ["software engineering"],
    description: "The discipline of designing, coding, testing, and maintaining software applications and systems.",
    guidance: [
      "Practice algorithms, data structures, and problem-solving.",
      "Learn version control (e.g., Git) and collaborative development tools.",
      "Emphasize clean, well-tested code and strong documentation."
    ],
    resources: [
      { label: "LeetCode", url: "https://leetcode.com/" },
      { label: "GitHub Learning Lab", url: "https://lab.github.com/" }
    ]
  },
  "Cloud": {
    aliases: ["cloud", "cloud computing"],
    description: "Working with distributed platforms (AWS, Azure, GCP) delivering scalable computing and storage services.",
    guidance: [
      "Gain hands-on experience with at least one major platform (AWS, Azure, GCP).",
      "Familiarize with concepts: virtualization, containers, serverless, orchestration.",
      "Earn entry-level certifications (e.g., AWS Certified Cloud Practitioner)."
    ],
    resources: [
      { label: "AWS Training", url: "https://aws.amazon.com/training/" },
      { label: "Azure Learning Paths", url: "https://docs.microsoft.com/en-us/learn/azure/" },
      { label: "Google Cloud Training", url: "https://cloud.google.com/training" }
    ]
  }
};

// END mentorResponses MAPPING

export default mentorResponses;
