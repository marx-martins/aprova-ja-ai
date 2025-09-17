import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const exams = await db.exam.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json(exams)
  } catch (error) {
    console.error("Error fetching exams:", error)
    return NextResponse.json(
      { error: "Erro ao buscar concursos" },
      { status: 500 }
    )
  }
}
