export interface ServiceRequest {
  requestId: number;
  customerId: number;
  serviceId: number;
  issueTitle?: string;
  issueDescription: string;
  priority: string;
  serviceAddress: string;
  serviceCity: string;
  servicePincode: string;
  status: string;
  createdDate: Date;
  requestedDate: Date;
  scheduledDate?: Date;
  completedDate?: Date;
  closedDate?: Date;
  cancelledDate?: Date;
  cancelledBy?: number;
  cancelReason?: string;
}

export interface CreateServiceRequestDto {
  serviceId: number;
  issueTitle?: string;
  issueDescription: string;
  priority: string;
  serviceAddress: string;
  serviceCity: string;
  servicePincode: string;
}
