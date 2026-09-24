import { useState, type FormEvent } from "react";
import { useCrud } from "../hooks/useCrud";
import Pagination from "./Pagination";
type Input = Record<string, string | number>;
export type Field = {
  key: string;
  label: string;
  type?: string;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  step?: string;
};
export default function CrudPage<T extends { id: number }, I extends Input>({
  title,
  empty,
  fields,
  service,
  columns,
  toInput,
}: {
  title: string;
  empty: I;
  fields: Field[];
  service: {
    findAll: (name?: string) => Promise<T[]>;
    create: (input: I) => Promise<T>;
    update: (id: number, input: I) => Promise<T>;
    remove: (id: number) => Promise<void>;
  };
  columns: { label: string; render: (row: T) => string | number }[];
  toInput: (row: T) => I;
}) {
  const crud = useCrud(service);
  const [form, setForm] = useState<I>(empty);
  const [id, setId] = useState<number>();
  const [page, setPage] = useState(1);
  const safePage = Math.min(
    page,
    Math.max(1, Math.ceil(crud.data.length / 10)),
  );
  function reset() {
    setId(undefined);
    setForm(empty);
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (await crud.save(form, id)) reset();
  }
  return (
    <div>
      <div className="page-heading">
        <h1>{title}</h1>
      </div>
      {crud.error && (
        <p className="form-error" role="alert">
          {crud.error}
        </p>
      )}
      <section className="panel compact-form-panel">
        <h2>{id ? "Editar registro" : "Novo registro"}</h2>
        <form className="form-grid" onSubmit={submit}>
          <fieldset disabled={crud.busy} className="form-fields">
            {fields.map((f) => (
              <label key={f.key}>
                {f.label}
                <input
                  required
                  type={f.type || "text"}
                  min={f.min}
                  max={f.max}
                  minLength={f.minLength}
                  maxLength={f.maxLength}
                  pattern={f.pattern}
                  step={f.step}
                  value={form[f.key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [f.key]:
                        f.type === "number"
                          ? Number(e.target.value)
                          : e.target.value,
                    })
                  }
                />
              </label>
            ))}
          </fieldset>
          <div className="heading-actions">
            <button className="primary-button" disabled={crud.busy}>
              {crud.busy ? "Salvando…" : id ? "Salvar alterações" : "Cadastrar"}
            </button>
            {id && (
              <button type="button" disabled={crud.busy} onClick={reset}>
                Cancelar edição
              </button>
            )}
          </div>
        </form>
      </section>
      <section className="panel list-panel">
        <div className="list-toolbar">
          <h2>Registros</h2>
          <label className="search-box">
            <input
              aria-label="Buscar por nome"
              placeholder="Buscar por nome…"
              value={crud.search}
              onChange={(e) => {
                crud.setSearch(e.target.value);
                setPage(1);
              }}
            />
          </label>
        </div>
        {crud.loading ? (
          <p role="status">Carregando…</p>
        ) : (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    {columns.map((c) => (
                      <th key={c.label}>{c.label}</th>
                    ))}
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {crud.data
                    .slice((safePage - 1) * 10, safePage * 10)
                    .map((row) => (
                      <tr key={row.id}>
                        {columns.map((c) => (
                          <td key={c.label}>{c.render(row)}</td>
                        ))}
                        <td>
                          <button
                            disabled={crud.busy}
                            className="outline-button"
                            onClick={() => {
                              setId(row.id);
                              setForm(toInput(row));
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                          >
                            Editar
                          </button>{" "}
                          <button
                            disabled={crud.busy}
                            className="outline-button"
                            onClick={() => void crud.remove(row.id)}
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            {!crud.data.length && (
              <p className="empty-state">Nenhum registro encontrado.</p>
            )}
            <Pagination
              page={safePage}
              total={crud.data.length}
              onChange={setPage}
            />
          </>
        )}
      </section>
    </div>
  );
}
