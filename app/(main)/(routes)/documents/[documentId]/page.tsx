"use client";

import EnhancedChatBot from "@/components/chat/enhanced-chat-bot";
import { Cover } from "@/components/cover";
import Editor from "@/components/editor";
import { Toolbar } from "@/components/toolbar";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

interface DocumentIdPageProps {
  params: {
    documentId: Id<"documents">;
  };
}

const DocumentIdPage = ({ params }: DocumentIdPageProps) => {
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
  });

  // const Editor = useMemo(
  //   () => dynamic(() => import("@/components/editor"), { ssr: false }),
  //   []
  // );

  const update = useMutation(api.documents.update);

  const onChange = (content: string) => {
    update({ id: params.documentId, content: content });
  };

  if (document === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }

  if (document === null) {
    return <div>Not found</div>;
  }

  const content = () => {
    let content: string | undefined = undefined;
    if (document && document.content)
      try {
        content = JSON.stringify(JSON.parse(document?.content));
      } catch (error) {
        content = JSON.stringify([
          {
            id: "1d730fd7-edf6-486a-8e62-82a3d744bf8f",
            type: "paragraph",
            props: {
              textColor: "default",
              backgroundColor: "default",
              textAlignment: "left",
            },
            content: [
              {
                type: "text",
                text: document.content,
                styles: {},
              },
            ],
            children: [],
          },
        ]);
      }
    return content;
  };
  const cont = content();

  return (
    <div className="pb-40">
      <Cover url={document.coverImage} />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
        <Editor onChange={onChange} initialContent={cont} />
      </div>
    </div>
  );
};

export default DocumentIdPage;
