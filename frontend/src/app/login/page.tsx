"use client";

import { SyntheticEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { useLogin } from "@/src/hooks/useLogin";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter();
    const { setToken, setUsertipo } = useAuth();

    const login = useLogin(
        async (data) => {
            setToken(data.access_token);
            setUsertipo(data.user.tipo);
            
            const searchParams = new URLSearchParams(window.location.search);
            const redirectUrl = searchParams.get("redirect");
            if (redirectUrl) {
                router.push(redirectUrl);
            } else {
                router.push("/");
            }
        },
        (_error) => {
            setErrorMsg("Usuario o contraseña incorrectos.");
        }
    );

    const submit = (e: SyntheticEvent) => {
        e.preventDefault();
        setErrorMsg("");
        login.mutate({ rut: username, password });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md">

                <div className="flex flex-col items-center mb-8 gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 border border-primary/20">
                        <LogIn className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-foreground">Bienvenido</h1>
                        <p className="text-sm text-muted-foreground mt-1">Ingresa tus credenciales para continuar</p>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 space-y-5">

                    <div className="flex rounded-lg bg-secondary p-1 gap-1">
                        <button
                            type="button"
                            onClick={() => router.push("/register")}
                            className="flex-1 text-sm font-medium py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                        >
                            Registrarse
                        </button>
                        <span className="flex-1 text-sm font-semibold py-1.5 rounded-md text-center bg-background text-foreground shadow-sm cursor-default">
                            Iniciar sesión
                        </span>
                    </div>

                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="username" className="text-sm font-medium text-foreground">
                                Usuario
                            </label>
                            <Input
                                type="text"
                                id="username"
                                name="username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Ingrese su nombre de usuario"
                                autoComplete="username"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium text-foreground">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="pr-10"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {errorMsg && (
                            <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2">
                                <p className="text-sm text-red-500">{errorMsg}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={login.isPending}
                            className="w-full"
                        >
                            {login.isPending ? "Iniciando sesión..." : "Ingresar"}
                        </Button>
                    </form>

                </div>

                <p className="text-center text-xs text-muted-foreground mt-6">
                    ¿No tienes una cuenta?{" "}
                    <button
                        type="button"
                        onClick={() => router.push("/register")}
                        className="text-primary hover:underline font-medium"
                    >
                        Regístrate
                    </button>
                </p>
            </div>
        </div>
    );
}