export interface User {
  addresses: Array<Address>;
  email: string;
  firstName: string;
  gender: string;
  keycloakUserId: string;
  lastName: string;
  mobileNumber: string;
}

export interface Address {
  id: number;
  addressLine1: string;
  addressLine2: string;
  city: string;
  country: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
}
