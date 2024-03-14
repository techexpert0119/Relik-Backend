import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUserId = createParamDecorator(
  (data: undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user['sub'];
  }
);

export const GetSessionId = createParamDecorator((_, context) => {
  return context.switchToHttp().getRequest().user['sessionId'];
});
