import { extractToken } from "@/helper/extractToken";
import { groupService } from "@/services/group.service";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const token = extractToken(req);
        const result = await groupService.selectByIdGroup(params.id, token);
        return NextResponse.json(result, { status: 200 })
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message ?? 'Erro interno' },
            { status: error.statusCode ?? 500 }
        )
    }


}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {

    try {
        const token = extractToken(req);
        const body = await req.json();
        await groupService.updateGroup(params.id, body, token);
        return NextResponse.json({ success: true, status: 200, message: 'Atualizado com sucesso.' });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message ?? 'Erro interno' },
            { status: error.statusCode ?? 500 }
        )
    }


}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const token = extractToken(req);
        await groupService.deleteGroup(params.id, token);
        return NextResponse.json({ success: true, status: 200, message: 'Deletado com sucesso.' });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message ?? 'Erro interno' },
            { status: error.statusCode ?? 500 }
        )
    }


}