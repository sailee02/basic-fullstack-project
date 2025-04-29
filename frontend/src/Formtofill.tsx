import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { AgGridReact } from 'ag-grid-react';
import { ClientSideRowModelModule } from 'ag-grid-community';
import { ModuleRegistry } from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useState } from "react";

ModuleRegistry.registerModules([ClientSideRowModelModule]);

const states = ["Connecticut", "New Jersey", "New York"] as const;

const UserSchema = z.object({
  firstName: z.string().min(1, "Please enter your first name."),
  lastName: z.string().min(1, "Please enter your last name."),
  email: z.string().email("Enter a valid email address."),
  state: z.enum(states, {
    errorMap: () => ({ message: "Please select a state." }),
  }),
});

type FormData = z.infer<typeof UserSchema>;
type User = FormData & { id: number };

export default function Formtofill() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(UserSchema),
  });

  const [users, setUsers] = useState<User[]>([]);

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post<User>("http://localhost:8080/users", data);
      console.log("Saved User:", response.data);
      setUsers((prev) => [...prev, response.data]);
      reset();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const columnDefs = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 2, minWidth: 300 },
    { field: "state", headerName: "State", flex: 1 },
  ];

  return (
    <div
  style={{
    height: "100vh",
    width: "100vw",
    maxWidth: "100%",
    overflowX: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    boxSizing: "border-box",
  }}
>
      <div style={{ textAlign: "center" }}>
        <h1>Form</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            width: "300px",
            margin: "0 auto",
          }}
        >
          <input placeholder="First Name" {...register("firstName")} />
          {errors.firstName && <p>{errors.firstName.message}</p>}

          <input placeholder="Last Name" {...register("lastName")} />
          {errors.lastName && <p>{errors.lastName.message}</p>}

          <input placeholder="Email ID" type="email" {...register("email")} />
          {errors.email && <p>{errors.email.message}</p>}

          <select {...register("state")}>
            <option value="">Select a state</option>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.state && <p>{errors.state.message}</p>}

          <button type="submit">Submit</button>
        </form>
      </div>

      <div className="ag-theme-alpine" style={{ height: 200, width: 1000, marginTop: "2rem" }}>
        <AgGridReact rowData={users} columnDefs={columnDefs} />
      </div>
    </div>
  );
}
