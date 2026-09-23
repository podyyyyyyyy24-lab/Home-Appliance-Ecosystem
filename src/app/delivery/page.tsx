import { redirect } from "next/navigation";

export default function DeliveryRedirect() {
  redirect("/admin/orders");
}
