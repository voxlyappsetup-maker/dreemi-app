"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { Plan } from "@dreemi/types";
import { Link, useRouter } from "../../../i18n/routing";
import {
  type Child,
  ApiError,
  fetchChildren,
  createChild,
  updateChild,
  deleteChild,
} from "../../../lib/api";
import { clearAuth, getStoredUser, isAuthenticated } from "../../../lib/storage";
import { DashboardSidebar } from "../../../components/DashboardSidebar";
import { FormError } from "../../../components/FormError";
import { INPUT_CLASS } from "../../../components/PasswordInput";
import { IconPencil, IconPlus, IconTrash, IconUsers } from "../../../components/icons";

const PAGE_BG = "min-h-screen bg-gradient-to-b from-violet-200 via-violet-50 to-white";

const BTN_PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60";

const SKIN_COLORS: Record<string, string> = {
  light: "#FDDCB5",
  medium: "#C68642",
  dark: "#8D5524",
};

const HAIR_COLORS: Record<string, string> = {
  black: "#1a1a1a",
  brown: "#6B3A2A",
  blonde: "#E8D44D",
  red: "#C0392B",
};

const CHILD_LIMITS: Record<string, number> = {
  FREE: 1,
  INDIVIDUAL: 1,
  FAMILY: 4,
  SCHOOL: Infinity,
};

const PERSONALITIES = ["curious", "brave", "calm", "energetic", "creative", "kind", "funny", "shy"] as const;
const ANIMALS = ["cat", "dog", "rabbit", "horse", "bird", "fish", "turtle", "dinosaur"] as const;

const ANIMAL_EMOJI: Record<string, string> = {
  cat: "🐱", dog: "🐶", rabbit: "🐰", horse: "🐴",
  bird: "🐦", fish: "🐠", turtle: "🐢", dinosaur: "🦕",
};

interface ChildFormData {
  name: string;
  age: number;
  gender: string;
  skinTone: string;
  hairColor: string;
  personality: string;
  hobbies: string;
  favAnimal: string;
}

const emptyForm: ChildFormData = {
  name: "",
  age: 5,
  gender: "boy",
  skinTone: "medium",
  hairColor: "black",
  personality: "",
  hobbies: "",
  favAnimal: "",
};

export default function ChildrenPage() {
  const router = useRouter();
  const t = useTranslations("children");
  const tc = useTranslations("common");
  const [ready, setReady] = useState(false);
  const [userPlan, setUserPlan] = useState<Plan>("FREE");
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [form, setForm] = useState<ChildFormData>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const list = await fetchChildren();
      setChildren(list);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearAuth();
        router.replace("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    const u = getStoredUser();
    if (u?.plan) setUserPlan(u.plan);
    setReady(true);
    load();
  }, [router, load]);

  function openAdd() {
    setEditingChild(null);
    setForm(emptyForm);
    setError(null);
    setModalOpen(true);
  }

  function openEdit(child: Child) {
    setEditingChild(child);
    setForm({
      name: child.name,
      age: child.age,
      gender: child.gender,
      skinTone: child.skinTone,
      hairColor: child.hairColor,
      personality: child.personality ?? "",
      hobbies: child.hobbies ?? "",
      favAnimal: child.favAnimal ?? "",
    });
    setError(null);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingChild(null);
    setError(null);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setError(t("errorName"));
      return;
    }
    if (form.age < 1 || form.age > 18) {
      setError(t("errorAge"));
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name.trim(),
        age: form.age,
        gender: form.gender,
        skinTone: form.skinTone,
        hairColor: form.hairColor,
        personality: form.personality || null,
        hobbies: form.hobbies.trim() || null,
        favAnimal: form.favAnimal || null,
      };
      if (editingChild) {
        await updateChild(editingChild.id, payload);
      } else {
        await createChild(payload);
      }
      closeModal();
      await load();
    } catch (err) {
      if (err instanceof ApiError && err.status === 403) {
        setError(t("limitReached"));
      } else {
        setError(t("errorSave"));
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteChild(id);
      setDeleteConfirmId(null);
      await load();
    } catch {
      setError(t("errorDelete"));
    }
  }

  if (!ready) {
    return (
      <main className={`flex items-center justify-center ${PAGE_BG}`}>
        <p className="text-slate-600">{tc("loading")}</p>
      </main>
    );
  }

  const limit = CHILD_LIMITS[userPlan] ?? 1;
  const canAdd = children.length < limit;

  return (
    <div className={`${PAGE_BG} lg:pe-64`}>
      <DashboardSidebar
        onLogout={() => { clearAuth(); router.replace("/login"); }}
        plan={userPlan}
      />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-8 lg:py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
            <p className="mt-1 text-sm text-slate-600">{t("subtitle")}</p>
          </div>
          {canAdd && (
            <button type="button" onClick={openAdd} className={`${BTN_PRIMARY} shrink-0 self-start sm:self-center`}>
              <IconPlus className="h-5 w-5" />
              {t("addChild")}
            </button>
          )}
        </div>

        {!canAdd && children.length > 0 && (
          <div className="mb-6 flex flex-col items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold">{t("limitReached")}</p>
              <p className="mt-1">{t("limitReachedDesc", { limit })}</p>
            </div>
            <Link href="/pricing" className="shrink-0 rounded-2xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-violet-700">
              {tc("upgradePlan")}
            </Link>
          </div>
        )}

        {loading ? (
          <p className="text-center text-slate-600">{tc("loading")}</p>
        ) : children.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-violet-200 bg-white p-12 text-center shadow-md">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">
              <IconUsers className="h-8 w-8 text-violet-600" />
            </div>
            <p className="text-lg font-medium text-slate-900">{t("noChildren")}</p>
            <p className="mt-2 text-sm text-slate-600">{t("noChildrenDesc")}</p>
            <button type="button" onClick={openAdd} className={`${BTN_PRIMARY} mt-6`}>
              <IconPlus className="h-5 w-5" />
              {t("addChild")}
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {children.map((child) => (
              <div
                key={child.id}
                className="relative rounded-2xl border border-violet-100 bg-white p-5 shadow-md transition hover:shadow-lg"
              >
                {deleteConfirmId === child.id ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-slate-700">
                      {t("deleteConfirm", { name: child.name })}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(child.id)}
                        className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                      >
                        {t("deleteChild")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(null)}
                        className="flex-1 rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-violet-50"
                      >
                        {t("cancel")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 flex items-start justify-between">
                      <Link href={`/children/${child.id}`} className="flex items-center gap-3 transition hover:opacity-80">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100">
                          <span className="text-xl">{child.gender === "girl" ? "👧" : "👦"}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{child.name}</h3>
                          <p className="text-sm text-slate-500">
                            {child.age} {child.age === 1 ? t("year") : t("years")}
                          </p>
                        </div>
                      </Link>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(child)}
                          className="rounded-xl p-2 text-slate-400 transition hover:bg-violet-50 hover:text-violet-600"
                          title={t("editChild")}
                        >
                          <IconPencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirmId(child.id)}
                          className="rounded-xl p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                          title={t("deleteChild")}
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-2.5 py-1 text-xs text-slate-600"
                      >
                        <span className="h-3 w-3 rounded-full border border-slate-200" style={{ backgroundColor: SKIN_COLORS[child.skinTone] ?? SKIN_COLORS.medium }} />
                        {t(`skin${child.skinTone.charAt(0).toUpperCase() + child.skinTone.slice(1)}` as "skinLight" | "skinMedium" | "skinDark")}
                      </span>
                      <span
                        className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-2.5 py-1 text-xs text-slate-600"
                      >
                        <span className="h-3 w-3 rounded-full border border-slate-200" style={{ backgroundColor: HAIR_COLORS[child.hairColor] ?? HAIR_COLORS.black }} />
                        {t(`hair${child.hairColor.charAt(0).toUpperCase() + child.hairColor.slice(1)}` as "hairBlack" | "hairBrown" | "hairBlonde" | "hairRed")}
                      </span>
                      <span className="rounded-lg bg-violet-50 px-2.5 py-1 text-xs text-slate-600">
                        {child.gender === "girl" ? t("girl") : t("boy")}
                      </span>
                      {child.personality && (
                        <span className="rounded-lg bg-purple-50 px-2.5 py-1 text-xs text-purple-600">
                          {t(`personality${child.personality.charAt(0).toUpperCase() + child.personality.slice(1)}` as `personalityCurious`)}
                        </span>
                      )}
                      {child.favAnimal && (
                        <span className="rounded-lg bg-amber-50 px-2.5 py-1 text-xs text-amber-700">
                          {ANIMAL_EMOJI[child.favAnimal] ?? ""} {t(`animal${child.favAnimal.charAt(0).toUpperCase() + child.favAnimal.slice(1)}` as `animalCat`)}
                        </span>
                      )}
                    </div>
                    {child.hobbies && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {child.hobbies.split(",").map((h) => h.trim()).filter(Boolean).map((h) => (
                          <span key={h} className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-500">{h}</span>
                        ))}
                      </div>
                    )}
                    {child._count && (
                      <p className="mt-3 text-xs text-slate-500">
                        {t("stories", { count: child._count.stories })}
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm">
          <div className="my-8 w-full max-w-md rounded-2xl border border-violet-100 bg-white p-6 shadow-xl sm:p-8">
            <h2 className="mb-6 text-xl font-bold text-slate-900">
              {editingChild ? t("editChild") : t("addChild")}
            </h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="childName" className="mb-1.5 block text-sm font-semibold text-slate-900">{t("name")}</label>
                <input
                  id="childName"
                  type="text"
                  maxLength={50}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder={t("namePlaceholder")}
                />
              </div>
              <div>
                <label htmlFor="childAge" className="mb-1.5 block text-sm font-semibold text-slate-900">{t("age")}</label>
                <input
                  id="childAge"
                  type="number"
                  min={1}
                  max={18}
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: Number(e.target.value) })}
                  className={INPUT_CLASS}
                />
              </div>

              {/* Gender */}
              <div>
                <span className="mb-1.5 block text-sm font-semibold text-slate-900">{t("gender")}</span>
                <div className="flex gap-2">
                  {(["boy", "girl"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setForm({ ...form, gender: g })}
                      className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                        form.gender === g
                          ? "border-violet-400 bg-violet-100 text-violet-700"
                          : "border-violet-100 bg-white text-slate-600 hover:bg-violet-50"
                      }`}
                    >
                      {g === "boy" ? `👦 ${t("boy")}` : `👧 ${t("girl")}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skin Tone */}
              <div>
                <span className="mb-1.5 block text-sm font-semibold text-slate-900">{t("skinTone")}</span>
                <div className="flex gap-3">
                  {(["light", "medium", "dark"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setForm({ ...form, skinTone: s })}
                      className={`flex flex-1 flex-col items-center gap-1 rounded-xl border px-3 py-2.5 transition ${
                        form.skinTone === s
                          ? "border-violet-400 ring-2 ring-violet-200"
                          : "border-violet-100 hover:border-violet-200"
                      }`}
                    >
                      <span className="block h-7 w-7 rounded-full border border-slate-200" style={{ backgroundColor: SKIN_COLORS[s] }} />
                      <span className="text-[10px] text-slate-600">{t(`skin${s.charAt(0).toUpperCase() + s.slice(1)}` as "skinLight" | "skinMedium" | "skinDark")}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hair Color */}
              <div>
                <span className="mb-1.5 block text-sm font-semibold text-slate-900">{t("hairColor")}</span>
                <div className="flex gap-3">
                  {(["black", "brown", "blonde", "red"] as const).map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setForm({ ...form, hairColor: h })}
                      className={`flex flex-1 flex-col items-center gap-1 rounded-xl border px-3 py-2.5 transition ${
                        form.hairColor === h
                          ? "border-violet-400 ring-2 ring-violet-200"
                          : "border-violet-100 hover:border-violet-200"
                      }`}
                    >
                      <span className="block h-7 w-7 rounded-full border border-slate-200" style={{ backgroundColor: HAIR_COLORS[h] }} />
                      <span className="text-[10px] text-slate-600">{t(`hair${h.charAt(0).toUpperCase() + h.slice(1)}` as "hairBlack" | "hairBrown" | "hairBlonde" | "hairRed")}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* Personality */}
              <div>
                <span className="mb-1.5 block text-sm font-semibold text-slate-900">{t("personalityLabel")}</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, personality: "" })}
                    className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                      !form.personality
                        ? "border-violet-400 bg-violet-100 text-violet-700"
                        : "border-violet-100 bg-white text-slate-500 hover:bg-violet-50"
                    }`}
                  >
                    {t("personalityNone")}
                  </button>
                  {PERSONALITIES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setForm({ ...form, personality: p })}
                      className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                        form.personality === p
                          ? "border-violet-400 bg-violet-100 text-violet-700"
                          : "border-violet-100 bg-white text-slate-600 hover:bg-violet-50"
                      }`}
                    >
                      {t(`personality${p.charAt(0).toUpperCase() + p.slice(1)}` as `personalityCurious`)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hobbies */}
              <div>
                <label htmlFor="hobbies" className="mb-1.5 block text-sm font-semibold text-slate-900">{t("hobbiesLabel")}</label>
                <input
                  id="hobbies"
                  type="text"
                  maxLength={200}
                  value={form.hobbies}
                  onChange={(e) => setForm({ ...form, hobbies: e.target.value })}
                  className={INPUT_CLASS}
                  placeholder={t("hobbiesPlaceholder")}
                />
              </div>

              {/* Favorite Animal */}
              <div>
                <span className="mb-1.5 block text-sm font-semibold text-slate-900">{t("favAnimalLabel")}</span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, favAnimal: "" })}
                    className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                      !form.favAnimal
                        ? "border-violet-400 bg-violet-100 text-violet-700"
                        : "border-violet-100 bg-white text-slate-500 hover:bg-violet-50"
                    }`}
                  >
                    {t("favAnimalNone")}
                  </button>
                  {ANIMALS.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setForm({ ...form, favAnimal: a })}
                      className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                        form.favAnimal === a
                          ? "border-violet-400 bg-violet-100 text-violet-700"
                          : "border-violet-100 bg-white text-slate-600 hover:bg-violet-50"
                      }`}
                    >
                      {ANIMAL_EMOJI[a]} {t(`animal${a.charAt(0).toUpperCase() + a.slice(1)}` as `animalCat`)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && <div className="mt-4"><FormError message={error} /></div>}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className={`${BTN_PRIMARY} flex-1`}
              >
                {saving ? t("saving") : t("save")}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 rounded-2xl border border-violet-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-violet-50"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
