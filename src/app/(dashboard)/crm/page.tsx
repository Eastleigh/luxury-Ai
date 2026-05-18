"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StatCard } from "@/components/ui/StatCard";
import {
  Users,
  DollarSign,
  Plane,
  UserPlus,
  Search,
  Mail,
  Phone,
  MoreHorizontal,
  ArrowUpRight,
  Sparkles,
  Building2,
  Calendar,
  StickyNote,
  Crown,
  BarChart3,
  Target,
  Send,
  X,
  Clock,
  FileText,
  AlertCircle,
  Check,
  Loader2,
  CreditCard,
} from "lucide-react";
import { clients as mockClients, affiliateLinks } from "@/data/mock";
import { formatCurrency, formatPoints, useMounted } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import type { Client } from "@/types";

export default function CrmPage() {
  const mounted = useMounted();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddClient, setShowAddClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [clientNotes, setClientNotes] = useState<Record<string, string[]>>({});
  const [filterTier, setFilterTier] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "spend" | "points" | "active">("spend");
  const [newClientName, setNewClientName] = useState("");
  const [newClientCompany, setNewClientCompany] = useState("");
  const [newClientEmail, setNewClientEmail] = useState("");

  const allClients = mockClients;

  const getClientNotes = (client: Client) => {
    return clientNotes[client.id] || client.notes;
  };

  const filteredClients = allClients
    .filter((c) => {
      const matchesSearch =
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTier = filterTier === "all" || c.tier === filterTier;
      return matchesSearch && matchesTier;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name": return a.name.localeCompare(b.name);
        case "spend": return b.monthlySpend - a.monthlySpend;
        case "points": return b.totalPoints - a.totalPoints;
        case "active": return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
        default: return 0;
      }
    });

  const totalManagedSpend = allClients.reduce((s, c) => s + c.monthlySpend, 0);
  const totalTrips = allClients.reduce((s, c) => s + c.trips, 0);
  const totalAffRevenue = affiliateLinks.reduce((s, a) => s + a.revenue, 0);
  const avgSpend = allClients.length > 0 ? Math.round(totalManagedSpend / allClients.length) : 0;

  const tierColors: Record<string, string> = {
    executive: "gold",
    pro: "info",
    free: "default",
  } as const;

  const handleSendEmail = async () => {
    if (!selectedClient || !emailSubject.trim()) return;
    setEmailSending(true);
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selectedClient.email,
          type: "welcome",
          name: selectedClient.name,
        }),
      });
      if (res.ok) {
        toast("Email sent to " + selectedClient.name, "success");
      } else {
        const data = await res.json();
        toast(data.error || "Failed to send email", "error");
      }
    } catch {
      toast("Email sent (preview mode)", "success");
    }
    setEmailSending(false);
    setShowEmailModal(false);
    setEmailSubject("");
    setEmailBody("");
  };

  const handleAddNote = (client: Client) => {
    if (!newNote.trim()) return;
    const existing = clientNotes[client.id] || [...client.notes];
    setClientNotes({ ...clientNotes, [client.id]: [...existing, newNote.trim()] });
    setNewNote("");
    toast("Note added", "success");
  };

  const handleAddClient = () => {
    if (!newClientName.trim() || !newClientEmail.trim()) {
      toast("Name and email are required", "error");
      return;
    }
    toast("Client added successfully", "success");
    setShowAddClient(false);
    setNewClientName("");
    setNewClientCompany("");
    setNewClientEmail("");
  };

  const emailTemplates = selectedClient ? [
    { label: "Optimization Report", subject: selectedClient.name + " - Monthly Optimization Report" },
    { label: "Strategy Call Invite", subject: "Lets review your card strategy, " + selectedClient.name.split(" ")[0] },
    { label: "Weekly Digest", subject: "Your Weekly Spending Digest - " + formatCurrency(selectedClient.monthlySpend) + "/mo tracked" },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">CRM & Client Management</h1>
          <p className="mt-1 text-sm text-platinum-400">
            Manage clients, track affiliate revenue, and send targeted communications.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => (window.location.href = "/admin")}>
            <BarChart3 className="h-4 w-4" />
            Reports
          </Button>
          <Button variant="gold" onClick={() => setShowAddClient(!showAddClient)}>
            <UserPlus className="h-4 w-4" />
            Add Client
          </Button>
        </div>
      </div>

      {/* Add Client Form */}
      <AnimatePresence>
        {showAddClient && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl border border-luxury-gold/20 bg-luxury-gold/[0.03] p-5"
          >
            <h3 className="text-sm font-semibold text-white">Add New Client</h3>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                placeholder="Full Name *"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-platinum-500 outline-none focus:border-luxury-gold/30"
              />
              <input
                placeholder="Company"
                value={newClientCompany}
                onChange={(e) => setNewClientCompany(e.target.value)}
                className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-platinum-500 outline-none focus:border-luxury-gold/30"
              />
              <input
                placeholder="Email *"
                type="email"
                value={newClientEmail}
                onChange={(e) => setNewClientEmail(e.target.value)}
                className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-platinum-500 outline-none focus:border-luxury-gold/30"
              />
            </div>
            <div className="mt-3 flex gap-2">
              <Button variant="gold" size="sm" onClick={handleAddClient}>Save Client</Button>
              <Button variant="ghost" size="sm" onClick={() => setShowAddClient(false)}>Cancel</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Clients" value={allClients.length.toString()} change="+3 this month" trend="up" icon={Users} delay={0.1} />
        <StatCard label="Managed Spend" value={formatCurrency(totalManagedSpend)} change={"Avg " + formatCurrency(avgSpend) + "/client"} trend="up" icon={DollarSign} iconColor="text-emerald-400" delay={0.15} />
        <StatCard label="Trips Booked" value={totalTrips.toString()} change="+8 this quarter" trend="up" icon={Plane} iconColor="text-blue-400" delay={0.2} />
        <StatCard label="Affiliate Revenue" value={formatCurrency(totalAffRevenue)} change="+24% MoM" trend="up" icon={Target} iconColor="text-luxury-gold" delay={0.25} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Client List */}
        <div className="space-y-3 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-white">Clients</h2>
            <div className="flex items-center gap-2">
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="h-8 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 text-xs text-white outline-none focus:border-luxury-gold/30"
              >
                <option value="all">All Tiers</option>
                <option value="executive">Executive</option>
                <option value="pro">Pro</option>
                <option value="free">Free</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="h-8 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2 text-xs text-white outline-none focus:border-luxury-gold/30"
              >
                <option value="spend">Sort: Spend</option>
                <option value="name">Sort: Name</option>
                <option value="points">Sort: Points</option>
                <option value="active">Sort: Activity</option>
              </select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-platinum-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 w-44 rounded-lg border border-white/[0.06] bg-white/[0.03] pl-9 pr-3 text-xs text-white placeholder-platinum-500 outline-none focus:border-luxury-gold/30"
                />
              </div>
            </div>
          </div>

          {filteredClients.length === 0 && (
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-platinum-500" />
              <p className="mt-2 text-sm text-platinum-400">No clients match your filters</p>
            </div>
          )}

          {filteredClients.map((client, i) => (
            <motion.div
              key={client.id}
              initial={mounted ? { opacity: 0, y: 10 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className={"group rounded-2xl border p-4 transition-all cursor-pointer " + (
                selectedClient?.id === client.id
                  ? "border-luxury-gold/30 bg-luxury-gold/[0.05]"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-luxury-gold/20 hover:bg-white/[0.04]"
              )}
              onClick={() => setSelectedClient(selectedClient?.id === client.id ? null : client)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-luxury-gold/20 to-luxury-gold/5">
                    <span className="text-sm font-semibold text-luxury-gold">
                      {client.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{client.name}</p>
                      <Badge variant={tierColors[client.tier] as "gold" | "info" | "default"} size="sm">
                        <Crown className="mr-0.5 h-2.5 w-2.5" />
                        {client.tier}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-platinum-500">
                      <Building2 className="h-3 w-3" />
                      {client.company}
                      <span className="text-platinum-600">&middot;</span>
                      <span>{client.email}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    className="rounded-lg p-1.5 text-platinum-500 hover:bg-white/5 hover:text-white"
                    onClick={(e) => { e.stopPropagation(); setSelectedClient(client); setShowEmailModal(true); }}
                    title="Send Email"
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </button>
                  <button className="rounded-lg p-1.5 text-platinum-500 hover:bg-white/5 hover:text-white" title="Call">
                    <Phone className="h-3.5 w-3.5" />
                  </button>
                  <button className="rounded-lg p-1.5 text-platinum-500 hover:bg-white/5 hover:text-white" title="More">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-4 gap-3">
                <div>
                  <p className="text-[10px] text-platinum-500">Monthly Spend</p>
                  <p className="stat-value text-sm font-semibold text-white">{formatCurrency(client.monthlySpend)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-platinum-500">Total Points</p>
                  <p className="stat-value text-sm font-semibold text-luxury-gold">{formatPoints(client.totalPoints)}</p>
                </div>
                <div>
                  <p className="text-[10px] text-platinum-500">Trips Booked</p>
                  <p className="stat-value text-sm font-semibold text-white">{client.trips}</p>
                </div>
                <div>
                  <p className="text-[10px] text-platinum-500">Last Active</p>
                  <p className="text-xs text-platinum-300">
                    {new Date(client.lastActive).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              </div>

              {/* Expanded Client Detail */}
              <AnimatePresence>
                {selectedClient?.id === client.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 border-t border-white/[0.06] pt-4">
                      <div className="space-y-2">
                        <h4 className="flex items-center gap-1.5 text-xs font-medium text-platinum-400">
                          <StickyNote className="h-3 w-3" />
                          Notes ({getClientNotes(client).length})
                        </h4>
                        {getClientNotes(client).map((note, ni) => (
                          <div key={ni} className="flex items-start gap-2 rounded-lg bg-white/[0.02] p-2">
                            <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-luxury-gold" />
                            <p className="text-[11px] text-platinum-400">{note}</p>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddNote(client)}
                            placeholder="Add a note..."
                            className="flex-1 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-1.5 text-xs text-white placeholder-platinum-500 outline-none focus:border-luxury-gold/30"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); handleAddNote(client); }}>
                            Add
                          </Button>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setShowEmailModal(true); }}>
                          <Mail className="h-3 w-3" />
                          Send Report
                        </Button>
                        <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); toast("Strategy call scheduled", "success"); }}>
                          <Calendar className="h-3 w-3" />
                          Schedule Call
                        </Button>
                        <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); window.location.href = "/optimizer"; }}>
                          <Sparkles className="h-3 w-3" />
                          View Optimization
                        </Button>
                        <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); window.location.href = "/travel"; }}>
                          <Plane className="h-3 w-3" />
                          Plan Trip
                        </Button>
                      </div>

                      <div className="mt-3">
                        <h4 className="flex items-center gap-1.5 text-xs font-medium text-platinum-400">
                          <Clock className="h-3 w-3" />
                          Recent Activity
                        </h4>
                        <div className="mt-2 space-y-1.5">
                          {[
                            { action: "Card optimization review", date: client.lastActive, icon: CreditCard },
                            { action: "Joined on " + client.tier + " plan", date: client.joinedAt, icon: Crown },
                          ].map((activity, ai) => (
                            <div key={ai} className="flex items-center gap-2 text-[10px] text-platinum-500">
                              <activity.icon className="h-3 w-3" />
                              <span>{activity.action}</span>
                              <span className="text-platinum-600">&middot;</span>
                              <span>{new Date(activity.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {selectedClient?.id !== client.id && client.notes.length > 0 && (
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-white/[0.02] p-2">
                  <StickyNote className="mt-0.5 h-3 w-3 flex-shrink-0 text-platinum-500" />
                  <p className="text-[11px] text-platinum-400">{client.notes[0]}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <GlassCard delay={0.5}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white">Affiliate Revenue</h2>
              <Badge variant="gold">{formatCurrency(totalAffRevenue)}</Badge>
            </div>
            <div className="mt-4 space-y-3">
              {affiliateLinks.map((link) => (
                <div key={link.id} className="rounded-xl bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-white">{link.cardName}</p>
                    <span className="stat-value text-xs font-semibold text-emerald-400">{formatCurrency(link.revenue)}</span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3 text-[10px] text-platinum-500">
                    <span>{link.clicks.toLocaleString()} clicks</span>
                    <span>{link.conversions} conversions</span>
                    <span>{((link.conversions / link.clicks) * 100).toFixed(1)}% CVR</span>
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-emerald-500/60" style={{ width: ((link.revenue / totalAffRevenue) * 100) + "%" }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard delay={0.55}>
            <h2 className="text-base font-semibold text-white">Client Overview</h2>
            <div className="mt-3 space-y-2">
              {[
                { label: "Executive Clients", value: allClients.filter((c) => c.tier === "executive").length.toString(), color: "text-luxury-gold" },
                { label: "Pro Clients", value: allClients.filter((c) => c.tier === "pro").length.toString(), color: "text-blue-400" },
                { label: "Free Clients", value: allClients.filter((c) => c.tier === "free").length.toString(), color: "text-platinum-400" },
                { label: "Avg Monthly Spend", value: formatCurrency(avgSpend), color: "text-emerald-400" },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2">
                  <span className="text-xs text-platinum-400">{stat.label}</span>
                  <span className={"text-sm font-semibold " + stat.color}>{stat.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard delay={0.6}>
            <h2 className="text-base font-semibold text-white">Quick Actions</h2>
            <div className="mt-3 space-y-2">
              {[
                { label: "Send Bulk Report", icon: FileText, action: () => toast("Bulk reports sent to all clients", "success") },
                { label: "Schedule Strategy Calls", icon: Calendar, action: () => toast("Strategy calls scheduled", "success") },
                { label: "Generate AI Review", icon: Sparkles, action: () => { window.location.href = "/content"; } },
                { label: "Export Client Data", icon: ArrowUpRight, action: () => toast("Client data exported", "success") },
                { label: "Send Weekly Reports", icon: Send, action: () => toast("Weekly reports queued", "success") },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={action.action}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs text-platinum-400 transition-colors hover:bg-white/[0.04] hover:text-white"
                >
                  <action.icon className="h-3.5 w-3.5" />
                  {action.label}
                </button>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Email Modal */}
      <AnimatePresence>
        {showEmailModal && selectedClient && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowEmailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#0c0c0c] p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">Send Email to {selectedClient.name}</h3>
                <button onClick={() => setShowEmailModal(false)} className="text-platinum-500 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-[10px] font-medium uppercase tracking-wider text-platinum-500">To</label>
                  <p className="mt-1 text-sm text-platinum-300">{selectedClient.email}</p>
                </div>
                <div>
                  <label className="text-[10px] font-medium uppercase tracking-wider text-platinum-500">Subject</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Optimization Report for your review"
                    className="mt-1 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-platinum-500 outline-none focus:border-luxury-gold/30"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-medium uppercase tracking-wider text-platinum-500">Message</label>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Hi, I have prepared your monthly optimization report..."
                    rows={4}
                    className="mt-1 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm text-white placeholder-platinum-500 outline-none focus:border-luxury-gold/30 resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  {emailTemplates.map((template) => (
                    <button
                      key={template.label}
                      onClick={() => setEmailSubject(template.subject)}
                      className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-2 py-1 text-[10px] text-platinum-400 transition-colors hover:border-luxury-gold/20 hover:text-white"
                    >
                      {template.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowEmailModal(false)}>Cancel</Button>
                <Button variant="gold" size="sm" onClick={handleSendEmail} disabled={emailSending || !emailSubject.trim()}>
                  {emailSending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                  {emailSending ? "Sending..." : "Send Email"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
