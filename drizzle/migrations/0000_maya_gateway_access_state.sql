CREATE TABLE public.maya_gateway_access_state (surface text PRIMARY KEY, status integer NOT NULL, message text NOT NULL, updated_at timestamptz NOT NULL DEFAULT now());
GRANT ALL ON public.maya_gateway_access_state TO service_role;
ALTER TABLE public.maya_gateway_access_state ENABLE ROW LEVEL SECURITY;