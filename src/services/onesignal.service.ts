import { logger } from '@/lib/utils/logger'

/**
 * OneSignal Integration Service
 * Handles notification registration with retry and error handling
 */

interface OneSignalConfig {
  appId: string
  userId?: string
}

class OneSignalService {
  private isInitialized: boolean = false
  private playerId: string | null = null
  private retryAttempts: number = 0
  private maxRetries: number = 3
  private retryDelay: number = 2000

  /**
   * Initialize OneSignal
   */
  async initialize(config: OneSignalConfig): Promise<void> {
    if (typeof window === 'undefined') return
    if (this.isInitialized) return

    try {
      // Check if OneSignal is available
      if (!window.OneSignal) {
        logger.warn('OneSignal SDK not loaded', { feature: 'onesignal' })
        return
      }

      logger.info('Initializing OneSignal', { feature: 'onesignal' })

      await window.OneSignal.init({
        appId: config.appId,
        allowLocalhostAsSecureOrigin: true,
        notifyButton: {
          enable: false,
        },
      })

      this.isInitialized = true
      logger.info('OneSignal initialized successfully', { feature: 'onesignal' })

      // Register user if userId provided
      if (config.userId) {
        await this.registerUser(config.userId)
      }
    } catch (error) {
      logger.error('OneSignal initialization failed', error, { feature: 'onesignal' })
      // Soft fail - don't block app
    }
  }

  /**
   * Register user and get player ID
   */
  async registerUser(userId: string): Promise<string | null> {
    if (!this.isInitialized || !window.OneSignal) {
      logger.warn('OneSignal not initialized, cannot register user', { 
        feature: 'onesignal' 
      })
      return null
    }

    try {
      // Set external user ID
      await window.OneSignal.setExternalUserId(userId)
      
      // Get player ID
      const playerId = await window.OneSignal.getUserId()
      
      if (playerId) {
        this.playerId = playerId
        this.storePlayerId(playerId)
        
        logger.info('User registered with OneSignal', {
          feature: 'onesignal',
          metadata: { userId, playerId }
        })
        
        return playerId
      }

      return null
    } catch (error) {
      logger.error('Failed to register user with OneSignal', error, {
        feature: 'onesignal',
        metadata: { userId }
      })

      // Retry if not exceeded max attempts
      if (this.retryAttempts < this.maxRetries) {
        this.retryAttempts++
        logger.info(`Retrying OneSignal registration (${this.retryAttempts}/${this.maxRetries})`, {
          feature: 'onesignal'
        })
        
        await this.delay(this.retryDelay)
        return this.registerUser(userId)
      }

      return null
    }
  }

  /**
   * Request notification permission
   */
  async requestPermission(): Promise<boolean> {
    if (!this.isInitialized || !window.OneSignal) {
      logger.warn('OneSignal not initialized, cannot request permission', {
        feature: 'onesignal'
      })
      return false
    }

    try {
      const permission = await window.OneSignal.isPushNotificationsEnabled()
      
      if (!permission) {
        await window.OneSignal.showNativePrompt()
      }

      const enabled = await window.OneSignal.isPushNotificationsEnabled()
      
      logger.info('Notification permission status', {
        feature: 'onesignal',
        metadata: { enabled }
      })

      return enabled
    } catch (error) {
      logger.error('Failed to request notification permission', error, {
        feature: 'onesignal'
      })
      return false
    }
  }

  /**
   * Get current player ID
   */
  getPlayerId(): string | null {
    if (this.playerId) return this.playerId
    
    // Try to get from storage
    return this.getStoredPlayerId()
  }

  /**
   * Check if notifications are enabled
   */
  async isEnabled(): Promise<boolean> {
    if (!this.isInitialized || !window.OneSignal) return false

    try {
      return await window.OneSignal.isPushNotificationsEnabled()
    } catch {
      return false
    }
  }

  /**
   * Unregister user
   */
  async unregisterUser(): Promise<void> {
    if (!this.isInitialized || !window.OneSignal) return

    try {
      await window.OneSignal.removeExternalUserId()
      this.playerId = null
      this.removeStoredPlayerId()
      
      logger.info('User unregistered from OneSignal', { feature: 'onesignal' })
    } catch (error) {
      logger.error('Failed to unregister user from OneSignal', error, {
        feature: 'onesignal'
      })
    }
  }

  /**
   * Store player ID locally
   */
  private storePlayerId(playerId: string): void {
    try {
      localStorage.setItem('onesignal_player_id', playerId)
    } catch {
      // Ignore storage errors
    }
  }

  /**
   * Get stored player ID
   */
  private getStoredPlayerId(): string | null {
    try {
      return localStorage.getItem('onesignal_player_id')
    } catch {
      return null
    }
  }

  /**
   * Remove stored player ID
   */
  private removeStoredPlayerId(): void {
    try {
      localStorage.removeItem('onesignal_player_id')
    } catch {
      // Ignore storage errors
    }
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Reset retry counter
   */
  resetRetries(): void {
    this.retryAttempts = 0
  }
}

// Export singleton instance
export const oneSignalService = new OneSignalService()
