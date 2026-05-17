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
} from "lucide-react";
import { contentArticles } from "@/data/mock";
import { motion } from "framer-motion";
import { useMounted } from "@/lib/utils";
import { askAI } from "@/lib/ai";
import { AIResponsePanel } from "@/components/ui/AIResponsePanel";
import { useState } from "react";

export default function ContentPage() {
  const mounted = useMounted();
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);

  const contentTypes = [
    { icon: Newspaper, label: "Travel Deal Article", color: "text-blue-400", prompt: "Write a premium travel deal article about a limited-time business class award availability from New York to Tokyo using Amex Membership Rewards points via ANA. Include point costs, transfer steps, and estimated value per point. Make it exciting but professional." },
    { icon: Mail, label: "Newsletter", color: "text-emerald-400", prompt: "Write a weekly newsletter for high-spending business owners covering: 1) This week's best transfer bonus (Amex to Virgin Atlantic 30%), 2) A new card recommendation for businesses spending $50K+/month on advertising, 3) A quick tip on maximizing points from equipment purchases. Keep it concise and actionable." },
    { icon: Linkedin, label: "LinkedIn Post", color: "text-[#0077B5]", prompt: "Write a LinkedIn thought leadership post about how high-spending business owners are leaving hundreds of thousands of dollars on the table by using the wrong credit cards. Include a specific example of a construction company spending $185K/month. Make it engaging with a hook, insight, and call-to-action. Keep under 1300 characters." },
    { icon: Sparkles, label: "Success Story", color: "text-luxury-gold", prompt: "Write a client success story about Marcus Chen, a construction CEO who spends $185,000/month across his business. Show how Mavaree helped him earn 4.2 million points in one year and take his family on a first-class trip to the Maldives. Include specific card recommendations and optimization strategies that led to this result." },
  ];

  const handleGenerate = async (prompt: string, label: string) => {
    setActiveType(label);
    setAiLoading(true);
    setAiError(null);
    setAiResponse(null);
    const { result, error } = await askAI({ type: "content", prompt });
    setAiLoading(false);
    if (error) setAiError(error);
    else setAiResponse(result ?? null);
  };

  const statusConfig: Record<
    string,
    { badge: "success" | "warning" | "default"; icon: typeof Check }
  > = {
    published: { badge: "success", icon: Check },
    review: { badge: "warning", icon: Eye },
    draft: { badge: "default", icon: Edit3 },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Content Engine</h1>
          <p className="mt-1 text-sm text-platinum-400">
            AI-generated travel deals, reward alerts, success stories, and
            marketing content. Review and publish with one click.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => {
            const el = document.getElementById("content-pipeline");
            el?.scrollIntoView({ behavior: "smooth" });
          }}>
            <PenTool className="h-4 w-4" />
            Create Manual
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
              className={`flex flex-col items-center gap-2.5 rounded-xl border p-4 transition-all hover:border-luxury-gold/20 hover:bg-white/[0.04] ${
                activeType === tool.label && aiLoading
                  ? "border-luxury-gold/30 bg-white/[0.04]"
                  : "border-white/[0.06] bg-white/[0.02]"
              } disabled:opacity-50`}
            >
              <tool.icon className={`h-6 w-6 ${tool.color}`} />
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

      {/* Content Pipeline */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 id="content-pipeline" className="text-base font-semibold text-white">
            Content Pipeline
          </h2>
          <div className="flex gap-2">
            <Badge variant="default">
              {contentArticles.filter((a) => a.status === "draft").length} Drafts
            </Badge>
            <Badge variant="warning">
              {contentArticles.filter((a) => a.status === "review").length} In
              Review
            </Badge>
            <Badge variant="success">
              {contentArticles.filter((a) => a.status === "published").length}{" "}
              Published
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
                        {new Date(article.createdAt).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </span>
                      <div className="flex gap-1">
                        {article.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded bg-white/5 px-1.5 py-0.5 text-[9px] text-platinum-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                    {article.status === "draft" && (
                      <Button variant="secondary" size="sm" onClick={() => handleGenerate(`Review and improve this article draft: "${article.title}" - ${article.excerpt}. Provide editorial feedback and a polished version.`, "Review")}>
                        <Eye className="h-3 w-3" />
                        Review
                      </Button>
                    )}
                    {article.status === "review" && (
                      <Button variant="gold" size="sm" onClick={() => handleGenerate(`Finalize this article for publication: "${article.title}" - ${article.excerpt}. Write the final polished version ready for publishing.`, "Publish")}>
                        <Send className="h-3 w-3" />
                        Publish
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleGenerate(`Rewrite and improve this article: "${article.title}" - ${article.excerpt}. Make it more engaging, professional, and SEO-optimized.`, "Edit")}>
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
    </div>
  );
}
