'use client';

import { NextRequest, NextResponse } from 'next/server';
import api from '@/services/apiService';

export async function GET(
  request: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    const paymentId = params.paymentId;
    
    // Call the backend API to check payment status
    const response = await api.get(`/payment/status/${paymentId}`);
    
    // Return the payment status
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error checking payment status:', error);
    return NextResponse.json(
      { error: 'Failed to check payment status' },
      { status: 500 }
    );
  }
}
