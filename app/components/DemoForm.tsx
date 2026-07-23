"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type DemoFormProps = {
  variant: "events" | "contact";
};

const content = {
  events: {
    title: "Conte sobre o encontro",
    eyebrow: "Eventos sob medida",
    description: "Compartilhe os primeiros detalhes para que a equipe possa entender o formato, a data e o tamanho do evento.",
    button: "Conferir orçamento",
    success: "Preenchimento conferido. O envio está desativado nesta apresentação e nenhum dado foi transmitido.",
  },
  contact: {
    title: "Envie sua mensagem",
    eyebrow: "Converse com a casa",
    description: "Deixe sua dúvida, observação ou pedido. A equipe poderá responder pelo canal informado.",
    button: "Conferir mensagem",
    success: "Preenchimento conferido. O envio está desativado nesta apresentação e nenhum dado foi transmitido.",
  },
};

export default function DemoForm({ variant }: DemoFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);
  const subjectRef = useRef<HTMLSelectElement>(null);
  const copy = content[variant];

  useEffect(() => {
    if (submitted) statusRef.current?.focus();
  }, [submitted]);

  useEffect(() => {
    if (variant !== "contact" || !subjectRef.current) return;
    const requestedSubject = new URLSearchParams(window.location.search).get("assunto");
    if (!requestedSubject) return;
    const matchesOption = Array.from(subjectRef.current.options).some(
      (option) => option.value === requestedSubject,
    );
    if (matchesOption) subjectRef.current.value = requestedSubject;
  }, [variant]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    event.currentTarget.reset();
  }

  if (submitted) {
    return (
      <div className="form-success" role="status" tabIndex={-1} ref={statusRef}>
        <span aria-hidden="true">✓</span>
        <h2>Preenchimento concluído</h2>
        <p>{copy.success}</p>
        <button className="button button-outline" type="button" onClick={() => setSubmitted(false)}>
          Revisar novamente
        </button>
      </div>
    );
  }

  return (
    <form className={`demo-form demo-form-${variant}`} onSubmit={handleSubmit}>
      <div className="form-heading">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2>{copy.title}</h2>
        <p>{copy.description}</p>
      </div>

      <div className="form-grid">
        <label>
          <span className="field-name">Nome completo <span aria-hidden="true">*</span></span>
          <input name="name" autoComplete="name" required />
        </label>

        {variant === "events" ? (
          <label>
            <span className="field-name">Empresa</span>
            <input name="company" autoComplete="organization" />
          </label>
        ) : null}

        <label>
          <span className="field-name">Telefone <span aria-hidden="true">*</span></span>
          <input name="phone" type="tel" autoComplete="tel" placeholder="(11) 99999-9999" required />
        </label>
        <label>
          <span className="field-name">E-mail <span aria-hidden="true">*</span></span>
          <input name="email" type="email" autoComplete="email" required />
        </label>

        {variant === "events" ? (
          <>
            <label>
              <span className="field-name">Tipo de evento <span aria-hidden="true">*</span></span>
              <select name="eventType" defaultValue="" required>
                <option value="" disabled>Selecione</option>
                <option>Confraternização empresarial</option>
                <option>Aniversário</option>
                <option>Encontro de grupo</option>
                <option>Outro evento</option>
              </select>
            </label>
            <label>
              <span className="field-name">Data desejada <span aria-hidden="true">*</span></span>
              <input name="date" type="date" required />
            </label>
            <label>
              <span className="field-name">Estimativa de convidados <span aria-hidden="true">*</span></span>
              <input name="guests" type="number" min="1" max="40" inputMode="numeric" required />
            </label>
          </>
        ) : null}

        {variant === "contact" ? (
          <label>
            <span className="field-name">Assunto <span aria-hidden="true">*</span></span>
            <select ref={subjectRef} name="subject" defaultValue="" required>
              <option value="" disabled>Selecione</option>
              <option value="Reserva">Reserva</option>
              <option value="Evento">Evento</option>
              <option value="Cardápio">Cardápio</option>
              <option value="Acessibilidade">Acessibilidade</option>
              <option value="Outro assunto">Outro assunto</option>
            </select>
          </label>
        ) : null}

        <label className="field-full">
          <span className="field-name">{variant === "contact" ? "Mensagem" : "Observações"}</span>
          <textarea name="message" rows={5} />
        </label>
      </div>

      <label className="check-field">
        <input name="privacy" type="checkbox" required />
        <span>Li o aviso de que, nesta apresentação, os dados preenchidos não são transmitidos nem armazenados.</span>
      </label>

      <div className="form-footer">
        <p className="required-note"><span aria-hidden="true">*</span> Campos obrigatórios</p>
        <button className="button button-gold" type="submit">{copy.button}</button>
        <p className="form-disclaimer">Envio desativado nesta apresentação. O formulário demonstra o fluxo de atendimento sem transmitir informações.</p>
      </div>
    </form>
  );
}
