import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const { content, workshopId } = await req.json();
  
  try {
    const question = await prisma.question.create({
      data: { content, workshopId },
    });
    
    return NextResponse.json(question);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const workshopId = searchParams.get('workshopId');

  if (!workshopId) {
    return NextResponse.json({ error: 'Workshop ID is required' }, { status: 400 });
  }

  try {
    const questions = await prisma.question.findMany({
      where: { workshopId: parseInt(workshopId) },
    });
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
  }
}