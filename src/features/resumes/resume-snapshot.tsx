import type { ResumeContent } from "@/types/resume";

const labels: Record<string, string> = {
  fullName: "Nome completo",
  professionalTitle: "Título profissional",
  email: "E-mail",
  phone: "Telefone",
  location: "Cidade e estado",
  linkedin: "LinkedIn",
  portfolio: "Portfólio",
  github: "GitHub",
  company: "Empresa",
  role: "Cargo",
  startDate: "Início",
  endDate: "Fim",
  current: "Emprego atual",
  description: "Descrição",
  achievements: "Resultados",
  institution: "Instituição",
  course: "Curso",
  degree: "Grau",
  period: "Período",
  status: "Situação",
  technical: "Técnicas",
  behavioral: "Comportamentais",
  tools: "Ferramentas",
  technologies: "Tecnologias",
  name: "Nome",
  date: "Data",
  link: "Link",
  level: "Nível",
};
function Details({ value }: { value: Record<string, string | boolean> }) {
  const entries = Object.entries(value).filter(([, text]) => Boolean(text));
  return entries.length ? (
    <dl className="space-y-2">
      {entries.map(([key, text]) => (
        <div key={key}>
          <dt className="text-xs font-medium text-muted-foreground">
            {labels[key] ?? key}
          </dt>
          <dd className="whitespace-pre-wrap break-words text-sm">
            {text === true ? "Sim" : text}
          </dd>
        </div>
      ))}
    </dl>
  ) : (
    <p className="text-sm text-muted-foreground">Não preenchido.</p>
  );
}
export function ResumeSnapshot({ content }: { content: ResumeContent }) {
  const sections = [
    { title: "Experiências", items: content.experiences },
    { title: "Formação", items: content.education },
    { title: "Certificações", items: content.certifications },
    { title: "Idiomas", items: content.languages },
    { title: "Projetos", items: content.projects },
  ];
  return (
    <div className="space-y-5">
      <section>
        <h3 className="mb-2 font-semibold">Dados pessoais</h3>
        <Details value={content.personal} />
      </section>
      <section>
        <h3 className="mb-2 font-semibold">Resumo profissional</h3>
        <p className="whitespace-pre-wrap break-words text-sm">
          {content.summary || "Não preenchido."}
        </p>
      </section>
      <section>
        <h3 className="mb-2 font-semibold">Habilidades</h3>
        <Details value={content.skills} />
      </section>
      {sections.map((section) => (
        <section key={section.title}>
          <h3 className="mb-2 font-semibold">{section.title}</h3>
          {section.items.length ? (
            section.items.map((item, index) => (
              <div key={index} className="mb-3 border-l-2 pl-3">
                <Details value={item} />
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum item.</p>
          )}
        </section>
      ))}
    </div>
  );
}
