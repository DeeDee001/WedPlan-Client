export type UserRole = 'admin' | 'vendor' | 'customer';
export type SubscriptionPlan = 'free' | 'premium';
export type ServiceStatus = 'pending' | 'approved' | 'rejected' | 'active' | 'inactive';
export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  isBlocked: boolean;
  businessName?: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionExpiresAt?: string;
  createdAt?: string;
}

export interface Service {
  _id: string;
  vendorId: string | User;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: ServiceStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface Booking {
  _id: string;
  serviceId: string | Service;
  vendorId: string | User;
  customerId: string | User;
  eventDate: string;
  eventLocation: string;
  message?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface Transaction {
  _id: string;
  vendorId: string | User;
  plan: string;
  amount: number;
  currency: string;
  stripeSessionId: string;
  stripeSubscriptionId?: string;
  status: TransactionStatus;
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}
