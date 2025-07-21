export class CreateBookingCommand {
  constructor(
    public readonly userId: number,
    public readonly resourceId: number,
    public readonly startTime: string,
    public readonly endTime: string,
  ) {}
} 