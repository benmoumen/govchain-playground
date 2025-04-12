import { NextRequest } from 'next/server';
import { POST } from '@/app/api/ai/route';

// Mock the AI service
jest.mock('@/services/ai-service', () => ({
  generateResponse: jest.fn().mockResolvedValue({
    text: 'This is a mock AI response',
    sources: []
  })
}));

describe('AI API Route', () => {
  it('returns 400 if request body is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/ai', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  it('returns 200 with AI response for valid request', async () => {
    const request = new NextRequest('http://localhost:3000/api/ai', {
      method: 'POST',
      body: JSON.stringify({
        message: 'Hello AI',
        history: []
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.text).toBe('This is a mock AI response');
    expect(data.sources).toEqual([]);
  });
});
