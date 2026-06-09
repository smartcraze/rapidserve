import Image from "next/image";
import Link from "next/link";
import {
    Github,
    Linkedin,
    Twitter,
    Mail,
} from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border/20 bg-muted/10 py-4">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">

                {/* Left Section (Logo & Copyright Info) */}
                <div className="flex flex-col items-center gap-2 md:flex-row md:gap-3">
                    <Image
                        src="/rapidservelogo.png"
                        alt="RapidServe Logo"
                        width={24}
                        height={24}
                        className="object-contain dark:mix-blend-screen mix-blend-difference filter invert dark:invert-0"
                    />
                    <p className="text-xs text-muted-foreground text-center md:text-left">
                        © 2026 RapidServe. Fast, reliable container deployments.
                    </p>
                </div>

                {/* Right Section (Social Icons) */}
                <div className="flex items-center gap-3">
                    <Link
                        href="https://github.com/smartcraze/rapidserve"
                        target="_blank"
                        className="rounded-full border border-border/40 p-1.5 transition-colors hover:bg-foreground/5 text-muted-foreground hover:text-foreground"
                    >
                        <Github className="h-4 w-4" />
                    </Link>

                    <Link
                        href="https://linkedin.com/in/surajv354"
                        target="_blank"
                        className="rounded-full border border-border/40 p-1.5 transition-colors hover:bg-foreground/5 text-muted-foreground hover:text-foreground"
                    >
                        <Linkedin className="h-4 w-4" />
                    </Link>

                    <Link
                        href="https://twitter.com/surajv354"
                        target="_blank"
                        className="rounded-full border border-border/40 p-1.5 transition-colors hover:bg-foreground/5 text-muted-foreground hover:text-foreground"
                    >
                        <Twitter className="h-4 w-4" />
                    </Link>

                    <Link
                        href="mailto:hello@surajv.dev"
                        className="rounded-full border border-border/40 p-1.5 transition-colors hover:bg-foreground/5 text-muted-foreground hover:text-foreground"
                    >
                        <Mail className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </footer>
    );
}