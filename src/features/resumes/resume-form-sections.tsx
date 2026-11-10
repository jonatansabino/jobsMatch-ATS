import { ResumeField, RepeatSection } from "./resume-fields";

export function ResumeFormSections() {
  return (
    <div className="space-y-7">
      <ResumeField name="name" label="Nome do currículo" />
      <section className="space-y-4 border-t pt-6">
        <h3 className="font-semibold">Dados pessoais</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <ResumeField name="content.personal.fullName" label="Nome completo" />
          <ResumeField
            name="content.personal.professionalTitle"
            label="Título profissional"
          />
          <ResumeField
            name="content.personal.email"
            label="E-mail"
            type="email"
          />
          <ResumeField
            name="content.personal.phone"
            label="Telefone"
            type="tel"
          />
          <ResumeField
            name="content.personal.location"
            label="Cidade e estado"
          />
          <ResumeField name="content.personal.linkedin" label="LinkedIn" />
          <ResumeField name="content.personal.portfolio" label="Portfólio" />
          <ResumeField name="content.personal.github" label="GitHub" />
        </div>
      </section>
      <ResumeField
        name="content.summary"
        label="Resumo profissional"
        multiline
      />
      <RepeatSection
        name="content.experiences"
        title="Experiências profissionais"
        singular="experiência"
        empty={{
          company: "",
          role: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
          achievements: "",
        }}
        fields={[
          { key: "company", label: "Empresa" },
          { key: "role", label: "Cargo" },
          { key: "startDate", label: "Data inicial", type: "month" },
          { key: "endDate", label: "Data final", type: "month" },
          {
            key: "description",
            label: "Atividades realizadas",
            multiline: true,
          },
          {
            key: "achievements",
            label: "Resultados e conquistas reais",
            multiline: true,
          },
        ]}
      />
      <RepeatSection
        name="content.education"
        title="Formação acadêmica"
        singular="formação"
        empty={{
          institution: "",
          course: "",
          degree: "",
          period: "",
          status: "",
        }}
        fields={[
          { key: "institution", label: "Instituição" },
          { key: "course", label: "Curso" },
          { key: "degree", label: "Grau" },
          { key: "period", label: "Período" },
          { key: "status", label: "Situação" },
        ]}
      />
      <section className="space-y-4 border-t pt-6">
        <h3 className="font-semibold">Habilidades</h3>
        <p className="text-xs text-muted-foreground">
          Liste somente competências que você possui, separadas por vírgula ou
          linha.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <ResumeField
            name="content.skills.technical"
            label="Técnicas"
            multiline
          />
          <ResumeField
            name="content.skills.behavioral"
            label="Comportamentais"
            multiline
          />
          <ResumeField
            name="content.skills.tools"
            label="Ferramentas"
            multiline
          />
          <ResumeField
            name="content.skills.technologies"
            label="Tecnologias"
            multiline
          />
        </div>
      </section>
      <RepeatSection
        name="content.certifications"
        title="Certificações"
        singular="certificação"
        empty={{ name: "", institution: "", date: "", link: "" }}
        fields={[
          { key: "name", label: "Nome da certificação" },
          { key: "institution", label: "Instituição certificadora" },
          { key: "date", label: "Data de emissão", type: "month" },
          { key: "link", label: "Link da certificação" },
        ]}
      />
      <RepeatSection
        name="content.languages"
        title="Idiomas"
        singular="idioma"
        empty={{ name: "", level: "" }}
        fields={[
          { key: "name", label: "Idioma" },
          { key: "level", label: "Nível" },
        ]}
      />
      <RepeatSection
        name="content.projects"
        title="Projetos"
        singular="projeto"
        empty={{ name: "", description: "", technologies: "", link: "" }}
        fields={[
          { key: "name", label: "Nome do projeto" },
          {
            key: "description",
            label: "Descrição do projeto",
            multiline: true,
          },
          { key: "technologies", label: "Tecnologias utilizadas" },
          { key: "link", label: "Link do projeto" },
        ]}
      />
    </div>
  );
}
