-- Initial schema for Health SuperApp
-- This migration creates all the core tables with proper relationships and indexes

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create enums
CREATE TYPE user_role AS ENUM ('user', 'admin', 'provider', 'courier');
CREATE TYPE subscription_status AS ENUM ('trial', 'active', 'past_due', 'canceled');
CREATE TYPE payment_provider AS ENUM ('stripe', 'paysera');
CREATE TYPE guide_status AS ENUM ('draft', 'review', 'published');
CREATE TYPE triage_level AS ENUM ('self_care', 'see_doctor', 'urgent');
CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'fulfillment', 'delivered', 'canceled');
CREATE TYPE delivery_type AS ENUM ('standard', 'express');
CREATE TYPE delivery_status AS ENUM ('queued', 'assigned', 'picked_up', 'en_route', 'delivered', 'failed');
CREATE TYPE delivery_provider AS ENUM ('mock', 'glovo', 'uber', 'custom');
CREATE TYPE provider_type AS ENUM ('doctor', 'nurse', 'clinic');
CREATE TYPE booking_status AS ENUM ('requested', 'confirmed', 'in_progress', 'completed', 'canceled');
CREATE TYPE payment_status AS ENUM ('requires_action', 'paid', 'failed');
CREATE TYPE place_source AS ENUM ('osm', 'google');
CREATE TYPE locale_type AS ENUM ('en', 'fr', 'ar');

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    locale locale_type DEFAULT 'en',
    role user_role DEFAULT 'user',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status subscription_status NOT NULL DEFAULT 'trial',
    plan_id TEXT NOT NULL,
    provider payment_provider NOT NULL,
    external_customer_id TEXT,
    external_sub_id TEXT,
    current_period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health guides table
CREATE TABLE health_guides (
    id SERIAL PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title_jsonb JSONB NOT NULL, -- {en: "Title", fr: "Titre", ar: "العنوان"}
    body_md TEXT NOT NULL,
    locale locale_type NOT NULL DEFAULT 'en',
    status guide_status NOT NULL DEFAULT 'draft',
    version INTEGER NOT NULL DEFAULT 1,
    author_id UUID REFERENCES profiles(id),
    reviewer_id UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guide revisions table
CREATE TABLE guide_revisions (
    id SERIAL PRIMARY KEY,
    guide_id INTEGER NOT NULL REFERENCES health_guides(id) ON DELETE CASCADE,
    body_md TEXT NOT NULL,
    version INTEGER NOT NULL,
    editor_id UUID REFERENCES profiles(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Symptom intakes table
CREATE TABLE symptom_intakes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    answers_jsonb JSONB NOT NULL,
    triage triage_level,
    recommended_guide_ids INTEGER[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat sessions table
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    language locale_type DEFAULT 'en'
);

-- Chat messages table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role message_role NOT NULL,
    content TEXT NOT NULL,
    tool_calls_jsonb JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    sku TEXT UNIQUE NOT NULL,
    name_jsonb JSONB NOT NULL, -- {en: "Product Name", fr: "Nom du produit", ar: "اسم المنتج"}
    description_md TEXT,
    price_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    images_jsonb JSONB, -- ["url1", "url2", ...]
    tags TEXT[],
    stock INTEGER NOT NULL DEFAULT 0,
    is_express_eligible BOOLEAN DEFAULT FALSE,
    weight_grams INTEGER,
    dims_cm JSONB, -- {length: 10, width: 5, height: 2}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Addresses table
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    label TEXT,
    line1 TEXT NOT NULL,
    line2 TEXT,
    city TEXT NOT NULL,
    state TEXT,
    postal_code TEXT,
    country TEXT NOT NULL,
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    total_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status order_status NOT NULL DEFAULT 'pending',
    address_id UUID REFERENCES addresses(id),
    delivery_type delivery_type DEFAULT 'standard',
    provider_order_ref TEXT,
    payment_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id),
    qty INTEGER NOT NULL,
    price_cents INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deliveries table
CREATE TABLE deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    status delivery_status NOT NULL DEFAULT 'queued',
    courier_id UUID REFERENCES profiles(id),
    eta TIMESTAMP WITH TIME ZONE,
    tracking_jsonb JSONB,
    provider delivery_provider DEFAULT 'mock',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Providers table
CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_name TEXT NOT NULL,
    type provider_type NOT NULL,
    rating DECIMAL(3, 2) DEFAULT 0.0,
    address_id UUID REFERENCES addresses(id),
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Provider services table
CREATE TABLE provider_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price_cents INTEGER NOT NULL,
    duration_min INTEGER NOT NULL,
    description_md TEXT,
    at_home BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    provider_service_id UUID NOT NULL REFERENCES provider_services(id),
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status booking_status NOT NULL DEFAULT 'requested',
    address_id UUID REFERENCES addresses(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    provider payment_provider NOT NULL,
    external_payment_id TEXT,
    amount_cents INTEGER NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    status payment_status NOT NULL DEFAULT 'requires_action',
    order_id UUID REFERENCES orders(id),
    booking_id UUID REFERENCES bookings(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Places cache table
CREATE TABLE places_cache (
    id SERIAL PRIMARY KEY,
    source place_source NOT NULL,
    place_id TEXT NOT NULL,
    name TEXT NOT NULL,
    address_jsonb JSONB,
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    phone TEXT,
    types TEXT[],
    last_checked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(source, place_id)
);

-- Webhooks table
CREATE TABLE webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider TEXT NOT NULL,
    payload_jsonb JSONB NOT NULL,
    received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_user_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    entity_table TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    diff_jsonb JSONB,
    ip INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_health_guides_slug ON health_guides(slug);
CREATE INDEX idx_health_guides_status ON health_guides(status);
CREATE INDEX idx_health_guides_locale ON health_guides(locale);
CREATE INDEX idx_symptom_intakes_user_id ON symptom_intakes(user_id);
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_tags ON products USING GIN(tags);
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_deliveries_order_id ON deliveries(order_id);
CREATE INDEX idx_deliveries_status ON deliveries(status);
CREATE INDEX idx_providers_type ON providers(type);
CREATE INDEX idx_provider_services_provider_id ON provider_services(provider_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_places_cache_source_place_id ON places_cache(source, place_id);
CREATE INDEX idx_audit_logs_actor_user_id ON audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_table, entity_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_health_guides_updated_at BEFORE UPDATE ON health_guides FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_addresses_updated_at BEFORE UPDATE ON addresses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_deliveries_updated_at BEFORE UPDATE ON deliveries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_provider_services_updated_at BEFORE UPDATE ON provider_services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

