import { loginSchema } from "@/schemas/auth.schema";
import { authService } from "@/services/auth.service";
import { NextResponse } from "next/server";
import { z,ZodError }  from "zod";
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const user = await authService.login(body);

        return NextResponse.json(user);
    } catch (error: any) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    errors: z.treeifyError(error),
                },
                { status: 400 }
            );
        }

        return NextResponse.json(
           { message: error.message ?? 'Erro interno' },
            { status: error.statusCode ?? 500 }
        );
    }
}