-- Sample seed data for Health SuperApp
-- This file provides initial data for development and testing

-- Insert sample health guides
INSERT INTO health_guides (slug, title_jsonb, body_md, locale, status, version) VALUES
('common-cold-care', '{"en": "Common Cold Care", "fr": "Soins du rhume", "ar": "علاج نزلة البرد"}', 
'# Common Cold Care

## Symptoms
- Runny or stuffy nose
- Sore throat
- Cough
- Mild fever
- Body aches

## Self-Care Tips
1. **Rest**: Get plenty of sleep to help your body fight the infection
2. **Stay Hydrated**: Drink lots of fluids like water, herbal tea, and warm broth
3. **Warm Salt Water**: Gargle with warm salt water to soothe a sore throat
4. **Humidify**: Use a humidifier or breathe steam from a hot shower

## When to See a Doctor
- Fever above 101.5°F (38.6°C)
- Symptoms lasting more than 10 days
- Severe headache or sinus pain
- Difficulty breathing

**Disclaimer**: This information is for educational purposes only and is not a substitute for professional medical advice.', 
'en', 'published', 1),

('headache-relief', '{"en": "Headache Relief Guide", "fr": "Guide de soulagement des maux de tête", "ar": "دليل تخفيف الصداع"}', 
'# Headache Relief Guide

## Types of Headaches
- **Tension headaches**: Most common, feels like a tight band around head
- **Migraines**: Severe, often one-sided, may include nausea and light sensitivity
- **Cluster headaches**: Severe pain around one eye

## Immediate Relief
1. **Rest in a dark, quiet room**
2. **Apply cold or warm compress** to head or neck
3. **Stay hydrated** - dehydration can trigger headaches
4. **Gentle massage** of temples and neck
5. **Deep breathing exercises**

## Prevention
- Maintain regular sleep schedule
- Stay hydrated throughout the day
- Manage stress levels
- Avoid known triggers (certain foods, bright lights)

## When to Seek Medical Help
- Sudden, severe headache unlike any before
- Headache with fever, stiff neck, confusion
- Headache after a head injury
- Chronic headaches that interfere with daily life

**Important**: Never ignore severe or persistent headaches. Always consult a healthcare professional for proper diagnosis.', 
'en', 'published', 1),

('healthy-eating-basics', '{"en": "Healthy Eating Basics", "fr": "Bases d\'une alimentation saine", "ar": "أساسيات الأكل الصحي"}', 
'# Healthy Eating Basics

## Balanced Diet Components
- **Fruits and Vegetables**: 5-9 servings daily
- **Whole Grains**: Choose brown rice, whole wheat bread
- **Lean Proteins**: Fish, poultry, beans, nuts
- **Healthy Fats**: Olive oil, avocados, nuts
- **Dairy or Alternatives**: Low-fat options

## Portion Control
- Use smaller plates
- Fill half your plate with vegetables
- Quarter with lean protein
- Quarter with whole grains

## Hydration
- Drink 8 glasses of water daily
- Limit sugary drinks
- Herbal teas count toward fluid intake

## Meal Planning Tips
1. Plan meals for the week
2. Prepare healthy snacks in advance
3. Read nutrition labels
4. Cook at home more often

**Remember**: Small, consistent changes lead to lasting healthy habits.', 
'en', 'published', 1);

-- Insert sample products
INSERT INTO products (sku, name_jsonb, description_md, price_cents, currency, images_jsonb, tags, stock, is_express_eligible, weight_grams) VALUES
('THERM-001', '{"en": "Digital Thermometer", "fr": "Thermomètre numérique", "ar": "مقياس حرارة رقمي"}', 
'Fast and accurate digital thermometer with fever alarm. Perfect for family use.', 
2499, 'USD', '["https://example.com/thermometer.jpg"]', 
ARRAY['health', 'medical', 'thermometer'], 50, true, 100),

('VITD3-500', '{"en": "Vitamin D3 Supplement", "fr": "Supplément de vitamine D3", "ar": "مكمل فيتامين د3"}', 
'High-quality Vitamin D3 supplement. 1000 IU per capsule. 60 capsules per bottle.', 
1999, 'USD', '["https://example.com/vitamin-d3.jpg"]', 
ARRAY['supplement', 'vitamin', 'health'], 100, true, 150),

('BP-MON-01', '{"en": "Blood Pressure Monitor", "fr": "Tensiomètre", "ar": "جهاز قياس ضغط الدم"}', 
'Automatic blood pressure monitor with large display. Clinically validated accuracy.', 
7999, 'USD', '["https://example.com/bp-monitor.jpg"]', 
ARRAY['medical', 'monitor', 'blood-pressure'], 25, false, 800),

('FIRSTAID-KIT', '{"en": "First Aid Kit", "fr": "Trousse de premiers secours", "ar": "حقيبة إسعافات أولية"}', 
'Complete first aid kit for home and travel. Includes bandages, antiseptic, and emergency supplies.', 
3499, 'USD', '["https://example.com/first-aid-kit.jpg"]', 
ARRAY['emergency', 'first-aid', 'safety'], 30, true, 500),

('OMEGA3-FISH', '{"en": "Omega-3 Fish Oil", "fr": "Huile de poisson Oméga-3", "ar": "زيت السمك أوميغا 3"}', 
'Premium fish oil supplement rich in EPA and DHA. Supports heart and brain health.', 
2799, 'USD', '["https://example.com/omega3.jpg"]', 
ARRAY['supplement', 'omega3', 'heart-health'], 75, true, 200);

-- Insert sample providers
INSERT INTO providers (org_name, type, rating, verified) VALUES
('City Medical Center', 'clinic', 4.5, true),
('Dr. Sarah Johnson - Home Care', 'doctor', 4.8, true),
('Nursing Plus Services', 'nurse', 4.3, true),
('Emergency Home Doctors', 'doctor', 4.6, true),
('Wellness Nursing Team', 'nurse', 4.4, true);

-- Insert sample provider services
INSERT INTO provider_services (provider_id, name, price_cents, duration_min, description_md, at_home) 
SELECT p.id, s.name, s.price_cents, s.duration_min, s.description_md, s.at_home
FROM providers p
CROSS JOIN (
    VALUES 
    ('General Health Checkup', 15000, 60, 'Comprehensive health examination including vital signs, basic tests, and health consultation.', true),
    ('Blood Pressure Monitoring', 8000, 30, 'Professional blood pressure measurement and monitoring with health recommendations.', true),
    ('Wound Care', 12000, 45, 'Professional wound cleaning, dressing, and care instructions for proper healing.', true),
    ('Medication Review', 10000, 30, 'Review of current medications, potential interactions, and optimization recommendations.', true),
    ('Health Consultation', 7500, 30, 'General health consultation and advice for non-emergency health concerns.', true)
) AS s(name, price_cents, duration_min, description_md, at_home)
WHERE p.verified = true;

-- Insert sample places cache (mock data for testing)
INSERT INTO places_cache (source, place_id, name, address_jsonb, lat, lng, phone, types) VALUES
('osm', 'hospital_001', 'General Hospital', '{"street": "123 Main St", "city": "Downtown", "state": "CA", "zip": "90210"}', 34.0522, -118.2437, '+1-555-0123', ARRAY['hospital', 'emergency']),
('osm', 'clinic_001', 'Family Health Clinic', '{"street": "456 Oak Ave", "city": "Suburbia", "state": "CA", "zip": "90211"}', 34.0622, -118.2537, '+1-555-0124', ARRAY['clinic', 'family_medicine']),
('osm', 'pharmacy_001', 'City Pharmacy', '{"street": "789 Pine St", "city": "Downtown", "state": "CA", "zip": "90210"}', 34.0422, -118.2337, '+1-555-0125', ARRAY['pharmacy']),
('google', 'urgent_care_001', 'QuickCare Urgent Care', '{"street": "321 Elm St", "city": "Midtown", "state": "CA", "zip": "90212"}', 34.0722, -118.2637, '+1-555-0126', ARRAY['urgent_care', 'walk_in']);

-- Note: In a real application, you would also need to:
-- 1. Create actual user profiles (this requires auth.users to exist first)
-- 2. Create sample addresses linked to users
-- 3. Create sample orders, bookings, etc.
-- 
-- This seed data provides the foundation for testing the application
-- without requiring user authentication to be fully set up first.

