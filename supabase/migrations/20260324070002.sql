-- Add approval_status, seller_name, seller_email to products
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS approval_status text NOT NULL DEFAULT 'approved';
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS seller_name text;
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS seller_email text;
-- Allow anonymous users to insert products with pending status
CREATE POLICY "Anyone can submit products for approval" ON public.products FOR
INSERT TO anon WITH CHECK (approval_status = 'pending');
-- Update the auto_assign_admin function for new admin email
CREATE OR REPLACE FUNCTION public.auto_assign_admin() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public' AS $$ BEGIN IF NEW.email = 'adminfuturecart@gmail.com' THEN
INSERT INTO public.user_roles (user_id, role)
VALUES (NEW.id, 'admin') ON CONFLICT (user_id, role) DO NOTHING;
END IF;
RETURN NEW;
END;
$$;
-- Make sure only approved products show to public (update existing policy)
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
CREATE POLICY "Anyone can view approved products" ON public.products FOR
SELECT TO public USING (
    approval_status = 'approved'
    OR has_role(auth.uid(), 'admin')
  );