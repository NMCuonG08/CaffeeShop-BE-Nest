import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from '@nestjs/graphql';
import { SafeUser } from '@/shared/dtos/responses/base.response';


export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    if (!user) return null;

    // Chỉ lấy safe fields
    const safeUser: SafeUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      picture: user.picture,
    };

    if (data) {
      return safeUser[data as keyof SafeUser];
    }

    return safeUser;
  }
);
export const GetUserFromGQL = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(ctx);
    const request = gqlContext.getContext().req;

    if (data) {
      return request.user?.[data];
    }

    return request.user;
  },
);