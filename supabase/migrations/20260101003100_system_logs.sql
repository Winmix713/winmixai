-- Create system_logs table for system-level logging
CREATE TABLE IF NOT EXISTS public.system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL CHECK (level IN ('debug', 'info', 'warning', 'error', 'critical')),
  message TEXT NOT NULL,
  context JSONB DEFAULT '{}'::jsonb,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS system_logs_level_idx ON public.system_logs(level);
CREATE INDEX IF NOT EXISTS system_logs_created_at_idx ON public.system_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS system_logs_source_idx ON public.system_logs(source);

-- Enable RLS
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Service role can insert logs
CREATE POLICY "Service can insert system logs" ON public.system_logs
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Admins can view all logs
CREATE POLICY "Admins can view system logs" ON public.system_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE user_profiles.user_id = auth.uid() 
      AND user_profiles.role = 'admin'
    )
  );

-- Service role can view all logs
CREATE POLICY "Service can view system logs" ON public.system_logs
  FOR SELECT USING (auth.role() = 'service_role');

COMMENT ON TABLE public.system_logs IS 'System-level logging for operational events and errors.';
COMMENT ON COLUMN public.system_logs.level IS 'Log level: debug, info, warning, error, critical';
COMMENT ON COLUMN public.system_logs.message IS 'Human-readable log message';
COMMENT ON COLUMN public.system_logs.context IS 'Additional structured data about the event';
COMMENT ON COLUMN public.system_logs.source IS 'Source component or service that generated the log';