import { extractToken } from "@/helper/extractToken";
import { userGroupService } from "@/services/userGroup.service";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const token = extractToken(req);
        await userGroupService.deleteUserGroup(params.id, token);
        return NextResponse.json({ success: true, status: 200, message: 'Deletado com sucesso.' })
    } catch (error: any) {
        return NextResponse.json(
            { success: false, message: error.message ?? 'Erro interno' },
            { status: error.statusCode ?? 500 }
        )
    }
}