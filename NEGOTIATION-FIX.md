# Negotiation API Fix - User Authentication

## Problem
When creating a negotiation, the `user_id` was `null` in the database, causing a constraint violation:
```
null value in column "user_id" of relation "negotiations" violates not-null constraint
```

## Root Cause
The application was calling Supabase REST API directly (`/rest/v1/negotiations`), which:
- Bypassed proper authentication handling
- Did not automatically populate `user_id` from the authenticated session
- Left `user_id` as `null` in the database

## Solution
Created a proper backend API endpoint that:
1. **Authenticates the user** using JWT token
2. **Validates the request** (product availability, price range, etc.)
3. **Inserts negotiation** with the authenticated `user_id`

### Files Changed

#### 1. Created API Authentication Helper
**File:** `src/lib/api/auth-helpers.ts`
- `getAuthUser()` - Extracts and verifies JWT token from Authorization header
- `requireAuth()` - Requires authentication, throws error if not authenticated
- `supabaseAdmin` - Admin client for server-side database operations

#### 2. Created Negotiations API Endpoint
**File:** `src/app/api/negotiations/route.ts`
- `POST /api/negotiations` - Creates negotiation with proper authentication
- Validates user authentication
- Checks product availability and negotiability
- Validates price range
- Checks for existing active negotiations
- Inserts negotiation with `user_id` from authenticated session

#### 3. Updated Negotiation Service
**File:** `src/services/negotiation.service.ts`
```typescript
// Before (Direct Supabase REST API):
await axiosClient.post<Negotiation>('/negotiations', payload)

// After (Next.js API Route):
await axiosClient.post<{ success: boolean; data: Negotiation }>('/api/negotiations', payload)
```

#### 4. Updated Axios Client
**File:** `src/libs/axios/axiosClient.ts`
- Supports both Next.js API routes (`/api/*`) and Supabase REST API
- Automatically detects request type and sets appropriate base URL
- Retrieves auth token from Zustand store (`dntcell-auth-storage`)
- Sends Authorization header with Bearer token

#### 5. Updated Error Handling
**File:** `src/components/negotiation/negotiation-modal.tsx`
- Handles new API response format
- Shows appropriate error messages for different scenarios

#### 6. Updated Environment Variables
**File:** `.env.example`
- Added `SUPABASE_SERVICE_ROLE_KEY` requirement
- Added warning about keeping it secret

## How It Works Now

### Flow:
```
1. User clicks "Kirim Penawaran"
   ↓
2. Frontend calls POST /api/negotiations
   with Authorization: Bearer <jwt_token>
   ↓
3. API route validates JWT token
   ↓
4. API route gets user.id from token
   ↓
5. API route validates:
   - Product exists and is available
   - Product is negotiable
   - Price is within valid range
   - No existing active negotiation
   ↓
6. API route inserts negotiation with:
   - user_id: <from JWT>
   - product_id, offer_price, note, etc.
   ↓
7. Returns created negotiation
   ↓
8. Frontend redirects to /negotiations/{id}
```

### Security Benefits:
✅ **User ID cannot be faked** - extracted from verified JWT token  
✅ **Proper authentication** - rejects unauthenticated requests  
✅ **Server-side validation** - all business logic on backend  
✅ **RLS still works** - Supabase Row Level Security as additional layer  

## Required Environment Variable

Add to your `.env` file:
```env
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**⚠️ Important:** 
- Get this from Supabase Dashboard → Settings → API
- NEVER commit this to version control
- NEVER expose this to the client
- Only used in API routes (server-side)

## Testing

1. Ensure you're logged in
2. Try creating a negotiation on any product
3. Check database - `user_id` should now be populated correctly
4. Negotiation should be created successfully

## Migration Path

This is **Option 1** from the recommended solutions - using proper API routes with server-side authentication. This approach is:
- ✅ Most secure
- ✅ Production-ready
- ✅ Scalable
- ✅ Easy to maintain

Future endpoints (orders, notifications, etc.) should follow this same pattern.
