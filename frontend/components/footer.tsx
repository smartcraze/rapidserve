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
        <footer className="border-t border-border/20 bg-muted/40">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-6 md:flex-row">

                {/* Left Section */}
                <div className="flex flex-col items-center gap-3 md:items-start">
                    <Image
                        src="/rapidservelogo.png"
                        alt="RapidServe Logo"
                        width={80}
                        height={80}
                        className="object-contain"
                    />

                    <p className="text-sm text-muted-foreground">
                        Fast. Reliable. Scalable infrastructure.
                    </p>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    <Link
                        href="https://github.com/smartcraze/rapidserve"
                        target="_blank"
                        className="rounded-full border border-border/50 p-2 transition-all hover:bg-background hover:shadow-sm"
                    >
                        <Github className="h-5 w-5" />
                    </Link>

                    <Link
                        href="https://linkedin.com/in/surajv354"
                        target="_blank"
                        className="rounded-full border border-border/50 p-2 transition-all hover:bg-background hover:shadow-sm"
                    >
                        <Linkedin className="h-5 w-5" />
                    </Link>

                    <Link
                        href="https://twitter.com/surajv354"
                        target="_blank"
                        className="rounded-full border border-border/50 p-2 transition-all hover:bg-background hover:shadow-sm"
                    >
                        <Twitter className="h-5 w-5" />
                    </Link>

                    <Link
                        href="mailto:hello@surajv.dev"
                        className="rounded-full border border-border/50 p-2 transition-all hover:bg-background hover:shadow-sm"
                    >
                        <Mail className="h-5 w-5" />
                    </Link>
                </div>
            </div>

            {/* Bottom Line */}
            <div className="border-t border-border/10 py-4 text-center text-sm text-muted-foreground">
                © 2026 RapidServe. All rights reserved.
            </div>
        </footer>
    );
}