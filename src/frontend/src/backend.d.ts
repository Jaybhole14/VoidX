import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PanicLog {
    timestamp: bigint;
}
export interface GuardianContact {
    name: string;
    phoneNumber: string;
}
export interface backendInterface {
    getGuardianContact(): Promise<GuardianContact>;
    getPanicLog(): Promise<Array<PanicLog>>;
    logPanicActivation(): Promise<void>;
    saveGuardianContact(name: string, phoneNumber: string): Promise<void>;
}
