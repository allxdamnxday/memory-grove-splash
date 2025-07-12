import { NextRequest, NextResponse } from 'next/server'

// GET /api/voice/test-minimax - Direct test of MiniMax API
export async function GET(request: NextRequest) {
  return testVoiceCloneStatus()
}

// POST /api/voice/test-minimax - Test T2A v2 synthesis
export async function POST(request: NextRequest) {
  return testT2ASynthesis()
}

async function testVoiceCloneStatus() {
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

async function testT2ASynthesis() {
  console.log('[TestMiniMax] Starting T2A v2 synthesis test...')
  
  const results = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    envCheck: {
      hasApiKey: !!process.env.MINIMAX_API_KEY,
      hasApiHost: !!process.env.MINIMAX_API_HOST,
      hasGroupId: !!process.env.MINIMAX_GROUP_ID,
    },
    synthesisTest: {
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
  
  // Test T2A v2 synthesis
  try {
    results.synthesisTest.attempted = true
    
    const url = `${process.env.MINIMAX_API_HOST}/v1/t2a_v2?GroupId=${process.env.MINIMAX_GROUP_ID}`
    
    const testBody = {
      model: 'speech-01-turbo',
      text: 'Hello, this is a test of the MiniMax text to speech API.',
      stream: false,
      voice_setting: {
        voice_id: 'male-qn-qingse',  // Default voice for testing
        speed: 1.0,
        vol: 1.0,
        pitch: 0
      },
      audio_setting: {
        sample_rate: 32000,
        bitrate: 128000,
        format: 'mp3',
        channel: 1
      }
    }
    
    console.log('[TestMiniMax] Making T2A v2 request to:', url)
    console.log('[TestMiniMax] Request body:', JSON.stringify(testBody, null, 2))
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testBody)
    })
    
    const responseText = await response.text()
    console.log('[TestMiniMax] Response status:', response.status)
    console.log('[TestMiniMax] Response text (first 200 chars):', responseText.substring(0, 200))
    
    let responseData: any
    try {
      responseData = JSON.parse(responseText)
    } catch (e) {
      responseData = { rawText: responseText }
    }
    
    results.synthesisTest.response = {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data: responseData,
      hasAudioData: responseData.data?.audio ? responseData.data.audio.length > 0 : false
    }
    
    if (response.ok && responseData.base_resp?.status_code === 0) {
      results.synthesisTest.success = true
      results.synthesisTest.error = 'T2A v2 synthesis successful!'
    } else if (response.status === 401 || response.status === 403) {
      results.synthesisTest.success = false
      results.synthesisTest.error = `Authentication failed: ${responseData.message || responseData.error || 'Invalid API key'}`
    } else {
      results.synthesisTest.success = false
      results.synthesisTest.error = responseData.base_resp?.status_msg || responseData.message || responseData.error || 'Unknown error'
    }
    
  } catch (error: any) {
    console.error('[TestMiniMax] T2A v2 Error:', error)
    results.synthesisTest.error = error.message
  }
  
  return NextResponse.json(results, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  })
}