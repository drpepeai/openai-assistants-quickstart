"use client"

import { atom } from "jotai";

export const userIdAtom = atom<string>("");
export const threadIdsAtom = atom<any[]>([]);
export const threadsAtom = atom<any>({});
