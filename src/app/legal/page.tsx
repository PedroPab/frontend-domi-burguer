import LegalPageClient from "@/components/legal/LegalPageClient";
import MarkdownFile from "@/components/legal/MarkdownFile";

export default function LegalPage() {
    return (
        <LegalPageClient
            tosContent={
                <MarkdownFile filePath="public/terms-of-service.md" />
            }
            privacyContent={
                <MarkdownFile filePath="public/privacy-policy.md" />
            }
            referidosContent={
                <MarkdownFile filePath="public/README-codigos-referidos-domiburguer.md" />
            }
        />
    );
}
