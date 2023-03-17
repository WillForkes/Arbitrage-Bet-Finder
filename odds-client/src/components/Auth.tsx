import { UserContext } from "@/pages/_app";
import { useRouter } from "next/router";
import { useContext } from "react";

export default function Auth() {
  const user = useContext(UserContext);
  var router = useRouter();
  console.log(user);
  if (user.auth == false && typeof window !== "undefined") {
    router.push("/");
    return null;
  } else {
    return null;
  }
}
