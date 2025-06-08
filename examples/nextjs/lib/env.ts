import {Envx} from "@/types/envx"
import { getEnvx } from "dotenvxjs"

// Load Envx File
export const env = getEnvx<Envx>()