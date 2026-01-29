"use server"

import { signIn, signOut } from "@/auth";

export async function loginGitHub() {
    await signIn("github", { redirectTo: "/feed" });
}

export async function loginGoogle() {
    await signIn("google", { redirectTo: "/feed" });
}

export async function loginDemo() {
    await signIn("credentials", {
        email: "maddy@connect.social",
        password: "password",
        redirectTo: "/feed"
    });
}

export async function logout() {
    await signOut({ redirectTo: "/auth/login" });
}
