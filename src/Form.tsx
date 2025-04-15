import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const states = ["Connecticut", "New Jersey", "New York"] as const;

const UserSchema = z.object({
    firstName: z.string().min(1, "Please enter your first name."),
    lastName: z.string().min(1, "Please enter your last name."),
    email: z.string().email("Please enter a valid email address."),
    state: z.enum(states, {errorMap: () => ({ message: "Please select a state." }),}),
});

type FormData = z.infer<typeof UserSchema>;

export default function Formtofill() {
    const {
        register,
        handleSubmit,
        
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(UserSchema),
    });

    const onSubmit = (data: FormData) => {
        console.log("Submitted Data:", data);
        reset(); // Clear form after submission
    };

    return (
        <div
            style={{
            height: "100vh",
            width: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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
        </div>
        );
      
}