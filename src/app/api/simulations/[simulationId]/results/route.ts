import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { simulationId: string } }
) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const simulation = await db.simulation.findUnique({
      where: { id: params.simulationId },
      include: {
        exam: {
          select: {
            name: true,
            organization: true
          }
        },
        questions: {
          orderBy: { createdAt: "asc" }
        }
      }
    })

    if (!simulation) {
      return NextResponse.json(
        { error: "Simulação não encontrada" },
        { status: 404 }
      )
    }

    if (simulation.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 403 }
      )
    }

    return NextResponse.json({
      id: simulation.id,
      score: simulation.score,
      totalQuestions: simulation.totalQuestions,
      correctAnswers: simulation.correctAnswers,
      completedAt: simulation.completedAt,
      exam: simulation.exam,
      questions: simulation.questions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        userAnswer: q.userAnswer,
        isCorrect: q.isCorrect,
        explanation: q.explanation
      }))
    })
  } catch (error) {
    console.error("Error fetching simulation results:", error)
    return NextResponse.json(
      { error: "Erro ao buscar resultados" },
      { status: 500 }
    )
  }
}
