import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const { questions } = await request.json()

    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: "Dados de questões inválidos" },
        { status: 400 }
      )
    }

    // Find the simulation
    const firstQuestion = questions[0]
    if (!firstQuestion?.id) {
      return NextResponse.json(
        { error: "ID da simulação não encontrado" },
        { status: 400 }
      )
    }

    const simulationQuestion = await db.simulationQuestion.findUnique({
      where: { id: firstQuestion.id },
      include: { simulation: true }
    })

    if (!simulationQuestion) {
      return NextResponse.json(
        { error: "Simulação não encontrada" },
        { status: 404 }
      )
    }

    const simulation = simulationQuestion.simulation

    if (simulation.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 403 }
      )
    }

    // Update all questions with user answers
    let correctAnswers = 0
    const updatePromises = questions.map(async (question: any) => {
      const isCorrect = question.userAnswer === question.correctAnswer
      if (isCorrect) correctAnswers++

      return db.simulationQuestion.update({
        where: { id: question.id },
        data: {
          userAnswer: question.userAnswer,
          isCorrect: isCorrect
        }
      })
    })

    await Promise.all(updatePromises)

    // Update simulation with final results
    const updatedSimulation = await db.simulation.update({
      where: { id: simulation.id },
      data: {
        status: "completed",
        score: correctAnswers,
        correctAnswers: correctAnswers,
        completedAt: new Date()
      }
    })

    return NextResponse.json({
      simulationId: simulation.id,
      score: correctAnswers,
      totalQuestions: simulation.totalQuestions,
      percentage: Math.round((correctAnswers / simulation.totalQuestions) * 100)
    })
  } catch (error) {
    console.error("Error submitting simulation:", error)
    return NextResponse.json(
      { error: "Erro ao finalizar simulado" },
      { status: 500 }
    )
  }
}
