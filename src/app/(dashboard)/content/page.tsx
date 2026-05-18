"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import {
  FileText,
  PenTool,
  Eye,
  Send,
  Sparkles,
  Clock,
  Check,
  Edit3,
  Newspaper,
  Mail,
  Linkedin,
  ArrowUpRight,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  Copy,
  Loader2,
  X,
  AlertCircle,
} from "lucide-react";
import { contentArticles } from "@/data/mock";
import { motion, AnimatePresence } from "framer-motion";
import { useMounted } from "@/lib/utils";
import { askAI } from "@/lib/ai";
import { AIResponsePanel } from "@/components/ui/AIResponsePanel";
import { useToast } from "@/components/ui/Toast";
import { useState } from "react";

type ContentTab = "pipeline" | "scheduled" | "templates" | "analytics";

interface ScheduledItem {
  id: string;
  title: string;
  type: string;
  scheduledDate: string;
  scheduledTime: string;
  status: "scheduled" | "sent" | "failed";
}

export default function ContentPage() {
  const mounted = useMounted();
  const { toast } = useToast();
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ContentTab>("pipeline");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [scheduleType, setScheduleType] = useState("newsletter");
  const [scheduledItems, setScheduledItems] = useState<ScheduledItem[]>([
    { id: "s1", title: "Weekly Points Optimization Digest", type: "Newsletter", scheduledDate: "2025-02-03", scheduledTime: "09:00", status: "scheduled" },
    { id: "s2", title: "February Transfer Bonus Alert", type: "Travel Deal", scheduledDate: "2025-02-01", scheduledTime: "10:00", status: "sent" },
    { id: "s3", title: "Client Success: $185K/mo Optimization", type: "LinkedIn Post", scheduledDate: "2025-02-05", scheduledTime: "11:30", status: "scheduled" },
    { id: "s4", title: "Amex Gold vs Chase Sapphire Comparison", type: "Article", scheduledDate: "2025-01-28", scheduledTime: "08:00", status: "sent" },
  ]);

  const contentTypes = [
    { icon: Newspaper, label: "Travel Deal Article", color: "text-blue-400", prompt: "Write a premium travel deal article about a limited-time business class award availability from New York to Tokyo using Amex Membership Rewards points via ANA. Include point costs, transfer steps, and estimated value per point. Make it exciting but professional." },
    { icon: Mail, label: "Newsletter", color: "text-emerald-400", prompt: "Write a weekly newsletter for high-spending business owners covering: 1) This week's best transfer bonus (Amex to Virgin Atlantic 30%), 2) A new card recommendation for businesses spending $50K+/month on advertising, 3) A quick tip on maximizing points from equipment purchases. Keep it concise and actionable." },
    { icon: Linkedin, label: "LinkedIn Post", color: "text-[#0077B5]", prompt: "Write a LinkedIn thought leadership post about how high-spending business owners are leaving hundreds of thousands of dollars on the table by using the wrong credit cards. Include a specific example of a construction company spending $185K/month. Make it engaging with a hook, insight, and call-to-action. Keep under 1300 characters." },
    { icon: Sparkles, label: "Success Story", color: "text-luxury-gold", prompt: "Write a client success story about Marcus Chen, a construction CEO who spends $185,000/month across his business. Show how Mavaree helped him earn 4.2 million points in one year and take his family on a first-class trip to the Maldives. Include specific card recommendations and optimization strategies that led to this result." },
  ];

  const contentTemplates = [
    { id: "t1", name: "Weekly Points Digest", description: "Weekly summary of points optimization opportunities, transfer bonuses, and card recommendations", category: "Newsletter", usageCount: 24 },
    { id: "t2", name: "Transfer Bonus Alert", description: "Notify subscribers about limited-time transfer bonus opportunities between points programs", category: "Alert", usageCount: 18 },
    { id: "t3", name: "Client Success Story", description: "Template for writing compelling client success stories with before/after optimization data", category: "Case Study", usageCount: 8 },
    { id: "t4", name: "Card Comparison Guide", description: "Side-by-side comparison of credit cards for specific spending categories with ROI analysis", category: "Article", usageCount: 15 },
    { id: "t5", name: "LinkedIn Thought Leadership", description: "Short-form content for LinkedIn highlighting missed optimization opportunities", category: "Social", usageCount: 31 },
    { id: "t6", name: "New Card Launch Alert", description: "Breaking news template for new card releases with signup bonus analysis", category: "Alert", usageCount: 12 },
  ];

  const analyticsData = {
    topContent: [
      { title: "How One CEO Earned 4.2M Points in 12 Months", views: 12400, engagement: 8.2, conversions: 47 },
      { title: "Amex Gold vs Chase Sapphire: The $50K/mo Decision", views: 9800, engagement: 7.1, conversions: 38 },
      { title: "5 Card Stacking Strategies for Construction Companies", views: 8200, engagement: 9.4, conversions: 52 },
      { title: "Transfer Bonus Alert: 40% Bonus to ANA Mileage Club", views: 7600, engagement: 6.8, conversions: 29 },
    ],
    channelPerformance: [
      { channel: "Newsletter", subscribers: 3240, followers: 0, openRate: 42, clickRate: 8.2, revenue: 12400 },
      { channel: "LinkedIn", subscribers: 0, followers: 8900, openRate: 0, clickRate: 3.1, revenue: 8200 },
      { channel: "Blog", subscribers: 0, followers: 0, openRate: 0, clickRate: 2.4, revenue: 4800 },
    ],
  };

  const handleGenerate = async (prompt: string, label: string) => {
    setActiveType(label);
    setAiLoading(true);
    setAiError(null);
    setAiResponse(null);
    const { result, error } = await askAI({ type: "content", prompt });
    setAiLoading(false);
    if (error) {
      setAiError(error);
      toast(error, "error");
    } else {
      setAiResponse(result ?? null);
      toast(label + " generated", "success");
    }
  };

  const handleSchedule = () => {
    if (!scheduleTitle.trim() || !scheduleDate) {
      toast("Title and date are required", "error");
      return;
    }
    const newItem: ScheduledItem = {
      id: "s" + Date.now(),
      title: scheduleTitle,
      type: scheduleType,
      scheduledDate: scheduleDate,
      scheduledTime: scheduleTime,
      status: "scheduled",
    };
    setScheduledItems([newItem, ...scheduledItems]);
    setShowScheduleModal(false);
    setScheduleTitle("");
    setScheduleDate("");
    setScheduleTime("09:00");
    toast("Content scheduled successfully", "success");
  };

  const statusConfig: Record<
    string,
    { badge: "success" | "warning" | "default"; icon: typeof Check }
  > = {
    published: { badge: "success", icon: Check },
    review: { badge: "warning", icon: Eye },
    draft: { badge: "default", icon: Edit3 },
  };

  const tabs: { id: ContentTab; label: string; icon: typeof FileText }[] = [
    { id: "pipeline", label: "Pipeline", icon: FileText },
    { id: "scheduled", label: "Scheduled", icon: Calendar },
    { id: "templates", label: "Templates", icon: Copy },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Content Engine</h1>
          <p className="mt-1 text-sm text-platinum-400">
            AI-generated travel deals, reward alerts, success stories, and
            marketing content. Schedule, manage, and track performance.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowScheduleModal(true)}>
            <Calendar className="h-4 w-4" />
            Schedule
          </Button>
          <Button variant="gold" onClick={() => {
            const el = document.getElementById("quick-generate");
            el?.scrollIntoView({ behavior: "smooth" });
          }}>
            <Sparkles className="h-4 w-4" />
            Generate Content
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Published Articles"
          value="47"
          change="+12 this month"
          trend="up"
          icon={FileText}
          delay={0.1}
        />
        <StatCard
          label="Newsletter Subs"
          value="3,240"
          change="+18.5%"
          trend="up"
          icon={Mail}
          iconColor="text-blue-400"
          delay={0.15}
        />
        <StatCard
          label="LinkedIn Reach"
          value="48.2K"
          change="+32%"
          trend="up"
          icon={TrendingUp}
          iconColor="text-emerald-400"
          delay={0.2}
        />
        <StatCard
          label="Engagement Rate"
          value="6.8%"
          change="+1.2%"
          trend="up"
          icon={Users}
          iconColor="text-purple-400"
          delay={0.25}
        />
      </div>

      {/* Content Generation Tools */}
      <GlassCard delay={0.3}>
        <h2 id="quick-generate" className="text-base font-semibold text-white">
          Quick Generate
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {contentTypes.map((tool) => (
            <button
              key={tool.label}
              onClick={() => handleGenerate(tool.prompt, tool.label)}
              disabled={aiLoading}
              className={"flex flex-col items-center gap-2.5 rounded-xl border p-4 transition-all hover:border-luxury-gold/20 hover:bg-white/[0.04] " + (
                activeType === tool.label && aiLoading
                  ? "border-luxury-gold/30 bg-white/[0.04]"
                  : "border-white/[0.06] bg-white/[0.02]"
              ) + " disabled:opacity-50"}
            >
              <tool.icon className={"h-6 w-6 " + tool.color} />
              <span className="text-xs font-medium text-platinum-300">
                {activeType === tool.label && aiLoading ? "Generating..." : tool.label}
              </span>
            </button>
          ))}
        </div>

        <AIResponsePanel
          response={aiResponse}
          loading={aiLoading}
          error={aiError}
          onClose={() => { setAiResponse(null); setAiError(null); setActiveType(null); }}
        />
      </GlassCard>

      {/* Tab Navigation */}
      <div className="flex gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={"flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-medium transition-all " + (
              activeTab === tab.id
                ? "bg-luxury-gold/10 text-luxury-gold"
                : "text-platinum-400 hover:bg-white/[0.04] hover:text-white"
            )}
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Pipeline Tab */}
      {activeTab === "pipeline" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">
              Content Pipeline
            </h2>
            <div className="flex gap-2">
              <Badge variant="default">
                {contentArticles.filter((a) => a.status === "draft").length} Drafts
              </Badge>
              <Badge variant="warning">
                {contentArticles.filter((a) => a.status === "review").length} In Review
              </Badge>
              <Badge variant="success">
                {contentArticles.filter((a) => a.status === "published").length} Published
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            {contentArticles.map((article, i) => {
              const config = statusConfig[article.status];
              const StatusIcon = config.icon;

              return (
                <motion.div
                  key={article.id}
                  initial={mounted ? { opacity: 0, y: 10 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-luxury-gold/20 hover:bg-white/[0.04]"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={config.badge} size="sm">
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {article.status}
                        </Badge>
                        <Badge variant="default" size="sm">
                          {article.category}
                        </Badge>
                      </div>
                      <h3 className="mt-2 text-sm font-semibold text-white">
                        {article.title}
                      </h3>
                      <p className="mt-1 text-xs text-platinum-400 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="flex items-center gap-1 text-[10px] text-platinum-500">
                          <Sparkles className="h-3 w-3" />
                          {article.author}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-platinum-500">
                          <Clock className="h-3 w-3" />
                          {new Date(article.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </span>
                        <div className="flex gap-1">
                          {article.tags.map((tag) => (
                            <span key={tag} className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-platinum-500">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      {article.status === "draft" && (
                        <Button variant="secondary" size="sm" onClick={() => handleGenerate("Review and improve this article draft: \"" + article.title + "\" - " + article.excerpt + ". Provide editorial feedback and a polished version.", "Review")}>
                          <Eye className="h-3 w-3" />
                          Review
                        </Button>
                      )}
                      {article.status === "review" && (
                        <Button variant="gold" size="sm" onClick={() => handleGenerate("Finalize this article for publication: \"" + article.title + "\" - " + article.excerpt + ". Write the final polished version ready for publishing.", "Publish")}>
                          <Send className="h-3 w-3" />
                          Publish
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => handleGenerate("Rewrite and improve this article: \"" + article.title + "\" - " + article.excerpt + ". Make it more engaging, professional, and SEO-optimized.", "Edit")}>
                        <Edit3 className="h-3 w-3" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Scheduled Tab */}
      {activeTab === "scheduled" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Scheduled Content</h2>
            <Button variant="gold" size="sm" onClick={() => setShowScheduleModal(true)}>
              <Calendar className="h-3 w-3" />
              Schedule New
            </Button>
          </div>

          {scheduledItems.length === 0 && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
              <Calendar className="mx-auto h-8 w-8 text-platinum-500" />
              <p className="mt-2 text-sm text-platinum-400">No scheduled content</p>
              <Button variant="secondary" size="sm" className="mt-3" onClick={() => setShowScheduleModal(true)}>
                Schedule Content
              </Button>
            </div>
          )}

          {scheduledItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={mounted ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-luxury-gold/20 hover:bg-white/[0.04]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={"flex h-9 w-9 items-center justify-center rounded-lg " + (
                    item.status === "sent" ? "bg-emerald-500/10" : item.status === "failed" ? "bg-red-500/10" : "bg-luxury-gold/10"
                  )}>
                    {item.status === "sent" ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : item.status === "failed" ? (
                      <AlertCircle className="h-4 w-4 text-red-400" />
                    ) : (
                      <Clock className="h-4 w-4 text-luxury-gold" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{item.title}</p>
                    <div className="flex items-center gap-2 text-xs text-platinum-500">
                      <Badge variant="default" size="sm">{item.type}</Badge>
                      <span>{new Date(item.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      <span>at {item.scheduledTime}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={item.status === "sent" ? "success" : item.status === "failed" ? "default" : "warning"} size="sm">
                    {item.status}
                  </Badge>
                  {item.status === "scheduled" && (
                    <button
                      onClick={() => {
                        setScheduledItems(scheduledItems.filter(s => s.id !== item.id));
                        toast("Scheduled item removed", "success");
                      }}
                      className="rounded-lg p-1 text-platinum-500 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">Content Templates</h2>
            <p className="text-xs text-platinum-500">{contentTemplates.length} templates available</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {contentTemplates.map((template, i) => (
              <motion.div
                key={template.id}
                initial={mounted ? { opacity: 0, y: 10 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-luxury-gold/20 hover:bg-white/[0.04]"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-white">{template.name}</h3>
                      <Badge variant="default" size="sm">{template.category}</Badge>
                    </div>
                    <p className="mt-1.5 text-xs text-platinum-400 line-clamp-2">{template.description}</p>
                    <p className="mt-2 text-[10px] text-platinum-500">Used {template.usageCount} times</p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={() => handleGenerate("Using the template '" + template.name + "': " + template.description + ". Generate high-quality content following this template format.", template.name)}
                  >
                    <Sparkles className="h-3 w-3" />
                    Use
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-semibold text-white">Top Performing Content</h2>
            <div className="mt-3 space-y-3">
              {analyticsData.topContent.map((item, i) => (
                <motion.div
                  key={i}
                  initial={mounted ? { opacity: 0, y: 10 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-luxury-gold/10 text-sm font-bold text-luxury-gold">
                        {i + 1}
                      </div>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs font-semibold text-white">{item.views.toLocaleString()}</p>
                        <p className="text-[10px] text-platinum-500">views</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-emerald-400">{item.engagement}%</p>
                        <p className="text-[10px] text-platinum-500">engagement</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-semibold text-luxury-gold">{item.conversions}</p>
                        <p className="text-[10px] text-platinum-500">conversions</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <GlassCard delay={0.3}>
            <h2 className="text-base font-semibold text-white">Channel Performance</h2>
            <div className="mt-4 space-y-4">
              {analyticsData.channelPerformance.map((channel) => (
                <div key={channel.channel} className="rounded-xl bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white">{channel.channel}</p>
                      {channel.subscribers > 0 && (
                        <span className="text-[10px] text-platinum-500">{channel.subscribers.toLocaleString()} subscribers</span>
                      )}
                      {channel.followers > 0 && (
                        <span className="text-[10px] text-platinum-500">{channel.followers.toLocaleString()} followers</span>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-emerald-400">{"$" + channel.revenue.toLocaleString()}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-3">
                    {channel.openRate > 0 && (
                      <div>
                        <p className="text-[10px] text-platinum-500">Open Rate</p>
                        <p className="text-xs font-semibold text-white">{channel.openRate}%</p>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] text-platinum-500">Click Rate</p>
                      <p className="text-xs font-semibold text-white">{channel.clickRate}%</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-platinum-500">Revenue</p>
                      <p className="text-xs font-semibold text-emerald-400">{"$" + channel.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-luxury-gold/60"
                      style={{ width: (channel.revenue / 12400 * 100) + "%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <GlassCard delay={0.4}>
              <p className="text-xs text-platinum-500">Total Content Views</p>
              <p className="mt-1 text-2xl font-bold text-white">38,000</p>
              <p className="mt-0.5 text-xs text-emerald-400">+24% from last month</p>
            </GlassCard>
            <GlassCard delay={0.45}>
              <p className="text-xs text-platinum-500">Avg Engagement Rate</p>
              <p className="mt-1 text-2xl font-bold text-luxury-gold">7.9%</p>
              <p className="mt-0.5 text-xs text-emerald-400">+1.8% from last month</p>
            </GlassCard>
            <GlassCard delay={0.5}>
              <p className="text-xs text-platinum-500">Content-Driven Revenue</p>
              <p className="mt-1 text-2xl font-bold text-emerald-400">$25,400</p>
              <p className="mt-0.5 text-xs text-emerald-400">+31% from last month</p>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowScheduleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0c0c0c] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">Schedule Content</h3>
                <button onClick={() => setShowScheduleModal(false)} className="text-platinum-500 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-[10px] font-medium uppercase tracking-wider text-platinum-500">Title</label>
                  <input
                    type="text"
                    value={scheduleTitle}
                    onChange={(e) => setScheduleTitle(e.target.value)}
                    placeholder="Weekly Points Optimization Digest"
                    className="mt-1 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-platinum-500 outline-none focus:border-luxury-gold/30"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium uppercase tracking-wider text-platinum-500">Content Type</label>
                  <select
                    value={scheduleType}
                    onChange={(e) => setScheduleType(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-luxury-gold/30"
                  >
                    <option value="newsletter">Newsletter</option>
                    <option value="article">Article</option>
                    <option value="linkedin">LinkedIn Post</option>
                    <option value="alert">Alert</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-medium uppercase tracking-wider text-platinum-500">Date</label>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-luxury-gold/30"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-medium uppercase tracking-wider text-platinum-500">Time</label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white outline-none focus:border-luxury-gold/30"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
                <Button variant="gold" size="sm" onClick={handleSchedule}>
                  <Calendar className="h-3 w-3" />
                  Schedule
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
