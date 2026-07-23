import type { Metadata } from "next";
import PageHero from "../components/PageHero";

export const metadata: Metadata = { title: "Política de privacidade", description: "Como os formulários e o mapa do site Brasa do Vale tratam dados nesta apresentação." };

export default function PrivacyPage() {
  return (
    <main id="conteudo-principal">
      <PageHero eyebrow="Privacidade" title="Transparência sobre cada informação preenchida." description="Entenda como os formulários e o mapa se comportam nesta apresentação e quais cuidados devem ser observados durante a navegação." image="contact" />
      <section className="section section-cream"><article className="container legal-content">
        <p className="legal-updated">Atualizado em 20 de julho de 2026</p>
        <h2>1. Sobre esta apresentação</h2><p>Os formulários de evento e contato permitem conferir o preenchimento dos campos, mas ainda não estão ligados a um canal de atendimento.</p>
        <h2>2. Dados preenchidos</h2><p>Nome, telefone, e-mail, datas, quantidade de pessoas e mensagens permanecem somente no navegador durante a interação. Nenhuma dessas informações é transmitida, armazenada ou compartilhada. Por segurança, não utilize dados pessoais reais.</p>
        <h2>3. Mapa incorporado</h2><p>A página de contato incorpora um mapa do Google com a localização demonstrativa do Parque da Juventude. Ao carregar essa área, o Google pode receber informações técnicas da navegação de acordo com as próprias políticas.</p>
        <h2>4. Cookies e análise</h2><p>Não foram adicionadas ferramentas próprias de publicidade, análise comportamental ou marketing a esta versão.</p>
        <h2>5. Publicação comercial</h2><p>Antes de utilizar o site para atendimento real, será necessário conectar os formulários, inserir o endereço e os canais oficiais da empresa e revisar esta política com orientação jurídica adequada ao tratamento de dados adotado.</p>
      </article></section>
    </main>
  );
}
