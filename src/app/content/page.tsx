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

export default function ContentPage() {
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
          <Button variant="secondary">
            <PenTool className="h-4 w-4" />
            Create Manual
          </Button>
          <Button variant="gold">
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
        <h2 className="text-base font-semibold text-white">
          Quick Generate
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Newspaper, label: "Travel Deal Article", color: "text-blue-400" },
            { icon: Mail, label: "Newsletter", color: "text-emerald-400" },
            { icon: Linkedin, label: "LinkedIn Post", color: "text-[#0077B5]" },
            { icon: Sparkles, label: "Success Story", color: "text-luxury-gold" },
          ].map((tool) => (
            <button
              key={tool.label}
              className="flex flex-col items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all hover:border-luxury-gold/20 hover:bg-white/[0.04]"
            >
              <tool.icon className={`h-6 w-6 ${tool.color}`} />
              <span className="text-xs font-medium text-platinum-300">
                {tool.label}
              </span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Content Pipeline */}
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
                initial={{ opacity: 0, y: 10 }}
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
                      <Button variant="secondary" size="sm">
                        <Eye className="h-3 w-3" />
                        Review
                      </Button>
                    )}
                    {article.status === "review" && (
                      <Button variant="gold" size="sm">
                        <Send className="h-3 w-3" />
                        Publish
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
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
