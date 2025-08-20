-- Row Level Security (RLS) Policies for Health SuperApp
-- This migration enables RLS and creates security policies for all tables

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE places_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = user_id AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is provider
CREATE OR REPLACE FUNCTION is_provider(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = user_id AND role = 'provider'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is courier
CREATE OR REPLACE FUNCTION is_courier(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = user_id AND role = 'courier'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert profiles" ON profiles
    FOR INSERT WITH CHECK (is_admin(auth.uid()));

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" ON subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscriptions" ON subscriptions
    FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage all subscriptions" ON subscriptions
    FOR ALL USING (is_admin(auth.uid()));

-- Health guides policies
CREATE POLICY "Anyone can read published guides" ON health_guides
    FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage all guides" ON health_guides
    FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Authors can view their own guides" ON health_guides
    FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Authors can update their own draft guides" ON health_guides
    FOR UPDATE USING (auth.uid() = author_id AND status = 'draft');

-- Guide revisions policies
CREATE POLICY "Admins can manage all guide revisions" ON guide_revisions
    FOR ALL USING (is_admin(auth.uid()));

CREATE POLICY "Editors can view revisions of their guides" ON guide_revisions
    FOR SELECT USING (auth.uid() = editor_id);

-- Symptom intakes policies
CREATE POLICY "Users can view their own symptom intakes" ON symptom_intakes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own symptom intakes" ON symptom_intakes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all symptom intakes" ON symptom_intakes
    FOR SELECT USING (is_admin(auth.uid()));

-- Chat sessions policies
CREATE POLICY "Users can view their own chat sessions" ON chat_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat sessions" ON chat_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat sessions" ON chat_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all chat sessions" ON chat_sessions
    FOR SELECT USING (is_admin(auth.uid()));

-- Chat messages policies
CREATE POLICY "Users can view messages from their own sessions" ON chat_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM chat_sessions 
            WHERE id = session_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages to their own sessions" ON chat_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM chat_sessions 
            WHERE id = session_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all chat messages" ON chat_messages
    FOR SELECT USING (is_admin(auth.uid()));

-- Products policies (public read, admin write)
CREATE POLICY "Anyone can view products" ON products
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage products" ON products
    FOR ALL USING (is_admin(auth.uid()));

-- Addresses policies
CREATE POLICY "Users can view their own addresses" ON addresses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own addresses" ON addresses
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all addresses" ON addresses
    FOR SELECT USING (is_admin(auth.uid()));

-- Orders policies
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON orders
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON orders
    FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage all orders" ON orders
    FOR ALL USING (is_admin(auth.uid()));

-- Order items policies
CREATE POLICY "Users can view items from their own orders" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE id = order_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert items to their own orders" ON order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE id = order_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can view all order items" ON order_items
    FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage all order items" ON order_items
    FOR ALL USING (is_admin(auth.uid()));

-- Deliveries policies
CREATE POLICY "Users can view deliveries for their orders" ON deliveries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE id = order_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Couriers can view their assigned deliveries" ON deliveries
    FOR SELECT USING (is_courier(auth.uid()) AND auth.uid() = courier_id);

CREATE POLICY "Couriers can update their assigned deliveries" ON deliveries
    FOR UPDATE USING (is_courier(auth.uid()) AND auth.uid() = courier_id);

CREATE POLICY "Admins can manage all deliveries" ON deliveries
    FOR ALL USING (is_admin(auth.uid()));

-- Providers policies
CREATE POLICY "Anyone can view verified providers" ON providers
    FOR SELECT USING (verified = true);

CREATE POLICY "Providers can view their own profile" ON providers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'provider'
        )
    );

CREATE POLICY "Admins can manage all providers" ON providers
    FOR ALL USING (is_admin(auth.uid()));

-- Provider services policies
CREATE POLICY "Anyone can view services from verified providers" ON provider_services
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM providers 
            WHERE id = provider_id AND verified = true
        )
    );

CREATE POLICY "Providers can manage their own services" ON provider_services
    FOR ALL USING (
        is_provider(auth.uid()) AND 
        EXISTS (
            SELECT 1 FROM providers p
            JOIN profiles pr ON pr.id = auth.uid()
            WHERE p.id = provider_id AND pr.role = 'provider'
        )
    );

CREATE POLICY "Admins can manage all provider services" ON provider_services
    FOR ALL USING (is_admin(auth.uid()));

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own bookings" ON bookings
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Providers can view bookings for their services" ON bookings
    FOR SELECT USING (
        is_provider(auth.uid()) AND
        EXISTS (
            SELECT 1 FROM provider_services ps
            JOIN providers p ON p.id = ps.provider_id
            JOIN profiles pr ON pr.id = auth.uid()
            WHERE ps.id = provider_service_id AND pr.role = 'provider'
        )
    );

CREATE POLICY "Providers can update bookings for their services" ON bookings
    FOR UPDATE USING (
        is_provider(auth.uid()) AND
        EXISTS (
            SELECT 1 FROM provider_services ps
            JOIN providers p ON p.id = ps.provider_id
            JOIN profiles pr ON pr.id = auth.uid()
            WHERE ps.id = provider_service_id AND pr.role = 'provider'
        )
    );

CREATE POLICY "Admins can manage all bookings" ON bookings
    FOR ALL USING (is_admin(auth.uid()));

-- Payments policies
CREATE POLICY "Users can view their own payments" ON payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payments" ON payments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments" ON payments
    FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage all payments" ON payments
    FOR ALL USING (is_admin(auth.uid()));

-- Places cache policies (public read, admin write)
CREATE POLICY "Anyone can view places cache" ON places_cache
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage places cache" ON places_cache
    FOR ALL USING (is_admin(auth.uid()));

-- Webhooks policies (admin only)
CREATE POLICY "Admins can manage webhooks" ON webhooks
    FOR ALL USING (is_admin(auth.uid()));

-- Audit logs policies (admin read only)
CREATE POLICY "Admins can view audit logs" ON audit_logs
    FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "System can insert audit logs" ON audit_logs
    FOR INSERT WITH CHECK (true); -- Allow system to insert audit logs

