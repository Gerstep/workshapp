import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const { content, questionId } = await req.json();
  
  try {
    const answer = await prisma.answer.create({
      data: { content, questionId },
    });
    
    return NextResponse.json(answer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create answer' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const questionId = searchParams.get('questionId');

  if (!questionId) {
    return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
  }

  try {
    const answers = await prisma.answer.findMany({
      where: { questionId: parseInt(questionId) },
    });
    return NextResponse.json(answers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch answers' }, { status: 500 });
  }
}