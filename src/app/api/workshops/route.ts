import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  const { title } = await req.json();
  
  try {
    const workshop = await prisma.workshop.create({
      data: { title },
    });
    
    return NextResponse.json(workshop);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create workshop' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const workshops = await prisma.workshop.findMany();
    return NextResponse.json(workshops);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch workshops' }, { status: 500 });
  }
}