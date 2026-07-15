import React, { useState, useEffect, useMemo } from "react";
import {
  getFinanceRecords,
  addFinanceRecord,
  deleteFinanceRecord
} from "../../lib/db.js";
import {
  IconLoader,
  IconPlus,
  IconTrash,
  IconArrowUp,
  IconArrowDown,
  IconFilter,
  IconX,
  IconAlertTriangle
} from "@tabler/icons-react";
import useDocumentMetadata from "../../hooks/useDocumentMetadata.js";

const categoryOptions = ["Arena", "Machining", "Internship", "Salary", "Equipment", "Material", "Maintenance", "Other"];
const paymentModes = ["Cash", "UPI", "Bank Transfer", "Card", "Other"];

const emptyForm = {
  type: "income",
  amount: "",
  source: "",
  category: "",
  description: "",
  payment_mode: "",
  reference_id: "",
  record_date: new Date().toISOString().split("T")[0]
};

export default function FinanceAdmin() {
  useDocumentMetadata("Finance Tracker — TRBG", "Track income and expense records.");

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  /* form */
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  /* filters */
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");

  const loadRecords = async () => {
    setLoading(true);
    try {
      const { data, error } = await getFinanceRecords();
      if (error) throw error;
      setRecords(data || []);
    } catch {
      setErrorMsg("Failed to load finance records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRecords(); }, []);

  /* filtered records */
  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (filterType !== "all" && r.type !== filterType) return false;
      if (filterCategory && r.category !== filterCategory) return false;
      if (filterDateFrom && r.record_date < filterDateFrom) return false;
      if (filterDateTo && r.record_date > filterDateTo) return false;
      return true;
    });
  }, [records, filterType, filterCategory, filterDateFrom, filterDateTo]);

  /* summary */
  const summary = useMemo(() => {
    const income = filtered.filter((r) => r.type === "income").reduce((s, r) => s + Number(r.amount), 0);
    const expense = filtered.filter((r) => r.type === "expense").reduce((s, r) => s + Number(r.amount), 0);
    return { income, expense, net: income - expense };
  }, [filtered]);

  /* form handlers */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (formErrors[name]) setFormErrors((p) => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.amount || Number(formData.amount) <= 0) errs.amount = "Enter a valid amount.";
    if (!formData.source.trim()) errs.source = "Source is required.";
    if (!formData.record_date) errs.record_date = "Date is required.";
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
        source: formData.source.trim(),
        description: formData.description.trim() || null,
        reference_id: formData.reference_id.trim() || null,
        category: formData.category || null,
        payment_mode: formData.payment_mode || null
      };
      const { error } = await addFinanceRecord(payload);
      if (error) throw error;
      setSuccessMsg(`${formData.type === "income" ? "Income" : "Expense"} record added — ₹${formData.amount}`);
      setFormData(emptyForm);
      setShowForm(false);
      await loadRecords();
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch {
      setErrorMsg("Failed to add record.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this finance record permanently?")) return;
    try {
      const { error } = await deleteFinanceRecord(id);
      if (error) throw error;
      await loadRecords();
    } catch {
      alert("Failed to delete record.");
    }
  };

  const clearFilters = () => {
    setFilterType("all");
    setFilterCategory("");
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  const hasActiveFilters = filterType !== "all" || filterCategory || filterDateFrom || filterDateTo;

  const inputCls = (field) =>
    `w-full bg-[#080808] border ${formErrors[field] ? "border-red-500" : "border-[#1A1A1A]"} focus:border-fire outline-none p-3 text-[#F5F5F5] font-body text-sm rounded-none`;

  const fmt = (n) => n.toLocaleString("en-IN");

  return (
    <div className="space-y-8 select-none">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display text-4xl uppercase tracking-wider text-text-primary">
            FINANCE
          </h1>
          <p className="text-ash text-sm font-light">Track all income and expenses.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-fire hover:bg-[#cc3700] text-[#080808] font-display text-sm tracking-widest uppercase px-5 py-3 transition-colors rounded-none"
        >
          {showForm ? <IconX size={18} /> : <IconPlus size={18} />}
          {showForm ? "CANCEL" : "ADD RECORD"}
        </button>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="border border-red-500/30 bg-red-500/5 p-4 text-red-400 flex items-center gap-3 text-sm">
          <IconAlertTriangle size={18} /> {errorMsg}
          <button onClick={() => setErrorMsg("")} className="ml-auto text-red-400 hover:text-red-300"><IconX size={16} /></button>
        </div>
      )}
      {successMsg && (
        <div className="border border-green-500/30 bg-green-500/5 p-4 text-green-400 text-sm">
          {successMsg}
        </div>
      )}

      {/* Add Record Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#111111] border border-[#1A1A1A] p-6 md:p-8 space-y-6 rounded-none">
          <h2 className="font-display text-xl uppercase tracking-wider border-b border-[#1A1A1A] pb-3">New Record</h2>

          {/* Type Toggle */}
          <div className="flex gap-0">
            {["income", "expense"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFormData((p) => ({ ...p, type: t }))}
                className={`flex-1 py-3 font-display text-sm uppercase tracking-widest border transition-colors ${
                  formData.type === t
                    ? t === "income"
                      ? "bg-green-500/10 border-green-500/40 text-green-400"
                      : "bg-red-500/10 border-red-500/40 text-red-400"
                    : "bg-[#080808] border-[#1A1A1A] text-ash hover:text-text-primary"
                }`}
              >
                {t === "income" ? "↑ INCOME" : "↓ EXPENSE"}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Amount */}
            <div>
              <label className="text-[11px] uppercase tracking-widest text-ash/70 block mb-1">Amount (₹) *</label>
              <input name="amount" type="number" step="0.01" min="0" value={formData.amount} onChange={handleChange} className={inputCls("amount")} placeholder="0.00" />
              {formErrors.amount && <span className="text-red-500 text-xs mt-1 block">{formErrors.amount}</span>}
            </div>

            {/* Source */}
            <div>
              <label className="text-[11px] uppercase tracking-widest text-ash/70 block mb-1">Source / Paid To *</label>
              <input name="source" value={formData.source} onChange={handleChange} className={inputCls("source")} placeholder="e.g. Arena Booking — Team XYZ" />
              {formErrors.source && <span className="text-red-500 text-xs mt-1 block">{formErrors.source}</span>}
            </div>

            {/* Category */}
            <div>
              <label className="text-[11px] uppercase tracking-widest text-ash/70 block mb-1">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className={inputCls("category")}>
                <option value="">— Select —</option>
                {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Payment Mode */}
            <div>
              <label className="text-[11px] uppercase tracking-widest text-ash/70 block mb-1">Payment Mode</label>
              <select name="payment_mode" value={formData.payment_mode} onChange={handleChange} className={inputCls("payment_mode")}>
                <option value="">— Select —</option>
                {paymentModes.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="text-[11px] uppercase tracking-widest text-ash/70 block mb-1">Date *</label>
              <input name="record_date" type="date" value={formData.record_date} onChange={handleChange} className={inputCls("record_date")} />
              {formErrors.record_date && <span className="text-red-500 text-xs mt-1 block">{formErrors.record_date}</span>}
            </div>

            {/* Reference ID */}
            <div>
              <label className="text-[11px] uppercase tracking-widest text-ash/70 block mb-1">Reference / Invoice #</label>
              <input name="reference_id" value={formData.reference_id} onChange={handleChange} className={inputCls("reference_id")} placeholder="Optional" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] uppercase tracking-widest text-ash/70 block mb-1">Description / Notes</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className={`${inputCls("description")} min-h-[80px]`} placeholder="Optional details..." />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-fire hover:bg-[#cc3700] text-[#080808] font-display text-sm tracking-widest uppercase px-8 py-3 transition-colors disabled:opacity-50 rounded-none"
          >
            {submitting ? "SAVING..." : "SAVE RECORD"}
          </button>
        </form>
      )}

      {/* Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111111] border border-green-500/20 p-5">
          <span className="text-[11px] uppercase tracking-widest text-ash/70 block mb-1">Total Income</span>
          <span className="font-display text-3xl text-green-400">₹{fmt(summary.income)}</span>
        </div>
        <div className="bg-[#111111] border border-red-500/20 p-5">
          <span className="text-[11px] uppercase tracking-widest text-ash/70 block mb-1">Total Expenses</span>
          <span className="font-display text-3xl text-red-400">₹{fmt(summary.expense)}</span>
        </div>
        <div className={`bg-[#111111] border p-5 ${summary.net >= 0 ? "border-green-500/20" : "border-red-500/20"}`}>
          <span className="text-[11px] uppercase tracking-widest text-ash/70 block mb-1">Net Balance</span>
          <span className={`font-display text-3xl ${summary.net >= 0 ? "text-green-400" : "text-red-400"}`}>₹{fmt(summary.net)}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#111111] border border-[#1A1A1A] p-4 md:p-6 rounded-none">
        <div className="flex items-center justify-between mb-4">
          <span className="flex items-center gap-2 text-xs uppercase tracking-widest text-ash/70 font-semibold">
            <IconFilter size={14} /> Filters
          </span>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs text-fire hover:underline uppercase tracking-wider">
              Clear All
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="bg-[#080808] border border-[#1A1A1A] focus:border-fire outline-none p-2.5 text-[#F5F5F5] text-sm rounded-none">
            <option value="all">All Types</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-[#080808] border border-[#1A1A1A] focus:border-fire outline-none p-2.5 text-[#F5F5F5] text-sm rounded-none">
            <option value="">All Categories</option>
            {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} className="bg-[#080808] border border-[#1A1A1A] focus:border-fire outline-none p-2.5 text-[#F5F5F5] text-sm rounded-none" placeholder="From" />
          <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} className="bg-[#080808] border border-[#1A1A1A] focus:border-fire outline-none p-2.5 text-[#F5F5F5] text-sm rounded-none" placeholder="To" />
        </div>
      </div>

      {/* Records List */}
      <div className="bg-[#111111] border border-[#1A1A1A] p-6 md:p-8 space-y-4 rounded-none">
        <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-4">
          <h2 className="font-display text-2xl uppercase tracking-wider">Records</h2>
          <span className="text-xs text-ash/60 font-mono">{filtered.length} entries</span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <IconLoader className="animate-spin text-fire" size={32} />
            <span className="text-xs uppercase tracking-widest text-ash">Loading Records...</span>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-ash/60 italic text-center py-12">No records found.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => {
              const isIncome = r.type === "income";
              return (
                <div
                  key={r.id}
                  className={`p-4 bg-[#080808] border transition-all duration-200 ${
                    isIncome ? "border-green-500/15 hover:border-green-500/30" : "border-red-500/15 hover:border-red-500/30"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    {/* Left: info */}
                    <div className="space-y-1.5 flex-grow select-text">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 border ${
                          isIncome
                            ? "border-green-500/40 bg-green-500/5 text-green-400"
                            : "border-red-500/40 bg-red-500/5 text-red-400"
                        }`}>
                          {isIncome ? <IconArrowDown size={10} /> : <IconArrowUp size={10} />}
                          {r.type}
                        </span>
                        {r.category && (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 border border-fire/30 bg-fire/5 text-fire/80">
                            {r.category}
                          </span>
                        )}
                        {r.payment_mode && (
                          <span className="text-[10px] uppercase text-ash/50 font-mono">
                            {r.payment_mode}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-sm text-text-primary">{r.source}</h3>

                      {r.description && (
                        <p className="text-xs text-ash/60 leading-relaxed">{r.description}</p>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-ash/50 font-mono">
                        <span>{r.record_date}</span>
                        {r.reference_id && <><span>•</span><span>Ref: {r.reference_id}</span></>}
                      </div>
                    </div>

                    {/* Right: amount + delete */}
                    <div className="flex items-center gap-4 shrink-0">
                      <span className={`font-display text-2xl font-bold ${isIncome ? "text-green-400" : "text-red-400"}`}>
                        {isIncome ? "+" : "−"}₹{fmt(Number(r.amount))}
                      </span>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-2 border border-[#1A1A1A] hover:border-red-500 text-ash hover:text-red-500 bg-[#111111] transition-colors"
                        title="Delete record"
                      >
                        <IconTrash size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
