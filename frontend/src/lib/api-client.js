import axios from "axios"
import {HOST} from "@/utils/constants"


export const appClient = axios.create({
    baseURL : HOST,
});
