import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, nextAuthOptions);
  const { checked, policyKey } = req.body;

  const hasUserPermission = await prisma.userPermissions.findFirst({
    where: {
      userId: session?.user.id,
      policyKey: policyKey,
    },
  });

  if (checked) {
    if (!hasUserPermission) {
      await prisma.userPermissions.create({
        data: {
          policyKey: policyKey,
          user: {
            connect: {
              id: session?.user.id || "",
            },
          },
        },
      });
    }
  } else {
    if (hasUserPermission) {
      await prisma.userPermissions.delete({
        where: {
          id: hasUserPermission.id,
        },
      });
    }
  }

  return res.status(201).end();
}
