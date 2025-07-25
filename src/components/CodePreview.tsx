import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Eye, Code } from "lucide-react";

interface CodePreviewProps {
  code: string;
  language: "terraform" | "yaml" | "dockerfile";
  title?: string;
}

export const CodePreview = ({ code, language, title = "Generated Code" }: CodePreviewProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightSyntax = (code: string, lang: string) => {
    if (lang === "terraform") {
      return code
        .replace(/^(resource|provider|terraform|output|variable|data|locals)\s/gm, '<span class="syntax-terraform font-semibold">$1</span> ')
        .replace(/=\s*"([^"]+)"/g, '= <span class="syntax-string">"$1"</span>')
        .replace(/^(\s*)([\w_]+)\s*=/gm, '$1<span class="syntax-keyword">$2</span> =')
        .replace(/(#.*$)/gm, '<span class="syntax-comment">$1</span>');
    } else if (lang === "yaml") {
      return code
        .replace(/^(\s*-?\s*)(name|hosts|become|vars|tasks|handlers|when|loop|state|service)(\s*:)/gm, '$1<span class="syntax-keyword">$2</span>$3')
        .replace(/:\s*"([^"]+)"/g, ': <span class="syntax-string">"$1"</span>')
        .replace(/:\s*([^"\s#][^\n#]*?)(\s*#|$)/gm, ': <span class="syntax-string">$1</span>$2')
        .replace(/(#.*$)/gm, '<span class="syntax-comment">$1</span>')
        .replace(/^(\s*---\s*$)/gm, '<span class="syntax-comment">$1</span>');
    } else if (lang === "dockerfile") {
      return code
        .replace(/^(FROM|RUN|COPY|ADD|WORKDIR|EXPOSE|CMD|ENTRYPOINT|ENV|ARG|LABEL|VOLUME|USER|HEALTHCHECK|SHELL|ONBUILD)\s/gm, '<span class="syntax-terraform font-semibold">$1</span> ')
        .replace(/=\s*"([^"]+)"/g, '= <span class="syntax-string">"$1"</span>')
        .replace(/:\s*([^"\s#][^\n#]*?)(\s*#|$)/gm, ': <span class="syntax-string">$1</span>$2')
        .replace(/(#.*$)/gm, '<span class="syntax-comment">$1</span>');
    }
    return code;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">{title}</h3>
          <div className={`px-2 py-1 rounded-lg text-xs font-medium ${
            language === "terraform" 
              ? "bg-terraform/20 text-terraform" 
              : language === "dockerfile"
              ? "bg-primary/20 text-primary"
              : "bg-destructive/20 text-destructive"
          }`}>
            {language.toUpperCase()}
          </div>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleCopy}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-accent" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Code Display */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 code-block p-4 overflow-auto">
          <pre className="text-sm leading-relaxed">
            <code 
              dangerouslySetInnerHTML={{ 
                __html: highlightSyntax(code, language) 
              }}
            />
          </pre>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="p-4 border-t border-border bg-muted/20 rounded-b-2xl">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            Live Preview
          </div>
          <div>
            {code.split('\n').length} lines
          </div>
          <div>
            {code.length} characters
          </div>
        </div>
      </div>
    </div>
  );
};