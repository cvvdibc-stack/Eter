-- Migration: Create Account Stash Table
-- Description: Account-wide storage accessible to all characters on the same account
-- Date: 2025-12-07

CREATE TABLE IF NOT EXISTS public.account_stash (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id)
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_account_stash_user_id ON public.account_stash(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.account_stash ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only read their own stash
CREATE POLICY "Users can view their own stash"
    ON public.account_stash
    FOR SELECT
    USING (auth.uid() = user_id);

-- RLS Policy: Users can insert their own stash
CREATE POLICY "Users can create their own stash"
    ON public.account_stash
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can update their own stash
CREATE POLICY "Users can update their own stash"
    ON public.account_stash
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- RLS Policy: Users can delete their own stash
CREATE POLICY "Users can delete their own stash"
    ON public.account_stash
    FOR DELETE
    USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.account_stash TO authenticated;
GRANT ALL ON public.account_stash TO service_role;

-- Add comment
COMMENT ON TABLE public.account_stash IS 'Account-wide item storage accessible to all characters on the same account. Stores up to 96 items (4 pages of 24 slots).';
