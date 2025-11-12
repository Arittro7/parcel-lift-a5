import { Types } from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  SENDER = "SENDER",
  RECEIVER = "RECEIVER",
}

export enum Divisions {
  DHAKA = "DHAKA",
  CHITTAGONG = "CHITTAGONG",
  KHULNA = "KHULNA",
  RAJSHAHI = "RAJSHAHI",
  BARISHAL = "BARISHAL",
  SYLHET = "SYLHET",
  RANGPUR = "RANGPUR",
  MYMENSINGH = "MYMENSINGH",
}
export interface IAddress {
  division: Divisions;
  city: string;
  zip: number;
  street: string;
}

export interface IAuthProvider {
  provider: "google" | "credentials"; // "Google", "Credential"
  providerId: string;
}

export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  auths: IAuthProvider[];
  picture?: string;
  phone?: string;
  address?: IAddress;
  role: Role;
  isActive?: IsActive;
  isDeleted?: boolean;
  isVerified?: boolean;
  parcels?: Types.ObjectId[];
}
