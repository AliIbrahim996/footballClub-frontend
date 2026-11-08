import { authProxy } from "@/lib/session";

export const POST = (request: Request) => authProxy(request, "/auth/accept-invite/");
