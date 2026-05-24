import React from "react";
import { auth } from "@/auth";
import { getAdmins } from "@/app/admin/actions/admins";
import { AdminsClient } from "./AdminsClient";

export const metadata = {
  title: "Manage Admins - Kedai Sinau Admin",
};

export default async function ManageAdminsPage() {
  const session = await auth();
  const res = await getAdmins();
  
  return (
    <AdminsClient 
      admins={res.admins || []} 
      currentUserId={session?.user?.id ? Number(session.user.id) : null}
    />
  );
}
