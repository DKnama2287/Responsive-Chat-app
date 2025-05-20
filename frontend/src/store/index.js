import { create } from "zustand";
import { createauthSlice } from "./Slices/auth-slices";
import { createChatSlice } from "./Slices/chat-slices";

export const  useappStore = create()((...a) =>({
    ...createauthSlice(...a),
    ...createChatSlice(...a)
}))