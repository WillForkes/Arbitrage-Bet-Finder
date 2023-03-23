import { UserContext } from "@/pages/_app";
import { useRouter } from "next/router";
import { useContext } from "react";

export default function Auth() {
  const u = useContext(UserContext);
  var router = useRouter();

  if (u.auth == false && typeof window !== "undefined") {
    router.push("/");
    return null;
  } else {
    return null;
  }
}
