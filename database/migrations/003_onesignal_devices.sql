-- OneSignal Devices Table for User App
-- This table stores player IDs (device tokens) for push notifications

CREATE TABLE IF NOT EXISTS onesignal_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  player_id VARCHAR(255) NOT NULL UNIQUE,
  type VARCHAR(20) NOT NULL DEFAULT 'user', -- 'user' or 'admin'
  device_info JSONB DEFAULT '{}', -- Store device metadata (browser, OS, etc.)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_onesignal_devices_user_id ON onesignal_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_onesignal_devices_player_id ON onesignal_devices(player_id);
CREATE INDEX IF NOT EXISTS idx_onesignal_devices_type ON onesignal_devices(type);
CREATE INDEX IF NOT EXISTS idx_onesignal_devices_is_active ON onesignal_devices(is_active);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_onesignal_devices_updated_at
  BEFORE UPDATE ON onesignal_devices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE onesignal_devices ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own devices
CREATE POLICY "Users can view own devices"
  ON onesignal_devices
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own devices
CREATE POLICY "Users can insert own devices"
  ON onesignal_devices
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own devices
CREATE POLICY "Users can update own devices"
  ON onesignal_devices
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own devices
CREATE POLICY "Users can delete own devices"
  ON onesignal_devices
  FOR DELETE
  USING (auth.uid() = user_id);

-- Admin policies (assuming you have an admin role)
CREATE POLICY "Admins can view all devices"
  ON onesignal_devices
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Comments
COMMENT ON TABLE onesignal_devices IS 'Stores OneSignal player IDs for push notifications';
COMMENT ON COLUMN onesignal_devices.user_id IS 'Reference to the user who owns this device';
COMMENT ON COLUMN onesignal_devices.player_id IS 'OneSignal player/subscription ID (unique per device)';
COMMENT ON COLUMN onesignal_devices.type IS 'Device type: user or admin';
COMMENT ON COLUMN onesignal_devices.device_info IS 'Additional device metadata in JSON format';
COMMENT ON COLUMN onesignal_devices.is_active IS 'Whether this device is actively subscribed to notifications';
