import { Controller, Get, Param, Query } from "@nestjs/common";
import { HistoryService } from "./history.service";
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('history')
@Controller('history')
export class HistoryController {
    constructor(private readonly historyService: HistoryService) {}


    @Get(':entity/:action')
    @ApiOperation({ summary: 'Get history of actions for a specific entity' })
    @ApiParam({ name: 'entity', description: 'Entity name' })
    @ApiParam({ name: 'action', description: 'Entity action (created, updated, deleted)' })
    @ApiQuery({ name: 'limit', description: 'Limit on the number of history entries to return' })
    @ApiResponse({ status: 200, description: 'History retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Entity not found' })
    getEntityHistory(@Param('entity') entity: string, @Param('action') action: string, @Query('limit') limit?: number) {
        return this.historyService.getEntityHistory(entity, action, limit);
    }
}
    