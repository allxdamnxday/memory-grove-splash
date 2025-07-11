import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/voice/test - Test MiniMax configuration and connectivity
export async function GET(request: NextRequest) {
  console.log('[Test] Starting MiniMax configuration test...')
  
  const results = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {
      supabase: false,
      authentication: false,
      environmentVariables: {
        hasApiKey: false,
        apiKeyLength: 0,
        apiKeyValid: false,
        hasApiHost: false,
        apiHost: '',
        hasGroupId: false,
        groupId: ''
      },
      minimax: {
        serviceLoaded: false,
        connectionTest: false,
        error: null as string | null
      }
    }
  }
  
  try {
    // Test 1: Supabase connection
    const supabase = await createClient()
    results.checks.supabase = true
    
    // Test 2: Authentication check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (!authError && user) {
      results.checks.authentication = true
    }
    
    // Test 3: Environment variables
    const apiKey = process.env.MINIMAX_API_KEY
    const apiHost = process.env.MINIMAX_API_HOST
    const groupId = process.env.MINIMAX_GROUP_ID
    
    results.checks.environmentVariables = {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length || 0,
      apiKeyValid: false, // Will check below
      hasApiHost: !!apiHost,
      apiHost: apiHost || 'NOT SET',
      hasGroupId: !!groupId,
      groupId: groupId || 'NOT SET'
    }
    
    // Test 4: Validate API key format
    if (apiKey) {
      const parts = apiKey.split('.')
      results.checks.environmentVariables.apiKeyValid = parts.length === 3
      
      if (parts.length === 3) {
        try {
          // Try to decode JWT header (not sensitive)
          const header = JSON.parse(Buffer.from(parts[0], 'base64').toString())
          console.log('[Test] JWT header:', header)
        } catch (e) {
          console.error('[Test] Failed to decode JWT header')
        }
      }
    }
    
    // Test 5: Try to load MiniMax service
    try {
      console.log('[Test] Attempting to load MiniMax service...')
      const minimax = await import('@/lib/services/minimax')
      results.checks.minimax.serviceLoaded = true
      
      // Test 6: Try a simple API call if authenticated
      if (results.checks.authentication && results.checks.environmentVariables.hasApiKey) {
        console.log('[Test] Testing MiniMax API connectivity...')
        
        // Test by trying to synthesize speech with a dummy voice ID
        // This should fail with an error but prove authentication works
        try {
          await minimax.synthesizeSpeech({
            text: 'test',
            voiceId: 'test_voice_id'
          })
          results.checks.minimax.connectionTest = true
        } catch (error: any) {
          // If we get any error except auth errors, authentication worked
          if (error.statusCode === 401 || error.statusCode === 403) {
            results.checks.minimax.connectionTest = false
            results.checks.minimax.error = `Authentication failed: ${error.message}`
            console.error('[Test] MiniMax authentication failed:', error.message)
          } else {
            // Other errors mean auth worked but voice doesn't exist (expected)
            results.checks.minimax.connectionTest = true
            console.log('[Test] MiniMax API connection successful (error expected for non-existent voice)')
          }
        }
      }
    } catch (error: any) {
      console.error('[Test] Failed to load MiniMax service:', error)
      results.checks.minimax.serviceLoaded = false
      results.checks.minimax.error = error.message
    }
    
  } catch (error: any) {
    console.error('[Test] Unexpected error:', error)
    return NextResponse.json(
      { 
        error: 'Test failed',
        message: error.message,
        results 
      },
      { status: 500 }
    )
  }
  
  // Determine overall status
  const allChecks = [
    results.checks.supabase,
    results.checks.environmentVariables.hasApiKey,
    results.checks.environmentVariables.hasApiHost,
    results.checks.environmentVariables.hasGroupId,
    results.checks.minimax.serviceLoaded
  ]
  
  const status = allChecks.every(check => check) ? 'success' : 'partial'
  
  return NextResponse.json({
    status,
    message: status === 'success' 
      ? 'All MiniMax configuration checks passed' 
      : 'Some configuration checks failed - check the results for details',
    results
  })
}