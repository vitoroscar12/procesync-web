import { extractToken } from "@/helper/extractToken";
import { userGroupService } from "@/services/userGroup.service";
import { NextResponse } from "next/server";
import { ZodError, z } from "zod";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const token = extractToken(req);
        const body = await req.json();
        const result = await userGroupService.createUserGroup(body, params.id, token);
        return NextResponse.json(result, { status: 201 })
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
            { success: false, message: error.message ?? 'Erro interno' },
            { status: error.statusCode ?? 500 }
        );
    }
}


export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const token = extractToken(req);
        const result = await userGroupService.getAllUserGroupsByGroupId(params.id, token)
        return NextResponse.json(result, { status: 200 })
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message ?? 'Erro interno' },
            { status: error.statusCode ?? 500 }
        );
    }
}

