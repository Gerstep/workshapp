import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const workshopId = searchParams.get('workshopId');

  if (!workshopId) {
    return NextResponse.json({ error: 'Workshop ID is required' }, { status: 400 });
  }

  try {
    const questions = await prisma.question.findMany({
      where: { workshopId: parseInt(workshopId) },
      include: { answers: true },
    });
    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching insights:', error);
    return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 });
  }
}