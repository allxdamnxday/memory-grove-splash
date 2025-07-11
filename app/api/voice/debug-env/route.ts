import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get all environment variables
    const allEnvVars = process.env;
    
    // Filter for MINIMAX-related variables
    const minimaxVars: Record<string, string | undefined> = {};
    const allVarNames: string[] = [];
    
    for (const [key, value] of Object.entries(allEnvVars)) {
      allVarNames.push(key);
      if (key.includes('MINIMAX') || key.includes('minimax')) {
        minimaxVars[key] = value;
      }
    }
    
    // Check specific variations of the MINIMAX_API_KEY
    const variations = {
      'MINIMAX_API_KEY': process.env.MINIMAX_API_KEY,
      'NEXT_PUBLIC_MINIMAX_API_KEY': process.env.NEXT_PUBLIC_MINIMAX_API_KEY,
      'minimax_api_key': process.env.minimax_api_key,
      'MinimaxApiKey': process.env.MinimaxApiKey,
      'MINIMAX_KEY': process.env.MINIMAX_KEY,
      'MINIMAX_API': process.env.MINIMAX_API,
    };
    
    // Check if the value exists but might be empty or malformed
    const minimaxApiKeyInfo = {
      exists: 'MINIMAX_API_KEY' in process.env,
      value: process.env.MINIMAX_API_KEY,
      type: typeof process.env.MINIMAX_API_KEY,
      length: process.env.MINIMAX_API_KEY?.length || 0,
      isEmpty: process.env.MINIMAX_API_KEY === '',
      isUndefined: process.env.MINIMAX_API_KEY === undefined,
      isNull: process.env.MINIMAX_API_KEY === null,
      trimmedLength: process.env.MINIMAX_API_KEY?.trim().length || 0,
      hasWhitespace: process.env.MINIMAX_API_KEY !== process.env.MINIMAX_API_KEY?.trim(),
      firstChars: process.env.MINIMAX_API_KEY?.substring(0, 5) + '...',
      lastChars: '...' + process.env.MINIMAX_API_KEY?.substring((process.env.MINIMAX_API_KEY?.length || 0) - 5),
    };
    
    // Check runtime environment
    const runtimeInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      env: process.env.NODE_ENV,
      isProduction: process.env.NODE_ENV === 'production',
      isDevelopment: process.env.NODE_ENV === 'development',
      isVercel: process.env.VERCEL === '1',
      vercelEnv: process.env.VERCEL_ENV,
      vercelRegion: process.env.VERCEL_REGION,
      vercelUrl: process.env.VERCEL_URL,
    };
    
    // Count total environment variables
    const envStats = {
      totalVars: allVarNames.length,
      publicVars: allVarNames.filter(name => name.startsWith('NEXT_PUBLIC_')).length,
      minimaxVars: Object.keys(minimaxVars).length,
      vercelVars: allVarNames.filter(name => name.startsWith('VERCEL_')).length,
    };
    
    // Check for common issues
    const potentialIssues = [];
    
    if (!minimaxApiKeyInfo.exists) {
      potentialIssues.push('MINIMAX_API_KEY does not exist in process.env');
    }
    
    if (minimaxApiKeyInfo.exists && minimaxApiKeyInfo.isEmpty) {
      potentialIssues.push('MINIMAX_API_KEY exists but is an empty string');
    }
    
    if (minimaxApiKeyInfo.hasWhitespace) {
      potentialIssues.push('MINIMAX_API_KEY contains leading or trailing whitespace');
    }
    
    if (minimaxApiKeyInfo.exists && minimaxApiKeyInfo.value?.includes('\n')) {
      potentialIssues.push('MINIMAX_API_KEY contains newline characters');
    }
    
    if (minimaxApiKeyInfo.exists && minimaxApiKeyInfo.value?.includes('"')) {
      potentialIssues.push('MINIMAX_API_KEY contains quote characters - might be double-quoted');
    }
    
    // Create debug response
    const debugInfo = {
      timestamp: new Date().toISOString(),
      runtime: runtimeInfo,
      envStats,
      minimaxApiKey: minimaxApiKeyInfo,
      variations,
      minimaxRelatedVars: minimaxVars,
      potentialIssues,
      recommendations: [
        'Ensure the environment variable is added in Vercel project settings',
        'Check that the variable name is exactly "MINIMAX_API_KEY" (case-sensitive)',
        'Verify there are no extra spaces or quotes around the value',
        'Try redeploying after adding/updating the environment variable',
        'Check if the variable is set for the correct environment (Production/Preview/Development)',
      ],
    };
    
    return NextResponse.json(debugInfo, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to debug environment variables',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}