import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import { ExecutionContext } from "@nestjs/common";

export class GqlAuthGuard extends AuthGuard('jwt') {
    getRequest(context: ExecutionContext): any {
        const ctx = GqlExecutionContext.create(context);
        const req = ctx.getContext().req;
        return req;
    }
}
