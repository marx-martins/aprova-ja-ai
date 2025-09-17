import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { examId: string } }
) {
  try {
    const exam = await db.exam.findUnique({
      where: { id: params.examId }
    })

    if (!exam) {
      return NextResponse.json(
        { error: "Concurso não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(exam)
  } catch (error) {
    console.error("Error fetching exam:", error)
    return NextResponse.json(
      { error: "Erro ao buscar concurso" },
      { status: 500 }
    )
  }
}
