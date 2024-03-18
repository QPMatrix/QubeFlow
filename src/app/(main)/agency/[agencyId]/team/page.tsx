import Unauthorized from "@/components/unauthorized";
import { db } from "@/lib/db";
import React from "react";
import DataTable from "./data-table";
import { Plus } from "lucide-react";
import { currentUser } from "@clerk/nextjs";
import { columns } from "./columns";
import SendInvitation from "@/components/form/send-invitation";

type Props = {
  params: {
    agencyId: string;
  };
};

const TeamPage = async ({ params }: Props) => {
  const authUser = await currentUser();
  const teamMembers = await db.user.findMany({
    where: {
      Agency: {
        id: params.agencyId,
      },
    },
    include: {
      Agency: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    },
  });
  if (!authUser) return <Unauthorized />;
  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
    include: {
      SubAccount: true,
    },
  });
  if (!agencyDetails) return;
  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Add
        </>
      }
      modalChildren={
        <>
          {/* //WIP Fix invitation issue with clerk */}
          <SendInvitation agencyId={agencyDetails.id} />
        </>
      }
      columns={columns}
      data={teamMembers}
      filterValue="name"
    ></DataTable>
  );
};

export default TeamPage;
