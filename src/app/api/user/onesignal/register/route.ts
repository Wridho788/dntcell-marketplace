import { NextRequest, NextResponse } from 'next/server'

/**
 * Register OneSignal Player ID for user
 * POST /api/user/onesignal/register
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, playerId } = body

    // Validate input
    if (!userId || !playerId) {
      return NextResponse.json(
        { error: 'userId and playerId are required' },
        { status: 400 }
      )
    }

    // TODO: Replace with your actual database logic
    // Example using Supabase:
    /*
    const { data, error } = await supabase
      .from('onesignal_devices')
      .upsert({
        user_id: userId,
        player_id: playerId,
        type: 'user',
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'player_id'
      })

    if (error) throw error
    */

    // For now, just log and return success
    console.log('Player ID registration:', { userId, playerId })

    return NextResponse.json({
      success: true,
      message: 'Player ID registered successfully',
      data: {
        userId,
        playerId,
      },
    })
  } catch (error) {
    console.error('Error registering player ID:', error)
    return NextResponse.json(
      { error: 'Failed to register player ID' },
      { status: 500 }
    )
  }
}

/**
 * Get user's registered devices
 * GET /api/user/onesignal/register
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      )
    }

    // TODO: Replace with your actual database logic
    // Example using Supabase:
    /*
    const { data, error } = await supabase
      .from('onesignal_devices')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'user')
      .order('updated_at', { ascending: false })

    if (error) throw error
    */

    return NextResponse.json({
      success: true,
      data: [], // Replace with actual data
    })
  } catch (error) {
    console.error('Error fetching devices:', error)
    return NextResponse.json(
      { error: 'Failed to fetch devices' },
      { status: 500 }
    )
  }
}

/**
 * Delete player ID (e.g., on logout or device removal)
 * DELETE /api/user/onesignal/register
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { playerId } = body

    if (!playerId) {
      return NextResponse.json(
        { error: 'playerId is required' },
        { status: 400 }
      )
    }

    // TODO: Replace with your actual database logic
    // Example using Supabase:
    /*
    const { error } = await supabase
      .from('onesignal_devices')
      .delete()
      .eq('player_id', playerId)

    if (error) throw error
    */

    console.log('Player ID deleted:', playerId)

    return NextResponse.json({
      success: true,
      message: 'Player ID deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting player ID:', error)
    return NextResponse.json(
      { error: 'Failed to delete player ID' },
      { status: 500 }
    )
  }
}
