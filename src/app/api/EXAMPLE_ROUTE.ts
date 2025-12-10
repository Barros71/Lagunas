// Exemplo de API Route para ser usado como template
// Este arquivo deve ser deletado e os endpoints reais devem ser implementados

import { NextRequest, NextResponse } from 'next/server';
import type { Appointment } from '@/types/api';

/**
 * GET /api/appointments?date=YYYY-MM-DD
 * Retorna agendamentos da data especificada
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    // TODO: Implementar query no Prisma
    // const appointments = await prisma.appointment.findMany({
    //   where: date ? { date: new Date(date) } : undefined,
    //   orderBy: { time: 'asc' },
    // });

    // Mock data para teste
    const mockData: Appointment[] = [];

    return NextResponse.json({
      success: true,
      data: mockData,
    });
  } catch (error) {
    console.error('Erro ao buscar agendamentos:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar agendamentos' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/appointments
 * Cria um novo agendamento
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: Validar com Zod
    // TODO: Implementar create no Prisma
    // const appointment = await prisma.appointment.create({
    //   data: body,
    // });

    return NextResponse.json(
      {
        success: true,
        data: { id: 'mock-id', ...body },
        message: 'Agendamento criado com sucesso',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar agendamento:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao criar agendamento' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/appointments/[id]
 * Atualiza um agendamento
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    // TODO: Validar com Zod
    // TODO: Implementar update no Prisma
    // const appointment = await prisma.appointment.update({
    //   where: { id },
    //   data: body,
    // });

    return NextResponse.json({
      success: true,
      data: { id, ...body },
      message: 'Agendamento atualizado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar agendamento' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/appointments/[id]
 * Deleta um agendamento
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // TODO: Implementar delete no Prisma
    // await prisma.appointment.delete({
    //   where: { id },
    // });

    return NextResponse.json({
      success: true,
      message: 'Agendamento deletado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao deletar agendamento:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao deletar agendamento' },
      { status: 500 }
    );
  }
}
