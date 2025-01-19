"use client";

import { useEffect, useState } from "react";
import { FileText, Calendar, Clock, User } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

interface Agreement {
  _id: string;
  id: string;
  userid: string;
  expirationDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

function formatDate(date: string | null): string {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800";
    case "expired":
      return "bg-red-100 text-red-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-white "; // Updated for white theme
  }
}

export default function ListPage() {
  const router = useRouter();
  const [agreements, setAgreements] = useState<Agreement[]>([]);

  useEffect(() => {
    fetch("https://contract-management.onrender.com/contract/agreements")
      .then((response) => response.json())
      .then((data) => {
        setAgreements(data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const documents = useQuery(api.documents.getSidebar, {});



  if (!documents) return null;

  return (
    <div className="min-h-scree p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 p-5 backdrop-blur-xl">
          <h1 className="text-3xl font-bold">Agreements</h1>
          <p className="text-opacity-60 mt-1">
            Manage and track your active agreements
          </p>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-12rem)] pr-4 -mr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((agreement) => {
              const more = agreements.find((item) => item.id === agreement._id);
              if (more) {
                return (
                  <div
                    onClick={() => {router.push(`/documents/${agreement._id}`)}}
                    key={agreement._id}
                    className="bg-secondary/80 cursor-pointer rounded-xl border border-gray-700/20 shadow-black/5 hover:shadow-sm transition-shadow duration-200"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-bold ">
                            {agreement.title}
                          </h3>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(more.status)}`}
                        >
                          {more.status}
                        </span>
                      </div>

                      <div className="flex items-center mt-2 text-xs ">
                        <User className="h-4 w-4 mr-1" />
                        <span>{more.userid.slice(7,17)}</span>
                      </div>

                      <div className="mt-4 space-y-3">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 mr-2 " />
                          <span className="text-opacity-90 font-medium">
                            Expiration Date:
                          </span>
                          <span className="ml-2 ">
                            {formatDate(more.expirationDate)}
                          </span>
                        </div>

                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 " />
                          <span className="text-opacity-90 font-medium">
                            Last Updated:
                          </span>
                          <span className="ml-2 ">
                            {formatDate(more.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
