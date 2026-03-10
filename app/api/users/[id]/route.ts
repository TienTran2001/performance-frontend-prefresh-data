import { NextRequest, NextResponse } from 'next/server';

// Fake user database
const USERS_DB: Record<
  string,
  {
    id: string;
    name: string;
    email: string;
    bio: string;
    avatar: string;
    joinedDate: string;
  }
> = {
  john: {
    id: 'john',
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Full-stack developer passionate about web technologies and open source. Love building scalable applications with modern frameworks.',
    avatar: '👨‍💻',
    joinedDate: '2024-01-15',
  },
  jane: {
    id: 'jane',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    bio: 'UI/UX Designer & Frontend Developer. Creating beautiful and intuitive user experiences. Coffee enthusiast ☕',
    avatar: '👩‍🎨',
    joinedDate: '2024-02-20',
  },
  alice: {
    id: 'alice',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    bio: 'DevOps Engineer & Cloud Architect. Automating everything! Kubernetes, Docker, CI/CD. Always learning new things.',
    avatar: '👩‍💼',
    joinedDate: '2024-03-10',
  },
  bob: {
    id: 'bob',
    name: 'Bob Williams',
    email: 'bob.williams@example.com',
    bio: 'Mobile Developer (iOS & Android). Building native and cross-platform apps. React Native, Swift, Kotlin.',
    avatar: '👨‍🔧',
    joinedDate: '2024-04-05',
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Log để track API calls
  console.log(`[API] 👥 Fetching user: ${id}`);

  // Simulate slow API (1.5s delay)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Check if user exists
  const user = USERS_DB[id.toLowerCase()];

  if (!user) {
    console.log(`[API] ❌ User not found: ${id}`);
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  console.log(`[API] ✅ User ${id} fetched at ${new Date().toISOString()}`);

  return NextResponse.json(user);
}
