import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Mail, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ContactModal = ({ open, onOpenChange }: ContactModalProps) => {
  const [subject, setSubject] = useState("");
  const [issue, setIssue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create mailto link
    const mailtoLink = `mailto:aboobackerasi198@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(issue)}`;
    window.location.href = mailtoLink;

    toast({
      title: "Message Sent",
      description: "Your email client has been opened with your message.",
    });

    setSubject("");
    setIssue("");
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const Content = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="What's this about?"
          required
          className="glass"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="issue">Message</Label>
        <Textarea
          id="issue"
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
          placeholder="Describe your issue or feedback..."
          required
          rows={4}
          className="glass resize-none"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !subject.trim() || !issue.trim()}
          className="flex-1"
        >
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </form>
  );

  return (
    <>
      {/* Desktop Modal */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="glass-modal max-w-md hidden md:block">
          <DialogHeader className="pb-6">
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              Contact Us
            </DialogTitle>
          </DialogHeader>
          <Content />
        </DialogContent>
      </Dialog>

      {/* Mobile Drawer */}
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="glass-modal md:hidden">
          <DrawerHeader className="pb-6">
            <DrawerTitle className="flex items-center gap-3 text-2xl justify-center">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              Contact Us
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-8">
            <Content />
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};