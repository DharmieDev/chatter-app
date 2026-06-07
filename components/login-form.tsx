"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Update this route to redirect to an authenticated route. The user already has an active session.
      router.push("/protected");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth =async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${location.origin}/api/auth/callback` }
      });
      if (error) throw error;
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Failed to connect to OAuth provider")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
              <Button type="button" onClick={() => handleOAuth('google')} disabled={isLoading}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Google-Icon--Streamline-Svg-Logos" height={24} width={24} ><desc>{"\n    Google Icon Streamline Icon: https://streamlinehq.com\n  "}</desc><path fill="#4285f4" d="M23.5151 12.2611c0 -0.9661 -0.0784 -1.6711 -0.24805 -2.4022H12.2351v4.3605h6.4755c-0.1305 1.08365 -0.8355 2.7156 -2.4022 3.8122l-0.02195 0.146 3.4881 2.702175 0.24165 0.024125c2.2194 -2.04975 3.4989 -5.0656 3.4989 -8.6428Z" strokeWidth={0.25} /><path fill="#34a853" d="M12.234975 23.75c3.17245 0 5.83575 -1.0445 7.7811 -2.8461L16.308275 18.031625c-0.9922 0.69195 -2.3239 1.175 -4.0733 1.175 -3.1072 0 -5.7444 -2.049675 -6.6845 -4.882725l-0.137775 0.0117L1.7857125 17.14255l-0.0474325 0.13185C3.670475 21.112725 7.639375 23.75 12.234975 23.75Z" strokeWidth={0.25} /><path fill="#fbbc05" d="M5.550625 14.3239c-0.248075 -0.7311 -0.391625 -1.5145 -0.391625 -2.3239 0 -0.8095 0.143575 -1.5928 0.378575 -2.3239l-0.006575 -0.1557L1.858565 6.66835l-0.120155 0.05715C0.9420575 8.3183 0.4851075 10.10695 0.4851075 12c0 1.89305 0.45695 3.6816 1.2533025 5.2744l3.812215 -2.9505Z" strokeWidth={0.25} /><path fill="#eb4335" d="M12.234975 4.7933c2.20635 0 3.69465 0.95305 4.5433 1.7495L20.094375 3.305C18.057775 1.41195 15.407425 0.25 12.234975 0.25 7.639375 0.25 3.670475 2.8872 1.73828 6.7255L5.537425 9.6761c0.95315 -2.83305 3.59035 -4.8828 6.69755 -4.8828Z" strokeWidth={0.25} /></svg>
                {isLoading ? "Logging in..." : "Log in with Google"}
              </Button>
              <Button type="button" onClick={() => handleOAuth('github')} disabled={isLoading}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Github-Icon--Streamline-Svg-Logos" height={24} width={24} ><desc>{"\n    Github Icon Streamline Icon: https://streamlinehq.com\n  "}</desc><path fill="#161614" d="M12.0001 0.54004C5.51155 0.54004 0.25 5.800625 0.25 12.290125c0 5.1915 3.36675 9.59595 8.035425 11.14965 0.58725 0.10875 0.802825 -0.2549 0.802825 -0.56525 0 -0.2802 -0.0109 -1.2058 -0.01595 -2.187625 -3.268875 0.710775 -3.95865 -1.38635 -3.95865 -1.38635 -0.534525 -1.35815 -1.30465 -1.7193 -1.30465 -1.7193 -1.066075 -0.729275 0.08035 -0.714275 0.08035 -0.714275 1.179925 0.082875 1.8012 1.21085 1.8012 1.21085 1.048 1.796325 2.7488 1.277 3.4193 0.976775 0.105475 -0.75945 0.409975 -1.2778 0.746 -1.571225 -2.60985 -0.2971 -5.353375 -1.304625 -5.353375 -5.806925 0 -1.28285 0.459 -2.33105 1.21065 -3.1539 -0.122 -0.29595 -0.524175 -1.49105 0.113825 -3.109525 0 0 0.9867 -0.3158 3.232125 1.204425 0.937275 -0.26035 1.94245 -0.3909 2.941025 -0.395375 0.998575 0.004475 2.004525 0.135025 2.94355 0.395375 2.2427 -1.520225 3.228025 -1.204425 3.228025 -1.204425 0.639575 1.618475 0.2372 2.813575 0.1152 3.109525 0.7534 0.82285 1.2093 1.87105 1.2093 3.1539 0 4.513 -2.7488 5.5067 -5.365275 5.7976 0.42145 0.364625 0.797 1.0797 0.797 2.17595 0 1.572175 -0.013625 2.8375 -0.013625 3.224525 0 0.312675 0.2115 0.679075 0.8071 0.563675C20.387525 21.882775 23.75 17.479875 23.75 12.290125c0 -6.4895 -5.260775 -11.750085 -11.7499 -11.750085ZM4.6508 17.2783c-0.025875 0.058375 -0.117725 0.075875 -0.2014 0.0358 -0.085225 -0.038325 -0.133075 -0.1179 -0.10545 -0.176475 0.0253 -0.060125 0.117325 -0.076875 0.20235 -0.036575 0.085425 0.038325 0.134075 0.118675 0.1045 0.17725Zm0.577975 0.515725c-0.05605 0.05195 -0.1656 0.027825 -0.239925 -0.0543 -0.07685 -0.0819 -0.09125 -0.19145 -0.034425 -0.244175 0.057775 -0.051975 0.164025 -0.02765 0.241075 0.054275 0.07685 0.0829 0.091825 0.19165 0.033275 0.2442Zm0.3965 0.659825c-0.072 0.050025 -0.1897 0.003125 -0.262475 -0.10135 -0.072 -0.1045 -0.072 -0.2298 0.00155 -0.28 0.072975 -0.0502 0.188925 -0.005075 0.262675 0.09865 0.0718 0.106225 0.0718 0.23155 -0.00175 0.2827Zm0.6706 0.7642c-0.064425 0.071025 -0.2016 0.05195 -0.302 -0.04495 -0.102725 -0.09475 -0.131325 -0.2292 -0.066725 -0.300225 0.065175 -0.071225 0.203125 -0.051175 0.3043 0.04495 0.101975 0.094575 0.1331 0.23 0.064425 0.300225Zm0.86665 0.258c-0.0284 0.092025 -0.160525 0.13385 -0.2936 0.09475 -0.1329 -0.040275 -0.219875 -0.148075 -0.193025 -0.241075 0.027625 -0.092625 0.160325 -0.1362 0.2944 -0.094375 0.1327 0.040075 0.219875 0.1471 0.192225 0.2407Zm0.986325 0.109425c0.0033 0.0969 -0.10955 0.17725 -0.24925 0.179 -0.1405 0.003125 -0.254125 -0.0753 -0.255675 -0.17065 0 -0.09785 0.110325 -0.17745 0.2508 -0.179775 0.1397 -0.002725 0.254125 0.0751 0.254125 0.171425Zm0.968925 -0.03715c0.016725 0.094575 -0.08035 0.19165 -0.2191 0.21755 -0.1364 0.0249 -0.262675 -0.033475 -0.28 -0.127275 -0.016925 -0.0969 0.081925 -0.193975 0.218125 -0.219075 0.138925 -0.024125 0.263275 0.032675 0.280975 0.1288Z" strokeWidth={0.25} /></svg>
                {isLoading ? "Logging in..." : "Log in with GitHub"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/sign-up"
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
