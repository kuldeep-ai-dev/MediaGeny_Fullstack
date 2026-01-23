-- Seed Products if not exist

BEGIN;

INSERT INTO products (slug, title, short_description, full_description, trust_client_count, features, key_highlights, success_stories)
VALUES 
(
    'school-management-software', 
    'School Management Software', 
    'All-in-one ERP solution to streamline school administration, exams, and fees.', 
    'Transform your educational institution with our comprehensive School Management System. Designed for schools, colleges, and universities, this platform integrates every aspect of academic administration into a single cloud-based interface. From student admission to result declaration, fee collection to library management, everything is automated and accessible.',
    150,
    '[
        {"title": "Student Information System", "description": "Complete 360-degree profile management for students including academic history and attendance."},
        {"title": "Fee Management", "description": "Automated fee calculation, receipts, and online payment gateway integration."},
        {"title": "Exam & Results", "description": "Easy exam scheduling, grading, and automated report card generation."},
        {"title": "Library Management", "description": "Track books, issue/return limits, and fine calculations automatically."}
    ]'::jsonb,
    '["Cloud Based Access", "Mobile App for Parents", "Data Security", "24/7 Support"]'::jsonb,
    '[
        {"client": "St. Xavier High School", "quote": "Reduced our administrative workload by 40%. The fee collection process is now completely seamless.", "result": "40% Efficiency Boost"},
        {"client": "Delhi Public School", "quote": "The best ERP we have used in the last decade. The parent mobile app is a game changer.", "result": "98% Parent Satisfaction"}
    ]'::jsonb
),
(
    'restaurant-pos', 
    'Restaurant POS System', 
    'A lightning-fast Point of Sale system designed for modern restaurants and cafes.', 
    'Speed up your service and delight your guests with our Restaurant POS. Whether you run a fine dining establishment, a quick-service cafe, or a cloud kitchen, our POS adapts to your workflow. Manage tables, split bills, track inventory, and analyze sales trends in real-time.',
    85,
    '[
        {"title": "Table Management", "description": "Visual table map to track occupancy and status in real-time."},
        {"title": "Inventory Tracking", "description": "Ingredient-level inventory tracking with low-stock alerts."},
        {"title": "KOT Management", "description": "Direct Kitchen Order Tickets printing and display system."},
        {"title": "Online Ordering", "description": "Integrate with Zomato/Swiggy and manage all orders from one screen."}
    ]'::jsonb,
    '["Offline Mode", "Multi-Outlet Support", "Analytics Dashboard", "Staff Management"]'::jsonb,
    '[
        {"client": "The Burger Joint", "quote": "Our table turnover rate improved drastically thanks to the faster checkout process.", "result": "20% Revenue Increase"},
        {"client": "Spice Route", "quote": "Inventory waste dropped significantly because we can now track every gram of usage.", "result": "15% Cost Saving"}
    ]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;

COMMIT;
