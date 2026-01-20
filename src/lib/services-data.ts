export interface ServiceData {
    slug: string
    title: string
    shortDescription: string
    fullDescription: string
    iconName: string // mapping to Lucide icons
    gradient: string
    features: {
        title: string
        description: string
    }[]
    techStack: {
        name: string
        icon?: string
    }[]
    recentWorks: {
        title: string
        category: string
        image: string
    }[]
    faq: {
        question: string
        answer: string
    }[]
}

export const servicesData: ServiceData[] = [
    {
        slug: "web-development",
        title: "Web Development",
        shortDescription: "High-performance websites built with Next.js, tailored to convert visitors into customers.",
        fullDescription: "In the digital age, your website is your global storefront. We don't just build websites; we craft digital experiences that tell your brand's story, engage your audience, and drive conversions. Utilizing the latest frameworks like Next.js and React, we ensure your site is lightning-fast, SEO-optimized, and visually stunning.",
        iconName: "Globe",
        gradient: "from-blue-500 to-cyan-400",
        features: [
            { title: "Performance First", description: "Blazing fast load times with server-side rendering and static generation." },
            { title: "Responsive Design", description: "Flawless experiences across all devices, from desktops to smartphones." },
            { title: "SEO Optimized", description: "Built with search engines in mind to help you rank higher and reach more customers." },
            { title: "Scalable Architecture", description: "Future-proof codebases that grow with your business." }
        ],
        techStack: [
            { name: "Next.js" }, { name: "React" }, { name: "TypeScript" }, { name: "Tailwind CSS" }, { name: "Node.js" }, { name: "PostgreSQL" }
        ],
        recentWorks: [
            { title: "LuxeArchitecture", category: "Corporate Website", image: "/portfolio_corporate_website.png" },
            { title: "ShopifyPlus Dashboard", category: "E-commerce", image: "/portfolio_ecommerce_dashboard.png" }
        ],
        faq: [
            { question: "How long does it take to build a website?", answer: "Timeline varies by complexity, but typically ranges from 4-8 weeks for a standard business site." },
            { question: "Do you offer maintenance?", answer: "Yes, we offer comprehensive post-launch support and maintenance packages." }
        ]
    },
    {
        slug: "app-development",
        title: "App Development",
        shortDescription: "Native and cross-platform mobile apps that provide seamless user experiences.",
        fullDescription: "Mobile is where your customers are. We design and develop intuitive, robust mobile applications for iOS and Android. Whether you need a native experience or a cost-effective cross-platform solution using React Native or Flutter, we deliver apps that users love to interact with.",
        iconName: "Smartphone",
        gradient: "from-purple-500 to-pink-500",
        features: [
            { title: "Cross-Platform", description: "One codebase, two platforms. Save time and budget with React Native." },
            { title: "Native Performance", description: "Smooth animations and native behavioral integration." },
            { title: "Offline Capable", description: "Apps that work effectively even with intermittent internet connectivity." },
            { title: "Secure & Scalable", description: "Enterprise-grade security standards and scalable backend integration." }
        ],
        techStack: [
            { name: "React Native" }, { name: "Flutter" }, { name: "Swift" }, { name: "Kotlin" }, { name: "Firebase" }, { name: "Supabase" }
        ],
        recentWorks: [
            { title: "FitTrack Pro", category: "Fitness App", image: "/portfolio_fitness_app.png" },
            { title: "FoodDash", category: "Delivery App", image: "/portfolio_kiosk_interface.png" }
        ],
        faq: [
            { question: "Do you build for both iOS and Android?", answer: "Yes, we specialize in both platforms using modern cross-platform technologies." }
        ]
    },
    {
        slug: "custom-software",
        title: "Custom Software",
        shortDescription: "Scalable enterprise software solutions to automate and optimize your business flows.",
        fullDescription: "Off-the-shelf software often falls short of unique business needs. We engineer bespoke software solutions tailored specifically to your workflows. From internal tools and dashboards to complex ERP and CRM systems, our software empowers your team to achieve more in less time.",
        iconName: "Code",
        gradient: "from-emerald-500 to-teal-400",
        features: [
            { title: "Tailored Workflows", description: "Software designed exactly around how your business operates." },
            { title: "Legacy Integration", description: "Seamless functioning with your existing legacy systems." },
            { title: "Automated Processes", description: "Reduce manual error and save thousands of man-hours through automation." },
            { title: "Data Analytics", description: "Powerful dashboards to visualize your business KPIs in real-time." }
        ],
        techStack: [
            { name: "Python" }, { name: "Go" }, { name: "Docker" }, { name: "AWS" }, { name: "Redis" }, { name: "PostgreSQL" }
        ],
        recentWorks: [
            { title: "Logistics ERP", category: "Internal Tool", image: "/portfolio_ecommerce_dashboard.png" },
            { title: "HR Portal", category: "Custom Software", image: "/portfolio_corporate_website.png" }
        ],
        faq: [
            { question: "Can you integrate with our existing software?", answer: "Absolutely. We specialize in API integrations and modernizing legacy systems." }
        ]
    },
    {
        slug: "social-media",
        title: "Social Media",
        shortDescription: "Strategic content and management to elevate your brand's presence across all platforms.",
        fullDescription: "In a crowded digital landscape, standing out is essential. Our social media experts craft compelling narratives and visual strategies that resonate with your audience. We manage your presence, engage your community, and analyze performance to ensure consistent growth and ROI.",
        iconName: "BarChart",
        gradient: "from-orange-500 to-red-500",
        features: [
            { title: "Content Strategy", description: "Data-driven content calendars aligned with your marketing goals." },
            { title: "Creative Production", description: "High-quality reels, graphics, and copy that capture attention." },
            { title: "Community Management", description: "Active engagement to build loyalty and trust with your audience." },
            { title: "Analytics & Reporting", description: "Detailed monthly reports showing growth, reach, and engagement." }
        ],
        techStack: [
            { name: "Adobe Creative Suite" }, { name: "Canva" }, { name: "Meta Business Suite" }, { name: "Hootsuite" }, { name: "Figma" }
        ],
        recentWorks: [
            { title: "Fashion Week Campaign", category: "Social Strategy", image: "/portfolio_corporate_website.png" },
            { title: "Tech Launch", category: "Content Creation", image: "/portfolio_fitness_app.png" }
        ],
        faq: [
            { question: "Which platforms do you manage?", answer: "We cover Instagram, LinkedIn, X (Twitter), Facebook, and TikTok." }
        ]
    },
    {
        slug: "branding",
        title: "Branding",
        shortDescription: "Identity design and brand strategy to make your business stand out.",
        fullDescription: "Your brand is more than just a logo; it's the feeling you evoke in your customers. We build comprehensive brand identities that command respect and loyalty. From visual systems and typography to tone of voice and brand guidelines, we define who you are in the market.",
        iconName: "Palette",
        gradient: "from-pink-500 to-rose-500",
        features: [
            { title: "Logo Design", description: "Memorable, timeless marks that encapsulate your business values." },
            { title: "Visual Identity", description: "Cohesive color palettes, typography, and imagery systems." },
            { title: "Brand Strategy", description: "Defining your mission, vision, and positioning in the market." },
            { title: "Brand Guidelines", description: "Comprehensive rulebooks to ensure consistency across all touchpoints." }
        ],
        techStack: [
            { name: "Adobe Illustrator" }, { name: "Adobe Photoshop" }, { name: "Figma" }, { name: "Cinema 4D" }
        ],
        recentWorks: [
            { title: "EcoJuice Rebrand", category: "Visual Identity", image: "/portfolio_kiosk_interface.png" },
            { title: "FinTech Logo", category: "Logo Design", image: "/portfolio_ecommerce_dashboard.png" }
        ],
        faq: [
            { question: "What do I get in a branding package?", answer: "Typically: Logo suite, color palette, typography, brand book, and stationery designs." }
        ]
    },
    {
        slug: "kiosk-hardware",
        title: "Custom Kiosk Hardware",
        shortDescription: "Bespoke hardware solutions for interactive customer experiences.",
        fullDescription: "Merge the physical and digital worlds with our custom kiosk solutions. We design and deploy interactive hardware for retail, hospitality, and corporate environments. Whether it's a self-checkout station, wayfinding kiosk, or digital signage, we handle the full lifecycle from hardware selection to software deployment.",
        iconName: "Monitor",
        gradient: "from-yellow-500 to-amber-500",
        features: [
            { title: "Custom Enclosures", description: "Hardware design that fits seamlessly into your physical space." },
            { title: "Touch Interfaces", description: "Responsive, durable touchscreens for high-traffic environments." },
            { title: "IoT Integration", description: "Connect with sensors, printers, and scanners for full functionality." },
            { title: "Remote Management", description: "Software to monitor and update your fleet of kiosks from anywhere." }
        ],
        techStack: [
            { name: "Android Embedded" }, { name: "Windows IoT" }, { name: "Raspberry Pi" }, { name: "Kiosk Mode" }, { name: "Electron" }
        ],
        recentWorks: [
            { title: "FastFood Kiosk", category: "Self Checkout", image: "/portfolio_kiosk_interface.png" },
            { title: "Mall Wayfinder", category: "Information", image: "/portfolio_ecommerce_dashboard.png" }
        ],
        faq: [
            { question: "Do you provide the hardware?", answer: "Yes, we partner with top manufacturers to source and customize the hardware for you." }
        ]
    }
]
