-- Fix the function to properly qualify the table reference
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, display_name, role)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', 'User'), 'cashier'::public.user_role);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';