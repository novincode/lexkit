import { NextRequest, NextResponse } from 'next/server'
import { loadExampleCode } from '../../../../lib/code-loader'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ exampleName: string }> }
) {
  try {
    const { exampleName } = await params
    const code = await loadExampleCode(exampleName)

    return NextResponse.json({
      success: true,
      data: code
    })
  } catch (error) {
    console.error('Failed to load example code:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load example code'
      },
      { status: 500 }
    )
  }
}
