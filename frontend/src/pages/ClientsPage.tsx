import CrudPage from "../components/CrudPage";
import { clientService, type ClientInput } from "../services/clientService";
const empty: ClientInput = {
  nome: "",
  cpf: "",
  telefone: "",
  email: "",
  endereco: "",
};
export default function ClientsPage() {
  return (
    <CrudPage
      title="Clientes"
      empty={empty}
      service={clientService}
      fields={[
        { key: "nome", label: "Nome", minLength: 3, maxLength: 100 },
        {
          key: "cpf",
          label: "CPF (somente números)",
          pattern: "[0-9]{11}",
          maxLength: 11,
        },
        { key: "telefone", label: "Telefone", minLength: 8, maxLength: 20 },
        { key: "email", label: "E-mail", type: "email", maxLength: 100 },
        { key: "endereco", label: "Endereço", minLength: 10, maxLength: 255 },
      ]}
      columns={[
        { label: "Nome", render: (c) => c.nome },
        { label: "CPF", render: (c) => c.cpf },
        { label: "Telefone", render: (c) => c.telefone },
        { label: "E-mail", render: (c) => c.email },
        { label: "Endereço", render: (c) => c.endereco },
      ]}
      toInput={(c) => ({
        nome: c.nome,
        cpf: c.cpf.replace(/\D/g, ""),
        telefone: c.telefone,
        email: c.email,
        endereco: c.endereco,
      })}
    />
  );
}
