
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

INSERT INTO public.user_roles (user_id, role)
VALUES ('aaf9d874-15e8-44eb-b898-5d6570763df9', 'admin')
ON CONFLICT DO NOTHING;

-- Tighten portfolio write policies to admin only
DROP POLICY IF EXISTS "Authenticated users can manage achievements" ON public.achievements;
CREATE POLICY "Admins can manage achievements" ON public.achievements
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Authenticated users can manage education" ON public.education;
CREATE POLICY "Admins can manage education" ON public.education
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Authenticated users can manage projects" ON public.projects;
CREATE POLICY "Admins can manage projects" ON public.projects
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Authenticated users can manage skills" ON public.skills;
CREATE POLICY "Admins can manage skills" ON public.skills
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Authenticated users can insert profile" ON public.profile;
DROP POLICY IF EXISTS "Authenticated users can update profile" ON public.profile;
CREATE POLICY "Admins can insert profile" ON public.profile
FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update profile" ON public.profile
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete profile" ON public.profile
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Authenticated users can view messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated users can update messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Authenticated users can delete messages" ON public.contact_messages;
CREATE POLICY "Admins can view messages" ON public.contact_messages
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update messages" ON public.contact_messages
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete messages" ON public.contact_messages
FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
