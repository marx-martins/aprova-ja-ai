import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { AIQuestionGenerator } from "@/lib/ai"

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      )
    }

    const { examId } = await request.json()

    if (!examId) {
      return NextResponse.json(
        { error: "ID do concurso é obrigatório" },
        { status: 400 }
      )
    }

    // Check if user can create simulation
    const user = await db.user.findUnique({
      where: { id: session.user.id }
    })

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    if (user.subscription === "free" && user.simulationsUsed >= user.simulationsLimit) {
      return NextResponse.json(
        { error: "Limite de simulados atingido. Faça upgrade para continuar." },
        { status: 403 }
      )
    }

    // Get exam details
    const exam = await db.exam.findUnique({
      where: { id: examId }
    })

    if (!exam) {
      return NextResponse.json(
        { error: "Concurso não encontrado" },
        { status: 404 }
      )
    }

    // Generate questions using AI
    const aiGenerator = new AIQuestionGenerator()
    const aiQuestions = await aiGenerator.generateQuestions(exam.name, exam.questionsCount)

    // Create simulation
    const simulation = await db.simulation.create({
      data: {
        userId: session.user.id,
        examId: examId,
        totalQuestions: exam.questionsCount,
        status: "in_progress"
      }
    })

    // Create simulation questions
    const simulationQuestions = await Promise.all(
      aiQuestions.map((q, index) =>
        db.simulationQuestion.create({
          data: {
            simulationId: simulation.id,
            questionText: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation
          }
        })
      )
    )

    // Update user's simulation count
    await db.user.update({
      where: { id: session.user.id },
      data: {
        simulationsUsed: user.simulationsUsed + 1
      }
    })

    return NextResponse.json({
      simulationId: simulation.id,
      questions: simulationQuestions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      }))
    })
  } catch (error) {
    console.error("Error creating simulation:", error)
    return NextResponse.json(
      { error: "Erro ao criar simulado" },
      { status: 500 }
    )
  }
}
