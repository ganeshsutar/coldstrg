import { createFileRoute } from "@tanstack/react-router";
import { IssueListPage } from "@/features/bardana";

export const Route = createFileRoute("/_authenticated/bardana/issues")({
  component: IssueListPage,
});
