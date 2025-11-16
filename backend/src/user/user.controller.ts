import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get the authenticated user profile' })
  @ApiResponse({
    status: 200,
    description: 'Returns the profile of the authenticated user',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized — Invalid or missing JWT token',
  })
  getProfile(@Req() req) {
    const { password, ...safeUser } = req.user;
    return safeUser;
  }
}
