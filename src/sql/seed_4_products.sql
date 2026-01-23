-- Super Seed: 4 Proprietary Products with Rich Content

BEGIN;

-- Clear existing to avoid duplicates/mess (optional, but safer for a cleanup if user permits. I'll use ON CONFLICT UPDATE instead)

INSERT INTO products (slug, title, short_description, full_description, hero_image_url, trust_client_count, features, key_highlights, success_stories)
VALUES 
(
    'school-management-system', 
    'School Management System', 
    'The future of educational administration. Streamline operations, exams, fees, and communication in one unified platform.', 
    'Empower your educational institution with MediaGeny''s School Management System. We have reimagined how schools operate by digitizing every touchpoint—from admission inquiries to alumni management. \n\nOur platform isn''t just a database; it''s an intelligent operating system for your campus. Teachers save 40% of their time on administrative tasks, allowing them to focus on what matters: teaching. Parents stay connected with real-time updates, and administrators get a bird''s-eye view of the entire institution''s health through powerful analytics.',
    '/products/school-hero.png',
    150,
    '[
        {"title": "Academic Intelligence", "description": "Automated grading, report card generation, and student performance tracking with AI insights.", "icon": "GraduationCap"},
        {"title": "Smart Fee Collection", "description": "Seamless online payments, automated reminders, and instant receipt generation. Zero leakage.", "icon": "CreditCard"},
        {"title": "Live Bus Tracking", "description": "GPS-enabled fleet management ensuring student safety with real-time alerts for parents.", "icon": "MapPin"},
        {"title": "Virtual Classroom", "description": "Integrated LMS for assignments, live classes, and resource sharing.", "icon": "Video"}
    ]'::jsonb,
    '["Mobile App for Parents & Staff", "Biometric Attendance Integration", "100% Data Security Compliance", "Offline-First Architecture"]'::jsonb,
    '[
        {"client": "St. Xavier International", "quote": "We reduced our administrative overhead by 60% in the first year. The fee collection module alone paid for the software.", "result": "Record Efficiency"},
        {"client": "Greenwood High", "quote": "The parent communication gap is gone. Parents love the app and the transparency it brings.", "result": "98% Parent Satisfaction"}
    ]'::jsonb
),
(
    'restaurant-pos-pro', 
    'Restaurant POS Pro', 
    'Speed, stability, and smarts. The Point of Sale system built for high-volume modern dining.', 
    'Running a restaurant is chaos. Your POS shouldn''t be. meet Restaurant POS Pro—the heartbeat of a successful kitchen. Whether you run a bustling cafe, a fine-dining establishment, or a cloud kitchen network, our system adapts to your workflow.\n\nManage table turnover, track ingredient-level inventory, and sync with online aggregators (Zomato/Swiggy) from a single screen. Built to work offline, ensuring your business never stops, even if the internet does.',
    '/products/pos-hero.png',
    200,
    '[
        {"title": "Lightning Checkout", "description": "Process orders in 3 clicks. Split bills, merge tables, and apply discounts instantly.", "icon": "Zap"},
        {"title": "Inventory Control", "description": "Real-time ingredient deduction based on recipes. Get alerts before you run out of stock.", "icon": "Box"},
        {"title": "Kitchen Display System", "description": "KOTs go straight to screens in the kitchen. No paper, no confusion, faster service.", "icon": "Monitor"},
        {"title": "Omnichannel Hub", "description": "Manage dine-in, takeaway, and delivery orders from one dashboard.", "icon": "Globe"}
    ]'::jsonb,
    '["Works Offline", "Menu Engineering Analytics", "Staff Shift Management", "Waiters App Included"]'::jsonb,
    '[
        {"client": "The Burger Joint", "quote": "Our table turnover improved by 15 minutes per table. The KDS integration changed our kitchen life.", "result": "25% Revenue Jump"},
        {"client": "Spice Route", "quote": "Inventory theft dropped to near zero. We know exactly where every gram of butter goes.", "result": "Precision Tracking"}
    ]'::jsonb
),
(
    'gym-management-suite', 
    'Gym Management Suite', 
    'Build a stronger fitness business. Member retention, billing, and scheduling on autopilot.', 
    'Transform your gym into a powerhouse. Gym Management Suite handles the heavy lifting of business administration so you can focus on member fitness. From biometric access control to automated membership renewals, we cover it all.\n\nEngage members with a branded mobile app, track their workout progress, and manage trainers'' schedules effortlessly. Our diet and workout planner retention tools ensure your members stay motivated and keep coming back.',
    '/products/gym-hero.png',
    85,
    '[
        {"title": "Member App", "description": "A white-labeled app for members to book classes, check diet plans, and track workouts.", "icon": "Smartphone"},
        {"title": "Access Control", "description": "Integrate with biometrics or QR turnstiles for 24/7 automated gym access.", "icon": "Lock"},
        {"title": "Automated Billing", "description": "Recurring payments via UPI/Card. Auto-blocks access if payment fails.", "icon": "Repeat"},
        {"title": "Trainer Management", "description": "Commission tracking, shift scheduling, and client assignment tools.", "icon": "Users"}
    ]'::jsonb,
    '["Diet & Workout Builder", "WhatsApp Marketing Integration", "Lead Management CRM", "Revenue Forecasting"]'::jsonb,
    '[
        {"client": "Iron Pump Gym", "quote": "We doubled our membership capacity without adding a single admin staff member.", "result": "2x Growth"},
        {"client": "FitLife Studio", "quote": "The automated renewals saved us thousands in lost revenue. It just works.", "result": "Zero Payment Leakage"}
    ]'::jsonb
),
(
    'ai-pharmacy-stock', 
    'AI Pharmacy Stock', 
    'Smart inventory prediction and expiry management for modern pharmacies.', 
    'Pharmacy management requires precision. One expired drug is a liability; one missing critical medicine is a lost patient. AI Pharmacy Stock brings machine learning to your shelves.\n\nOur system learns your sales patterns to predict exactly what you need to order and when. It tracks batch numbers, expiry dates, and supplier performance, ensuring compliance and profitability. Say goodbye to dead stock and hello to smart procurement.',
    '/products/pharma-hero.png',
    120,
    '[
        {"title": "Expiry Alerts", "description": "Smart notifications 3 months before expiry to help you liquidate or return stock.", "icon": "AlertTriangle"},
        {"title": "Predictive Ordering", "description": "AI analyzes seasonal trends to suggest the perfect reorder quantities.", "icon": "TrendingUp"},
        {"title": "Compliance Ready", "description": "Automated H1/H2 registers and audit-ready reports standard with local laws.", "icon": "FileText"},
        {"title": "Multi-Store Sync", "description": "Manage stock across multiple branches with centralized warehouse transfers.", "icon": "Share2"}
    ]'::jsonb,
    '["25,000+ Drug Database", "Alternative Medicine Suggestions", "B2B Supplier Connect", "Fast Billing Mode"]'::jsonb,
    '[
        {"client": "City Medicos", "quote": "We reduced expired stock losses by 80% in the first quarter. ROI was instant.", "result": "80% Less Waste"},
        {"client": "HealthPlus Chain", "quote": "Managing 5 stores was a nightmare before this. Now it is all on one dashboard.", "result": "Centralized Control"}
    ]'::jsonb
)
ON CONFLICT (slug) 
DO UPDATE SET 
    title = EXCLUDED.title,
    short_description = EXCLUDED.short_description,
    full_description = EXCLUDED.full_description,
    trust_client_count = EXCLUDED.trust_client_count,
    features = EXCLUDED.features,
    key_highlights = EXCLUDED.key_highlights,
    success_stories = EXCLUDED.success_stories;

COMMIT;
