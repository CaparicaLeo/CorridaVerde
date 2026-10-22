/**
 * Recebe o cadastro da lista de espera e grava no CRM da Thomé & Santos, na
 * lista do evento (`POST /api/events/{id}/lista-de-espera`), onde a equipe
 * lê, filtra e exporta em CSV/XLSX. `CRM_EVENT_SLUG` guarda o ID do evento,
 * e não o slug: o slug do CRM muda quando o evento é renomeado.
 *
 * Passar por aqui em vez de postar direto do navegador tira o token do CRM do
 * bundle (quem o tiver grava na lista de qualquer evento) e dispensa CORS. A
 * validação repete a do formulário: o navegador é conveniência, não garantia.
 *
 * Sem `CRM_API_URL`, `CRM_API_TOKEN` ou `CRM_EVENT_SLUG` a rota responde 503
 * e o formulário mostra o erro de envio — preview e dev não gravam lead de
 * teste na lista de produção sem querer.
 *
 * O webhook do n8n (`WAITLIST_WEBHOOK_URL`, a planilha da LP original) segue
 * opcional e secundário: se estiver configurado, recebe uma cópia, mas quem
 * decide se o cadastro deu certo é o CRM.
 */
const TEXT_FIELDS = [
  "nome",
  "email",
  "whatsapp",
  "cidade",
  "distancia",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "primeira_origem",
  "referrer",
  "dispositivo",
  "criado_em",
] as const;

const str = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  const crmUrl = process.env.CRM_API_URL?.replace(/\/+$/, "");
  const crmToken = process.env.CRM_API_TOKEN;
  const eventSlug = process.env.CRM_EVENT_SLUG;
  if (!crmUrl || !crmToken || !eventSlug) return Response.json({ ok: false }, { status: 503 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  // Campo-isca preenchido: responde sucesso para o robô não tentar de novo,
  // e não grava nada.
  if (str(body.empresa)) return Response.json({ ok: true });

  const data = Object.fromEntries(TEXT_FIELDS.map((k) => [k, str(body[k])]));
  const acceptsPartners = body.aceite_parceiros === true;
  const valid =
    data.nome.split(/\s+/).length >= 2 &&
    /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email) &&
    [10, 11].includes(data.whatsapp.replace(/\D/g, "").length) &&
    data.cidade.length >= 2 &&
    data.distancia.length > 0 &&
    body.aceite_aviso === true;
  if (!valid) return Response.json({ ok: false }, { status: 422 });

  try {
    // Os nomes de campo são os da API do CRM (StoreWaitlistEntryRequest).
    const resp = await fetch(`${crmUrl}/api/events/${encodeURIComponent(eventSlug)}/lista-de-espera`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${crmToken}`,
      },
      body: JSON.stringify({
        name: data.nome,
        email: data.email.toLowerCase(),
        phone: data.whatsapp,
        city: data.cidade,
        distance: data.distancia,
        accepts_notice: true,
        accepts_partners: acceptsPartners,
        utm_source: data.utm_source,
        utm_medium: data.utm_medium,
        utm_campaign: data.utm_campaign,
        utm_content: data.utm_content,
        utm_term: data.utm_term,
        first_origin: data.primeira_origem,
        referrer: data.referrer,
        device: data.dispositivo,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!resp.ok) {
      // O visitante vê só o erro genérico; o motivo (404 evento, 401 token,
      // 429 limite, 422 campo) fica no log da Vercel para quem for consertar.
      console.error(
        `[lista-de-espera] CRM respondeu ${resp.status}:`,
        (await resp.text().catch(() => "")).slice(0, 300),
      );
      // Só o código vai para o navegador — basta para quem abre a aba Rede
      // saber de que lado consertar, e não diz nada sobre a lista.
      return Response.json({ ok: false, crm: resp.status }, { status: 502 });
    }
  } catch (error) {
    console.error("[lista-de-espera] CRM inalcançável:", error);
    return Response.json({ ok: false, crm: "inalcançável" }, { status: 502 });
  }

  // Cópia para a planilha do n8n, quando configurada. Falha aqui não desfaz
  // o cadastro que o CRM já aceitou.
  const webhook = process.env.WAITLIST_WEBHOOK_URL;
  if (webhook) {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prova: eventSlug,
        ...data,
        email: data.email.toLowerCase(),
        aceite_aviso: true,
        aceite_parceiros: acceptsPartners,
      }),
      signal: AbortSignal.timeout(5_000),
    }).catch(() => {});
  }

  return Response.json({ ok: true });
}
