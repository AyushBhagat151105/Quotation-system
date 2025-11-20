import { useState } from "react";
import { authApi } from "../api/auth";
import type { LoginDto } from "@/types/api";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");



    const loginNow = async () => {
        const dto: LoginDto = { email, password };
        try {
            await authApi.login(dto);
            alert("Logged in successfully!");
        } catch (err: any) {
            alert("Invalid login");
        }
    };

    return (
        <div>
            <input onChange={(e) => setEmail(e.target.value)} placeholder="email" />
            <input onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" />
            <button onClick={loginNow}>Login</button>
        </div>
    );
}
