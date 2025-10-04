-- Create enum for roles
CREATE TYPE public.app_role AS ENUM (
  'learner',
  'manager', 
  'training_admin',
  'computer_admin',
  'hr_admin',
  'auditor',
  'super_admin'
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
ON public.profiles FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create organizational_units table
CREATE TABLE public.organizational_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  parent_id UUID REFERENCES public.organizational_units(id) ON DELETE CASCADE,
  code TEXT UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.organizational_units ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view organizational units"
ON public.organizational_units FOR SELECT
USING (true);

CREATE POLICY "HR admins can manage organizational units"
ON public.organizational_units FOR ALL
USING (public.has_role(auth.uid(), 'hr_admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Create trainings table
CREATE TABLE public.trainings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  duration_hours INTEGER,
  provider TEXT,
  cost NUMERIC(10,2),
  status TEXT DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.trainings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active trainings"
ON public.trainings FOR SELECT
USING (status = 'active' OR public.has_role(auth.uid(), 'training_admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Training admins can manage trainings"
ON public.trainings FOR ALL
USING (public.has_role(auth.uid(), 'training_admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Create training_sessions table
CREATE TABLE public.training_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_id UUID REFERENCES public.trainings(id) ON DELETE CASCADE NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  max_participants INTEGER,
  instructor TEXT,
  status TEXT DEFAULT 'scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.training_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view training sessions"
ON public.training_sessions FOR SELECT
USING (true);

CREATE POLICY "Training admins can manage sessions"
ON public.training_sessions FOR ALL
USING (public.has_role(auth.uid(), 'training_admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Create requests table
CREATE TABLE public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  training_id UUID REFERENCES public.trainings(id) NOT NULL,
  session_id UUID REFERENCES public.training_sessions(id),
  status TEXT DEFAULT 'draft',
  justification TEXT,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own requests"
ON public.requests FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'hr_admin') OR public.has_role(auth.uid(), 'auditor') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Users can create own requests"
ON public.requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own draft requests"
ON public.requests FOR UPDATE
USING (auth.uid() = user_id AND status = 'draft');

-- Create approval_steps table
CREATE TABLE public.approval_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE NOT NULL,
  approver_id UUID REFERENCES auth.users(id),
  step_order INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  comments TEXT,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.approval_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view approval steps for their requests"
ON public.approval_steps FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.requests 
    WHERE requests.id = approval_steps.request_id 
    AND (requests.user_id = auth.uid() OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'hr_admin') OR public.has_role(auth.uid(), 'auditor'))
  )
);

CREATE POLICY "Managers can update approval steps"
ON public.approval_steps FOR ALL
USING (public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'hr_admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Create comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view comments on their requests"
ON public.comments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.requests 
    WHERE requests.id = comments.request_id 
    AND (requests.user_id = auth.uid() OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'hr_admin') OR public.has_role(auth.uid(), 'auditor'))
  )
);

CREATE POLICY "Users can create comments"
ON public.comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create attachments table
CREATE TABLE public.attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view attachments on their requests"
ON public.attachments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.requests 
    WHERE requests.id = attachments.request_id 
    AND (requests.user_id = auth.uid() OR public.has_role(auth.uid(), 'manager') OR public.has_role(auth.uid(), 'hr_admin') OR public.has_role(auth.uid(), 'auditor'))
  )
);

CREATE POLICY "Users can upload attachments"
ON public.attachments FOR INSERT
WITH CHECK (auth.uid() = uploaded_by);

-- Create computer_assets table
CREATE TABLE public.computer_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  version TEXT,
  license_required BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'available',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.computer_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view computer assets"
ON public.computer_assets FOR SELECT
USING (true);

CREATE POLICY "Computer admins can manage assets"
ON public.computer_assets FOR ALL
USING (public.has_role(auth.uid(), 'computer_admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Create work_orders table
CREATE TABLE public.work_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.requests(id),
  asset_id UUID REFERENCES public.computer_assets(id),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  assigned_to UUID REFERENCES auth.users(id),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view work orders"
ON public.work_orders FOR SELECT
USING (auth.uid() = user_id OR auth.uid() = assigned_to OR public.has_role(auth.uid(), 'computer_admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Computer admins can manage work orders"
ON public.work_orders FOR ALL
USING (public.has_role(auth.uid(), 'computer_admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Create cohorts table
CREATE TABLE public.cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.cohorts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view cohorts"
ON public.cohorts FOR SELECT
USING (true);

CREATE POLICY "Training admins can manage cohorts"
ON public.cohorts FOR ALL
USING (public.has_role(auth.uid(), 'training_admin') OR public.has_role(auth.uid(), 'hr_admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Create cohort_members table
CREATE TABLE public.cohort_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID REFERENCES public.cohorts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(cohort_id, user_id)
);

ALTER TABLE public.cohort_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view cohort members"
ON public.cohort_members FOR SELECT
USING (true);

CREATE POLICY "Training admins can manage cohort members"
ON public.cohort_members FOR ALL
USING (public.has_role(auth.uid(), 'training_admin') OR public.has_role(auth.uid(), 'hr_admin') OR public.has_role(auth.uid(), 'super_admin'));

-- Create communities table
CREATE TABLE public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_private BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view public communities"
ON public.communities FOR SELECT
USING (is_private = false OR auth.uid() = created_by);

CREATE POLICY "Users can create communities"
ON public.communities FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Auditors can view audit logs"
ON public.audit_logs FOR SELECT
USING (public.has_role(auth.uid(), 'auditor') OR public.has_role(auth.uid(), 'super_admin'));

-- Create trigger for updating updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trainings_updated_at
BEFORE UPDATE ON public.trainings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_training_sessions_updated_at
BEFORE UPDATE ON public.training_sessions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_requests_updated_at
BEFORE UPDATE ON public.requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email
  );
  
  -- Assign default learner role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'learner');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();