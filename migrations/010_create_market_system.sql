-- Create market_listings table
CREATE TABLE IF NOT EXISTS market_listings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    seller_id UUID NOT NULL REFERENCES auth.users(id),
    seller_name TEXT NOT NULL,
    item JSONB NOT NULL,
    price INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Add RLS policies
ALTER TABLE market_listings ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read listings
CREATE POLICY "Anyone can view active listings" 
ON market_listings FOR SELECT 
USING (expires_at > NOW());

-- Policy: Authenticated users can create listings
CREATE POLICY "Users can create listings" 
ON market_listings FOR INSERT 
WITH CHECK (auth.uid() = seller_id);

-- Policy: Sellers can delete their own listings
CREATE POLICY "Users can delete their own listings" 
ON market_listings FOR DELETE 
USING (auth.uid() = seller_id);

-- Policy: Anyone can update (buy) - In a real app, this would be handled by a secure function
-- For MVP, we will use a stored procedure to handle the transaction safely
CREATE OR REPLACE FUNCTION buy_market_item(listing_id UUID, buyer_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    listing_record RECORD;
    buyer_gold INT;
    item_data JSONB;
    seller_uuid UUID;
BEGIN
    -- Get listing info
    SELECT * INTO listing_record FROM market_listings WHERE id = listing_id;
    
    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    seller_uuid := listing_record.seller_id;
    item_data := listing_record.item;

    -- Check buyer gold
    SELECT gold INTO buyer_gold FROM characters WHERE user_id = buyer_id LIMIT 1;
    
    IF buyer_gold < listing_record.price THEN
        RETURN FALSE;
    END IF;

    -- Transaction:
    -- 1. Deduct gold from buyer
    UPDATE characters 
    SET gold = gold - listing_record.price,
        inventory = inventory || item_data
    WHERE user_id = buyer_id;

    -- 2. Add gold to seller (minus 5% tax)
    UPDATE characters 
    SET gold = gold + FLOOR(listing_record.price * 0.95)
    WHERE user_id = seller_uuid;

    -- 3. Remove listing
    DELETE FROM market_listings WHERE id = listing_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

