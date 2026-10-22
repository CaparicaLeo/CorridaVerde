"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type InputHTMLAttributes } from "react";

import { ctaClasses } from "@/components/ui/CTAButton";
import { waitlist } from "@/data/event";
import { cn } from "@/lib/cn";

type FieldId = "name" | "email" | "whatsapp" | "city" | "distance" | "notice";
type Errors = Partial<Record<FieldId, string>>;
type Status = "idle" | "sending" | "success" | "error";

/** Ordem de foco quando o envio falha na validação: a mesma da tela. */
const FIELD_ORDER: FieldId[] = ["name", "email", "whatsapp", "city", "distance", "notice"];

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

/* Mesmas chaves da LP da organização: quem já passou por lá mantém a
   primeira origem registrada. */
const FIRST_ORIGIN_KEY = "cv27_primeira_origem";
const CREATED_AT_KEY = "cv27_criado_em";

/* localStorage pode lançar (aba anônima, cookie bloqueado): a primeira
   origem é conveniência de atribuição, nunca motivo para o envio falhar. */
const store = {
  get: (key: string) => {
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set: (key: string, value: string) => {
    try {
      window.localStorage.setItem(key, value);
    } catch {}
  },
};

/** (41) 99999-9999 enquanto digita; aceita fixo com 10 dígitos. */
function maskPhone(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
}

const rules: Record<Exclude<FieldId, "distance" | "notice">, (v: string) => boolean> = {
  name: (v) => v.trim().split(/\s+/).length >= 2,
  email: (v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()),
  whatsapp: (v) => [10, 11].includes(v.replace(/\D/g, "").length),
  city: (v) => v.trim().length >= 2,
};

const inputClasses =
  "w-full min-w-0 border border-line-strong bg-surface px-4 py-3.5 text-base text-ink transition-colors placeholder:text-ink-muted/70 hover:border-ink-muted aria-invalid:border-danger";

/**
 * Cadastro da lista de espera. Não é inscrição: só registra quem quer o aviso
 * de abertura. Posta em /api/lista-de-espera, que grava no CRM — assim o
 * token da API não vai para o navegador e não depende de CORS lá.
 *
 * Validação no blur e no envio; o erro fica escrito embaixo do campo, ligado
 * por `aria-describedby`, e o foco vai para o primeiro campo com problema
 * (inclusive a distância e o aceite, que a LP original pulava).
 */
export function WaitlistForm({ className }: { className?: string }) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState({ name: "", email: "", whatsapp: "", city: "" });
  const [distance, setDistance] = useState("");
  const [notice, setNotice] = useState(false);
  const [partners, setPartners] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const id = (field: string) => `${uid}-${field}`;

  // Primeira origem do visitante: gravada na primeira visita, lida no envio.
  useEffect(() => {
    if (store.get(FIRST_ORIGIN_KEY)) return;
    const source = new URLSearchParams(window.location.search).get("utm_source");
    store.set(FIRST_ORIGIN_KEY, source || "direto");
    store.set(CREATED_AT_KEY, new Date().toISOString());
  }, []);

  // O formulário some no sucesso; o foco segue para a confirmação, senão o
  // leitor de tela fica num elemento que não existe mais.
  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const errorFor = (field: FieldId, state = { ...values, distance, notice }): string => {
    if (field === "distance") return state.distance ? "" : waitlist.errors.distance;
    if (field === "notice") return state.notice ? "" : waitlist.errors.notice;
    return rules[field](state[field]) ? "" : waitlist.errors[field];
  };

  const validateField = (field: FieldId) =>
    setErrors((prev) => ({ ...prev, [field]: errorFor(field) }));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    const next: Errors = {};
    for (const field of FIELD_ORDER) {
      const msg = errorFor(field);
      if (msg) next[field] = msg;
    }
    setErrors(next);

    const firstInvalid = FIELD_ORDER.find((field) => next[field]);
    if (firstInvalid) {
      formRef.current
        ?.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`)
        ?.focus();
      return;
    }

    const form = e.currentTarget;
    const params = new URLSearchParams(window.location.search);
    const utm = Object.fromEntries(UTM_KEYS.map((k) => [k, params.get(k) ?? ""]));

    setStatus("sending");
    try {
      const resp = await fetch("/api/lista-de-espera", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          whatsapp: values.whatsapp,
          cidade: values.city.trim(),
          distancia: distance,
          aceite_aviso: true,
          aceite_parceiros: partners,
          ...utm,
          primeira_origem: store.get(FIRST_ORIGIN_KEY) || utm.utm_source || "direto",
          referrer: document.referrer,
          dispositivo: /Mobi|Android|iPhone/i.test(navigator.userAgent) ? "mobile" : "desktop",
          criado_em: store.get(CREATED_AT_KEY) ?? "",
          // Campo-isca: invisível para gente, preenchido por robô.
          empresa: (form.elements.namedItem("empresa") as HTMLInputElement | null)?.value ?? "",
        }),
      });
      const json = await resp.json().catch(() => ({}));
      if (!resp.ok || !json.ok) throw new Error("falha no envio");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className={cn("flex flex-col gap-4 border border-line bg-surface-alt p-6 outline-none sm:p-10", className)}
      >
        <span aria-hidden className="grid size-12 place-items-center rounded-full bg-accent text-xl text-forest">
          ✓
        </span>
        <h3 className="headline text-3xl sm:text-4xl">{waitlist.success.title}</h3>
        <p className="text-base leading-relaxed text-ink-muted">{waitlist.success.text}</p>
      </div>
    );
  }

  const describedBy = (field: FieldId) => (errors[field] ? id(`${field}-erro`) : undefined);

  const fieldError = (field: FieldId) =>
    errors[field] ? (
      <p id={id(`${field}-erro`)} className="text-sm text-danger">
        {errors[field]}
      </p>
    ) : null;

  const textField = (
    field: "name" | "email" | "whatsapp" | "city",
    props: InputHTMLAttributes<HTMLInputElement>,
  ) => (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor={id(field)} className="text-sm font-semibold">
        {waitlist.fields[field]}
      </label>
      <input
        id={id(field)}
        name={field}
        data-field={field}
        value={values[field]}
        onChange={(e) => {
          const value = field === "whatsapp" ? maskPhone(e.target.value) : e.target.value;
          setValues((prev) => ({ ...prev, [field]: value }));
        }}
        onBlur={() => validateField(field)}
        aria-invalid={errors[field] ? true : undefined}
        aria-describedby={describedBy(field)}
        required
        className={inputClasses}
        {...props}
      />
      {fieldError(field)}
    </div>
  );

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      className={cn("relative flex flex-col gap-6 border border-line bg-surface-alt p-6 sm:p-10", className)}
    >
      {textField("name", { type: "text", autoComplete: "name" })}
      {textField("email", { type: "email", autoComplete: "email", inputMode: "email" })}

      <div className="grid gap-6 sm:grid-cols-2">
        {textField("whatsapp", {
          type: "tel",
          autoComplete: "tel-national",
          inputMode: "numeric",
          placeholder: waitlist.fields.whatsappPlaceholder,
        })}
        {textField("city", { type: "text", autoComplete: "address-level2", list: id("cidades") })}
        <datalist id={id("cidades")}>
          {waitlist.cities.map((city) => (
            <option key={city} value={city} />
          ))}
        </datalist>
      </div>

      <fieldset
        className="flex flex-col gap-3"
        aria-invalid={errors.distance ? true : undefined}
        aria-describedby={describedBy("distance")}
      >
        <legend className="mb-3 text-sm font-semibold">{waitlist.fields.distance}</legend>
        {waitlist.distances.map((option, i) => (
          <label
            key={option.id}
            className={cn(
              "flex cursor-pointer items-center gap-3 border bg-surface px-4 py-3.5 text-sm transition-colors sm:text-base",
              distance === option.value
                ? "border-accent-ink"
                : "border-line-strong hover:border-ink-muted",
            )}
          >
            <input
              type="radio"
              name="distancia"
              value={option.value}
              checked={distance === option.value}
              data-field={i === 0 ? "distance" : undefined}
              onChange={() => {
                setDistance(option.value);
                setErrors((prev) => ({ ...prev, distance: "" }));
              }}
              className="size-4.5 shrink-0 accent-accent-ink"
            />
            <span>
              <b className="font-semibold">{option.miles}</b> · {option.km}
              <span className="text-ink-muted"> · {option.detail}</span>
            </span>
          </label>
        ))}
        {fieldError("distance")}
      </fieldset>

      <div className="flex flex-col gap-2">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-muted">
          <input
            type="checkbox"
            name="aceite_aviso"
            data-field="notice"
            checked={notice}
            onChange={(e) => {
              setNotice(e.target.checked);
              if (e.target.checked) setErrors((prev) => ({ ...prev, notice: "" }));
            }}
            aria-invalid={errors.notice ? true : undefined}
            aria-describedby={describedBy("notice")}
            className="mt-0.5 size-4.5 shrink-0 accent-accent-ink"
          />
          <span>{waitlist.consent.notice}</span>
        </label>
        {fieldError("notice")}
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-muted">
        <input
          type="checkbox"
          name="aceite_parceiros"
          checked={partners}
          onChange={(e) => setPartners(e.target.checked)}
          className="mt-0.5 size-4.5 shrink-0 accent-accent-ink"
        />
        <span>{waitlist.consent.partners}</span>
      </label>

      {/* Campo-isca fora da tela e da ordem de tabulação. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("empresa")}>Empresa</label>
        <input id={id("empresa")} name="empresa" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <p className="text-xs leading-relaxed text-ink-muted">
        {waitlist.privacy.text}{" "}
        <a
          href={waitlist.privacy.href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-accent-ink underline underline-offset-2"
        >
          {waitlist.privacy.linkLabel}
        </a>
        .
      </p>

      <button
        type="submit"
        disabled={status === "sending"}
        className={cn(
          ctaClasses(),
          "w-full cursor-pointer transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60",
        )}
      >
        {status === "sending" ? waitlist.sendingLabel : waitlist.submitLabel}
        <span aria-hidden className="text-base leading-none">
          →
        </span>
      </button>

      <p role="alert" className="text-sm text-danger empty:hidden">
        {status === "error" ? waitlist.errors.submit : ""}
      </p>
    </form>
  );
}
