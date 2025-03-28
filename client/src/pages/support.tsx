import { useState } from "react";
import { useTheme } from "@/contexts/theme-context";
import {
  Sun,
  Moon,
  HelpCircle,
  MessageCircle,
  FileText,
  Book,
  PhoneCall,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

export default function Support() {
  const { toggleTheme, theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [contactSubject, setContactSubject] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const { toast } = useToast();

  const handleSubmitContactForm = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the message to the server
    toast({
      title: "Message sent",
      description: "We'll get back to you as soon as possible.",
    });
    setContactSubject("");
    setContactMessage("");
  };

  return (
    <div className="overflow-hidden text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Help & Support</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Find answers and get assistance with DashMetrics
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="mt-4 md:mt-0 theme-toggle p-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 self-start"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* FAQs */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Quick answers to common questions about using DashMetrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="search"
                    placeholder="Search for answers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    How do I connect my social media accounts?
                  </AccordionTrigger>
                  <AccordionContent>
                    To connect your social media accounts, go to the Dashboard
                    and navigate to the "Connected Platforms" section. Click
                    the "Connect" button for the platform you want to add, and
                    follow the authorization steps. Once authorized,
                    DashMetrics will automatically start tracking your
                    analytics.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    How often is my analytics data updated?
                  </AccordionTrigger>
                  <AccordionContent>
                    DashMetrics refreshes your analytics data every 24 hours
                    by default. If you need more frequent updates, our Pro and
                    Enterprise plans offer more regular data syncing, with
                    Enterprise allowing for real-time analytics on selected
                    platforms.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    Can I export my analytics data?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, you can export your analytics data in CSV or JSON
                    format. Go to the Settings page, select the "Data" tab,
                    and use the export options. Free users can export the last
                    7 days of data, while paid plans allow for exporting
                    longer time periods.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    How do I save content for later?
                  </AccordionTrigger>
                  <AccordionContent>
                    To bookmark content, use the "Save Content" section on
                    your Dashboard. Enter the title, URL, and select the
                    platform it's from. You can also add tags for better
                    organization. All your saved content can be accessed in
                    the "Saved Content" page.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    What do the different charts represent?
                  </AccordionTrigger>
                  <AccordionContent>
                    The "Follower Growth" chart shows how your follower count
                    has changed over time across different platforms. The
                    "Engagement by Platform" chart compares user interaction
                    metrics like likes, comments, and shares across your
                    connected social media accounts.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>
                    How do I upgrade my subscription?
                  </AccordionTrigger>
                  <AccordionContent>
                    To upgrade your subscription, go to the Settings page and
                    select the "Billing" tab. You'll see the available plans
                    with their features. Click "Upgrade" on the plan you want,
                    and follow the payment process. Your new features will be
                    available immediately after successful payment.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-primary" />
                Contact Support
              </CardTitle>
              <CardDescription>
                Need help? Send us a message and we'll get back to you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitContactForm} className="space-y-4">
                <div className="grid gap-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="What do you need help with?"
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Describe your issue in detail..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>

              <div className="mt-6 space-y-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Other ways to get help
                </h4>

                <a
                  href="#"
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-primary mr-3" />
                    <span className="text-sm">Documentation</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </a>

                <a
                  href="#"
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <Book className="h-5 w-5 text-primary mr-3" />
                    <span className="text-sm">Knowledge Base</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </a>

                <a
                  href="#"
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center">
                    <PhoneCall className="h-5 w-5 text-primary mr-3" />
                    <span className="text-sm">Schedule a Call</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}