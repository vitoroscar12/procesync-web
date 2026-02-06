import { extractToken } from "@/helper/extractToken";
import { groupService } from "@/services/group.service";
import { NextResponse } from "next/server";
import { ZodError, z } from "zod";

export async function POST(req: Request) {
    try {
        const token = extractToken(req);
        const body = await req.json();
        const result = await groupService.createGroup(body, token);

        return NextResponse.json(result, { status: 201 });
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

export async function GET(req: Request) {
    try {
        const token = extractToken(req);
        const result = await groupService.selectAllGroups(token);
        return NextResponse.json(result, { status: 200 })
    } catch (error: any) {
        return NextResponse.json(
            { message: error.message ?? 'Erro interno' },
            { status: error.statusCode ?? 500 }
        )
    }
}