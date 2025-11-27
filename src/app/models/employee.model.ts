// Employee roles
export enum EmployeeRole {
    SERVER = 'server',
    BARISTA = 'barista',
    CASHIER = 'cashier',
    MANAGER = 'manager'
}

// Employee interface
export interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: EmployeeRole;
    avatar?: string;
    hireDate: Date;
    salary: number;
    schedule?: WorkSchedule[];
    timeTracking?: TimeEntry[];
    active: boolean;
}

// Work schedule
export interface WorkSchedule {
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
}

// Time entry for clock in/out
export interface TimeEntry {
    id: string;
    employeeId: string;
    date: Date;
    clockIn: Date;
    clockOut?: Date;
    hoursWorked?: number;
}
