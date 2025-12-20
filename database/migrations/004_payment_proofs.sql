-- Create payment_proofs table
CREATE TABLE IF NOT EXISTS payment_proofs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_proofs_order_id ON payment_proofs(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_proofs_created_at ON payment_proofs(created_at DESC);

-- RLS Policies
ALTER TABLE payment_proofs ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment proofs (as buyer or seller)
CREATE POLICY "Users can view payment proofs for their orders"
  ON payment_proofs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = payment_proofs.order_id 
      AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid())
    )
  );

-- Buyers can upload payment proofs for their orders
CREATE POLICY "Buyers can upload payment proofs"
  ON payment_proofs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = payment_proofs.order_id 
      AND orders.buyer_id = auth.uid()
      AND orders.order_status IN ('waiting_payment')
    )
  );

-- Only admins can delete payment proofs
CREATE POLICY "Admins can delete payment proofs"
  ON payment_proofs FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
