"use client";

import { register } from "@/lib/action";
import classes from "./page.module.css";
import Link from "next/link";
export default function Page() {
  return (
    <>
      <main className={classes.main}>
        <form action={register} className={classes.form}>
          <div className={classes.row}>
            <input type="email" name="email" placeholder="Email" required />
            <input
              type="text"
              name="username"
              placeholder="username"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
            />
          </div>
          {/* <div>{state.message && <p>{state.message}</p>}</div> */}
          <p className={classes.actions}>
            <button type="submit">Register</button>{" "}
          </p>
        </form>
        <Link style={{color:"white"}}href='/login'>Already have an account? Click here to login</Link>

      </main>
    </>
  );
}
