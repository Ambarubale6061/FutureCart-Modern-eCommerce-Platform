-- Create a trigger to auto-assign admin role for the designated admin email
CREATE OR REPLACE FUNCTION public.auto_assign_admin() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public AS $$ BEGIN IF NEW.email = 'ambarubale3333@gmail.com' THEN
INSERT INTO public.user_roles (user_id, role)
VALUES (NEW.id, 'admin') ON CONFLICT (user_id, role) DO NOTHING;
END IF;
RETURN NEW;
END;
$$;
CREATE TRIGGER auto_assign_admin_trigger
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.auto_assign_admin();