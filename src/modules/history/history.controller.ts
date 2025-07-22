import { Controller, Get, Param, Query } from "@nestjs/common";
import { HistoryService } from "./history.service";
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('history')
@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) {}


    @Get()
    @ApiOperation({ summary: 'Get history of actions for a specific entity' })
    @ApiParam({ name: 'entity', description: 'Entity type' })
    @ApiParam({ name: 'entityId', description: 'Entity ID' })
    @ApiQuery({ name: 'limit', description: 'Limit on the number of history entries to return' })
    @ApiResponse({ status: 200, description: 'History retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Entity not found' })
    getEntityHistory(@Param('entity') entity: string, @Param('entityId') entityId: number, @Query('limit') limit?: number) {
        return this.historyService.getEntityHistory(entity, entityId, limit);
    }
}
    