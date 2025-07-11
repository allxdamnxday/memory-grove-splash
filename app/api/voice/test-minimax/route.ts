import { NextRequest, NextResponse } from 'next/server'

// GET /api/voice/test-minimax - Direct test of MiniMax API
export async function GET(request: NextRequest) {
  console.log('[TestMiniMax] Starting direct MiniMax API test...')
  
  const results = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    envCheck: {
      hasApiKey: !!process.env.MINIMAX_API_KEY,
      hasApiHost: !!process.env.MINIMAX_API_HOST,
      hasGroupId: !!process.env.MINIMAX_GROUP_ID,
    },
    apiTest: {
      attempted: false,
      success: false,
      response: null as any,
      error: null as any
    }
  }
  
  // Only proceed if all env vars are present
  if (!results.envCheck.hasApiKey || !results.envCheck.hasApiHost || !results.envCheck.hasGroupId) {
    return NextResponse.json({
      error: 'Missing environment variables',
      results
    }, { status: 500 })
  }
  
  // Test direct API call to MiniMax
  try {
    results.apiTest.attempted = true
    
    // Try a simple endpoint that should work with just authentication
    const url = `${process.env.MINIMAX_API_HOST}/v1/voice_clone/status/test_voice_id?GroupId=${process.env.MINIMAX_GROUP_ID}`
    
    console.log('[TestMiniMax] Making request to:', url)
    console.log('[TestMiniMax] Using API key length:', process.env.MINIMAX_API_KEY?.length)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    
    const responseText = await response.text()
    console.log('[TestMiniMax] Response status:', response.status)
    console.log('[TestMiniMax] Response text:', responseText)
    
    let responseData: any
    try {
      responseData = JSON.parse(responseText)
    } catch (e) {
      responseData = { rawText: responseText }
    }
    
    results.apiTest.response = {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data: responseData
    }
    
    // Even a 404 means auth worked (voice doesn't exist)
    if (response.status === 404) {
      results.apiTest.success = true
      results.apiTest.error = 'Authentication successful! (404 is expected for non-existent voice)'
    } else if (response.status === 401 || response.status === 403) {
      results.apiTest.success = false
      results.apiTest.error = `Authentication failed: ${responseData.message || responseData.error || 'Invalid API key'}`
    } else if (response.ok) {
      results.apiTest.success = true
    } else {
      results.apiTest.success = false
      results.apiTest.error = responseData.message || responseData.error || 'Unknown error'
    }
    
  } catch (error: any) {
    console.error('[TestMiniMax] Error:', error)
    results.apiTest.error = error.message
  }
  
  return NextResponse.json(results, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  })
}